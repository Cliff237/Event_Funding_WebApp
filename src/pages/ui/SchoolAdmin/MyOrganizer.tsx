import  { useState } from 'react';
import { Search, MoreHorizontal, Edit,Eye, Mail, User, UserPlus } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

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


const MyOrganizers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [sortBy, setSortBy] = useState<SortableKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock users data based on your User model
  const [users, setUsers] = useState<AppUser[]>([
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@lycee-yaounde.edu.cm",
      role: "SCHOOL_ADMIN",
      profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      schoolId: 1,
      school: { name: "Lycée Bilingue de Yaoundé", id: 1 },
      eventsCount: 12,
      status: "active",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-09-01T14:20:00Z",
      lastLogin: "2024-09-03T09:15:00Z"
    },
    {
      id: 2,
      name: "Jean Kamga",
      email: "jean.kamga@gmail.com",
      role: "ORGANIZER",
      profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
      schoolId: null,
      school: null,
      eventsCount: 8,
      status: "active",
      createdAt: "2024-02-20T08:45:00Z",
      updatedAt: "2024-08-28T16:30:00Z",
      lastLogin: "2024-09-02T11:45:00Z"
    },
    {
      id: 3,
      name: "Sarah Mballa",
      email: "sarah.mballa@college-douala.edu.cm",
      role: "SCHOOL_ADMIN",
      profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      schoolId: 2,
      school: { name: "Collège Français de Douala", id: 2 },
      eventsCount: 15,
      status: "active",
      createdAt: "2024-03-10T12:15:00Z",
      updatedAt: "2024-09-01T10:45:00Z",
      lastLogin: "2024-09-04T08:30:00Z"
    }
  ]);


  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.school?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
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
  }satisfies Variants;

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
            <button className="px-4 py-2 bg-p text-white rounded-lg bg-gradient-to-r from-purple-800 to-indigo-800 hover:cursor-pointer flex items-center gap-2">
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
              placeholder="Search by name, email, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | Status)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

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
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                Deactivate
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
                  Events
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
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
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
              <p className="text-center text-gray-500">No users found</p>
              <button className="mt-4 px-4 py-2 rounded-lg text-white bg-gradient-to-br from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 transition-colors">Add New User</button>
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
    </div>
  );
};

export default MyOrganizers;