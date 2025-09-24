import  { useEffect, useState, type ChangeEvent } from 'react';
import { Search,  Edit,Eye, Mail, User, UserPlus, Trash } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import Modal from '../../components/Organizer/Modal';
import { FaCheck, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiRequest from '../../../utils/apiRequest';
import { jwtDecode } from 'jwt-decode';

type Role = 'SCHOOL_ADMIN' | 'ORGANIZER';
type Status = 'active' | 'inactive';
type SortOrder = 'asc' | 'desc';
type SortableKey = 'createdAt' | 'updatedAt' | 'name' | 'eventsCount';

interface SchoolRef { id: number; name: string; }

interface AppUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  profile: string;
  schoolId: number | null;
  school: SchoolRef | null;
  eventsCount: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface DecodedToken {
  id: number;
  name: string;
  role: string;
  exp: number;
}

const MyOrganizers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortableKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModel, setShowModel] = useState(false)
  const [showShareModel, setShowShareModel] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState<'single' | 'bulk'>('single');
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [organizerData, setOrganizerData]= useState({
    name:'',
    email:'',
    password:''
  });
  const handleInputChange =(e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target
    setOrganizerData({
      ...organizerData,[name]:value
    });
  }

  const deleteOrganizer = async (organizerId: number) => {
    if (!adminId) return;
    try {
      await apiRequest(`/api/school-admin/${adminId}/organizers/${organizerId}`, { method: 'DELETE' });
      setUsers(prev => {
        const updated = prev.filter(u => u.id !== organizerId);
        // Adjust pagination if needed
        const filtered = updated.filter(user => {
          const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (user.school?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
          return matchesSearch;
        });
        const newTotalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
        return updated;
      });
      setSelectedUsers(prev => prev.filter(id => id !== organizerId));
      toast.success('Organizer deleted');
    } catch (e: any) {
      const msg = e?.error || e?.message || 'Failed to delete organizer';
      toast.error(msg);
    }
  };

  const bulkDeleteOrganizers = async () => {
    if (!adminId) return;
    if (selectedUsers.length === 0) return;
    try {
      await apiRequest(`/api/school-admin/${adminId}/organizers`, {
        method: 'DELETE',
        data: { ids: selectedUsers },
      });
      setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
      // Adjust pagination if needed
      const newFilteredCount = filteredUsers.length - selectedUsers.length;
      const newTotalPages = Math.ceil(Math.max(0, newFilteredCount) / itemsPerPage) || 1;
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
      toast.success('Selected organizers deleted');
    } catch (e: any) {
      const msg = e?.error || e?.message || 'Failed to delete selected organizers (some may have events)';
      toast.error(msg);
    }
  };

  const openConfirmSingle = (id: number) => {
    setPendingId(id);
    setConfirmMode('single');
    setConfirmOpen(true);
  };

  const openConfirmBulk = () => {
    if (selectedUsers.length === 0) return;
    setPendingId(null);
    setConfirmMode('bulk');
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (confirmMode === 'single' && pendingId != null) {
      await deleteOrganizer(pendingId);
    } else if (confirmMode === 'bulk') {
      await bulkDeleteOrganizers();
    }
    setConfirmOpen(false);
    setPendingId(null);
  };

  // Users managed by this school admin (fetched from backend)
  const [users, setUsers] = useState<AppUser[]>([]);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // decode school admin id from JWT
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setAdminId(decoded.id);
    } catch (err) {
      console.error('Failed to decode token', err);
    }
  }, []);

  const fetchOrganizers = async () => {
    if (!adminId) return;
    setLoading(true);
    try {
      const data = await apiRequest<AppUser[]>(`/api/school-admin/${adminId}/organizers`, { method: 'GET' });
      setUsers(data);
    } catch (e) {
      console.error('Failed to fetch organizers', e);
      toast.error('Failed to load organizers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.school?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch ;
    })
    .sort((a, b) => {
      const getSortValue = (u: AppUser): string | number | Date => {
        switch (sortBy) {
          case 'createdAt':
            return new Date(u.createdAt);
          case 'updatedAt':
            return new Date(u.updatedAt);
          case 'name':
            return u.name.toLowerCase();
          case 'eventsCount':
            return u.eventsCount;
        }
      };

      const aValue = getSortValue(a);
      const bValue = getSortValue(b);

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  const getStatusBadge = (status: Status) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const truncateText = (text: string) => {
    if (!text) return "";
    return text.length > 20 ? text.substring(0, 20) + "..." : text;
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {y: 0,opacity: 1,
      transition: { type: "spring", stiffness: 100
      }
    }
  } satisfies Variants;

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault();
    if (!adminId) return;
    try {
      await apiRequest(`/api/school-admin/${adminId}/organizers`, {
        method: 'POST',
        data: {
          name: organizerData.name,
          email: organizerData.email,
          password: organizerData.password,
        },
      });
      toast.success(`${organizerData.name} organizer created`);
      setShowModel(false);
      setOrganizerData({ name: '', email: '', password: '' });
      fetchOrganizers();
    } catch (err: any) {
      const msg = err?.error || err?.message || 'Failed to create organizer';
      toast.error(msg);
    }
  }

  return (
    <div className="h-screen w-full overflow-y-scroll  overflow-x-hidden p-6">
      {/* Header */}
      <div className="mb-8 rounded-xl bg-gray-100 shadow-lg p-3">
        <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent">Organizer Management</h1>
            <p className="text-gray-600 mt-1">Manage Your Organizers.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
            onClick={()=>{setShowModel(true)}}
            className="px-4 py-2 bg-p text-white rounded-lg bg-gradient-to-r from-purple-800 to-indigo-800 hover:cursor-pointer flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Organizer
            </button>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as SortableKey);
                setSortOrder(order as SortOrder);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="eventsCount-desc">Most Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-purple-800">
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                Send Email
              </button>
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                Activate
              </button>
              <button onClick={openConfirmBulk} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white md:grid grid-cols-1  gap-4 p-4 rounded-lg shadow-xl ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-purple-600 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name/Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-purple-600 rounded border-gray-300"
                    />
                    <span className='ml-2.5'>{user.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.profile}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                  
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{truncateText(user.name)}</div>
                      <div className="text-sm text-gray-500">{truncateText(user.email)}</div>
                  </td>
      
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.eventsCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button onClick={() => openConfirmSingle(user.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty set  */}
          {filteredUsers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 flex flex-col justify-center items-center"
            >
              <span>
                <div className="rounded-full p-4 bg-gradient-to-br from-purple-700 to-indigo-700">
                  <User className="h-12 w-12 text-white " />
                </div>
              </span>
              <p className="text-center text-gray-500">No Organizers found😢</p>
              <button 
              onClick={()=>{setShowModel(true)}}
              className="mt-4 px-4 py-2 rounded-lg text-white bg-gradient-to-br from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 transition-colors">
                Add Organizer  
              </button>
            </motion.div> 
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <p>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800 bg-purple-700"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'border-gray-300 text-gray-500 bg-purple-100 '
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800 bg-purple-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModel &&(
        <Modal
        isOpen={showModel} onClose={()=>setShowModel(false)}
        >
          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className='mb-3'>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Organizer Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400" />
                </div>
                <input
                  required
                  type="text"
                  id="name"
                  name='name'
                  value={organizerData.name}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Organizer name"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className='mb-3'>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Organizer Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" />
                </div>
                <input
                  required
                  type="email"
                  id="email"
                  name='email'
                  value={organizerData.email}
                  onChange={handleInputChange}
                  className={`pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="organizer@example.com"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className='mb-2'>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEye className="text-gray-400" />
                </div>
                <input
                  required
                  type="password"
                  id="password"
                  name='password'
                  value={organizerData.password}
                  onChange={handleInputChange}
                  className={`pl-10  w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="...."
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-2 px-4 rounded-lg transition-time flex items-center justify-center"
              >
                <FaCheck className="mr-2" /> Create Organizer
              </button>
            </motion.div>
          </form>
        </Modal>
      )}

      {confirmOpen && (
        <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <div className="p-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">
              {confirmMode === 'single'
                ? 'Are you sure you want to delete this organizer? This action cannot be undone.'
                : `Are you sure you want to delete ${selectedUsers.length} selected organizer(s)? This action cannot be undone.`}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default MyOrganizers;