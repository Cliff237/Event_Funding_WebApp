import { motion, type Variants } from 'framer-motion'
import { AlertCircle, CheckCircle, Pause,Lock, Plus, Search, Star,  Eye, Unlock, Trash, Clock, ChevronLeft, ChevronRight, Calendar, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react'
import type { Events } from '../../components/Organizer/Events/type';
import EventStatsModal from '../../components/Organizer/MyEventStatModal';
import apiRequest from '../../../utils/apiRequest';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  name: string;
  role: string;
  exp: number;
}

function MyEvent() {
  const [events, setEvents] = useState<Events[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // Client-side pagination metrics
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // decode user id from token once
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.id);
    } catch (e) {
      console.error('Invalid token', e);
    }
  }, []);

  const fetchEvents = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await apiRequest<{
        events: Events[];
        pagination: { currentPage: number; totalPages: number; totalEvents: number };
      }>(`/api/events/my-events/${userId}`, {
        method: 'GET',
        params: {
          // Fetch a large page and paginate on the client to keep original UX
          page: 1,
          limit: 1000,
        },
      });
      setEvents(res.events);
    } catch (err) {
      console.error('Failed to fetch events', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Client-side filter and pagination (original behavior)
  const filteredEvents = events.filter(ev => {
    const matchesStatus = filterStatus === 'all' || ev.status === filterStatus;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-200';
      case 'completed': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'locked': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      case 'paused': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('En-En', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      case 'locked': return <Lock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };
  const getDaysRemaining = (createdAt: string, deadline: string) => {
    const createdDate = new Date(createdAt);
    const deadlineDate = new Date(deadline);
    const now = new Date();

    if (now > deadlineDate) return 0;
    const totalDays = Math.ceil(
      (deadlineDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // calculate elapsed days since creation
    const elapsedDays = Math.floor(
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    // remaining days = total - elapsed
    const remainingDays = totalDays - elapsedDays;
    return remainingDays > 0 ? remainingDays : 0;
  };
  const truncateText = (text: string) => {
    if (!text) return "";
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  };
  const toggleEventLock = async (eventId: string) => {
    if (!userId) return;
    try {
      const updated = await apiRequest<{ id: string; isLocked: boolean; status: string; currentAmount: number; contributorCount: number }>(
        `/api/events/toggle-lock/${userId}/${eventId}`,
        { method: 'PATCH' }
      );
      setEvents(prev => prev.map(ev =>
        ev.id === updated.id ? { ...ev, isLocked: updated.isLocked, status: updated.status as any, currentAmount: updated.currentAmount, contributorCount: updated.contributorCount } : ev
      ));
    } catch (e) {
      console.error('Failed to toggle lock', e);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!userId) return;
    const confirmed = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await apiRequest(`/api/events/${userId}/${eventId}`, { method: 'DELETE' });
      setEvents(prev => {
        const updated = prev.filter(ev => ev.id !== eventId);
        // Adjust current page if we removed the last item on the last page
        const updatedFiltered = updated.filter(ev => {
          const matchesStatus = filterStatus === 'all' || ev.status === filterStatus;
          const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                ev.description.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesSearch;
        });
        const newTotalPages = Math.ceil(updatedFiltered.length / itemsPerPage) || 1;
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
        return updated;
      });
    } catch (e) {
      console.error('Failed to delete event', e);
      alert('Failed to delete the event. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } satisfies Variants;

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  } satisfies Variants;

  return (
    <div className="h-screen  overflow-y-auto  w-full overflow-x-hidden">
      <motion.div
        className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8 rounded-xl bg-gray-100 shadow-lg"
          variants={cardVariants}
        >
          <div className='p-3'>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-900 bg-clip-text text-transparent">
              My Events
            </h1>
            <p className="text-gray-600 mt-2">Manage and monitor your event campaigns</p>
          </div>

        </motion.div>

      {/* Filters and Search */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 mb-8"
        variants={cardVariants}
      >
        <div className="flex justify-between md:justify-around space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-2 items-center space-x-4">
            <div className="relative flex-2 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
              />
            </div>
            <div className='flex-1 flex justify-end'>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/70"
              >
                <option value="all">All Events</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="locked">Locked</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="bg-white md:grid grid-cols-1  gap-4 p-4 rounded-lg shadow-xl ">
      
        {/* table  */}
        <div className='overflow-x-scroll '>
          <table className="w-1/2 divide-y divide-gray-200">
            <thead className='bg-gray-50'>
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#Contributor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {paginatedEvents.map((event,index)=> (
                 <tr key={event.id} className=' text-gray-900'>
                   <td className="px-6 py-3 text-sm">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                   <td className="px-6 py-3 text-sm whitespace-nowrap ">{truncateText(event.title)}</td>
                   <td className="px-6 py-3 text-sm whitespace-nowrap">{event.contributorCount}</td>
                   <td className="px-6 py-3 text-sm whitespace-nowrap">
                    <div className='flex flex-col items-center'>
                      <span>{formatDate(event.deadline)}</span>
                      <span className={`rounded-full  px-2.5 text-xs font-medium
                        ${(getDaysRemaining(event.createdDate,event.deadline)==0)? 'bg-red-50 text-red-500':'bg-green-100 text-green-500'} `}>
                         {getDaysRemaining(event.createdDate,event.deadline)} days</span>
                    </div>
                   </td>
                   <td className='px-6 py-3 text-sm whitespace-nowrap'>{event.targetAmount ?? '-'}</td>
                   <td className="px-6 py-3 text-sm whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-600">
                      {event.currentAmount} 
                    </span>
                   </td>
                    
                   <td className="px-6 py-3 text-sm whitespace-nowrap ">
                      <div className={` flex items-center space-x-1 w-fit  px-2.5  rounded-full ${
                        getStatusColor(event.status)
                    }`}>
                      {getStatusIcon(event.status)}
                      <span>{event.status} </span>
                      </div>
                   </td>
                   <td className="px-6 py-3 text-sm ">
                      <div className='flex '>
                          <button
                          onClick={()=>{
                            setSelectedEvent(event);
                            setShowStatsModal(true);
                          }}
                           className={`p-2 rounded-lg cursor-pointer hover:bg-purple-100 text-purple-400 `}
                          >
                            <Eye size={20}/>
                          </button>
                          
                        
                          <button
                          onClick={() => handleDelete(event.id)}
                          className='p-2  rounded-lg cursor-pointer hover:bg-red-100 text-red-400'>
                            <Trash size={15}/>
                          </button>
                          {
                            (event.status==='completed')?
                              <button
                              className='p-2 rounded-lg cursor-pointer hover:bg-indigo-100 text-indigo-400 '>
                                <Clock size={20}/>
                              </button>
                              :
                              <button
                              onClick={() => toggleEventLock(event.id)}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                event.isLocked 
                                  ? 'hover:bg-orange-100 text-yellow-600 ' 
                                  : 'hover:bg-green-100 text-green-600'
                              }`}>
                                {event.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                              </button>
                            
                          }
                      </div>
                   </td>
                 </tr>
               ))}

             </tbody>
           
          </table>
          {/* Empty State */}
          {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Create your first event to start collecting contributions</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl shadow-lg font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </motion.button>
          </motion.div>
            )}
    
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t mb-5 border-gray-200">
          <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + (filteredEvents.length > 0 ? 1 : 0)} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} results
              </div>
              <div className="flex items-center space-x-2">
                  <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                      <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md text-sm ${
                          currentPage === page
                          ? 'bg-purple-800 text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                      >
                      {page}
                      </button>
                  );
                  })}
                  
                  <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
              </div>
          </div>
        </div> 
      </div>

      </motion.div>

       {/* Stats Modal */}
      {showStatsModal && selectedEvent && (
        <EventStatsModal 
          event={selectedEvent} 
          onClose={() => {
            setShowStatsModal(false);
            setSelectedEvent(null);
          }} 
        />
      )}

    </div>
  )
}

export default MyEvent