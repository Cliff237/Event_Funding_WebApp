import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Eye, 
  X, 
  Shield, 
  Users, 
  Calendar,
  DollarSign,
  Settings,
  UserCheck,
  UserX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// User interfaces
interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'school_admin' | 'organizer';
  status: 'active' | 'suspended' | 'pending';
  schoolName?: string;
  createdAt: string;
  lastLogin?: string;
  eventsCount?: number;
  totalRaised?: number;
}

interface NewUser {
  name: string;
  email: string;
  username: string;
  role: 'school_admin' | 'organizer';
  schoolName: string;
  password: string;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@stmarys.edu',
    username: 'john_admin',
    role: 'school_admin',
    status: 'active',
    schoolName: 'St. Mary\'s High School',
    createdAt: '2024-01-15',
    lastLogin: '2024-12-06',
    eventsCount: 8,
    totalRaised: 2500000
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@stmarys.edu',
    username: 'sarah_organizer',
    role: 'organizer',
    status: 'active',
    schoolName: 'St. Mary\'s High School',
    createdAt: '2024-02-20',
    lastLogin: '2024-12-05',
    eventsCount: 4,
    totalRaised: 1200000
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@greenfield.edu',
    username: 'michael_admin',
    role: 'school_admin',
    status: 'pending',
    schoolName: 'Greenfield Academy',
    createdAt: '2024-11-30',
    eventsCount: 0,
    totalRaised: 0
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@riverside.edu',
    username: 'emily_organizer',
    role: 'organizer',
    status: 'suspended',
    schoolName: 'Riverside College',
    createdAt: '2024-03-10',
    lastLogin: '2024-11-28',
    eventsCount: 2,
    totalRaised: 450000
  }
];

export function SuperAdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    username: '',
    role: 'organizer',
    schoolName: '',
    password: ''
  });

  // Filter functions
  const getFilteredUsers = (): User[] => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.schoolName && user.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  // CRUD functions
  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      status: 'active',
      schoolName: newUser.schoolName,
      createdAt: new Date().toISOString().split('T')[0],
      eventsCount: 0,
      totalRaised: 0
    };
    
    setUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', username: '', role: 'organizer', schoolName: '', password: '' });
    setShowAddDialog(false);
    
    console.log('New User Added:', user);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    console.log('User Deleted:', id);
  };

  const handleStatusChange = (id: string, newStatus: User['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    console.log('User Status Changed:', { id, newStatus });
  };

  // Statistics
  const getStats = () => {
    const total = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingUsers = users.filter(u => u.status === 'pending').length;
    const suspendedUsers = users.filter(u => u.status === 'suspended').length;
    const schoolAdmins = users.filter(u => u.role === 'school_admin').length;
    const organizers = users.filter(u => u.role === 'organizer').length;
    
    return {
      total,
      active: activeUsers,
      pending: pendingUsers,
      suspended: suspendedUsers,
      schoolAdmins,
      organizers
    };
  };

  const getStatusBadgeVariant = (status: User['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: User['role']) => {
    return role === 'school_admin' ? 'default' : 'secondary';
  };

  const stats = getStats();
  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-gradient-card p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage all school administrators and event organizers
            </p>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-hero hover:shadow-glow transition-smooth">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={newUser.name}
                      onChange={(e:any) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="User's full name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e:any) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@school.edu"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={newUser.username}
                      onChange={(e:any) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Unique username"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={newUser.role} onValueChange={(value: 'school_admin' | 'organizer') => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="school_admin">School Administrator</SelectItem>
                        <SelectItem value="organizer">Event Organizer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>School Name</Label>
                  <Input
                    value={newUser.schoolName}
                    onChange={(e:any) => setNewUser(prev => ({ ...prev, schoolName: e.target.value }))}
                    placeholder="School or institution name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e:any) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Secure password"
                    className="mt-2"
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddUser}
                    disabled={!newUser.name || !newUser.email || !newUser.username || !newUser.password}
                    className="flex-1 bg-gradient-success"
                  >
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserCheck className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Settings className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserX className="w-8 h-8 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.suspended}</div>
              <div className="text-sm text-muted-foreground">Suspended</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.schoolAdmins}</div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.organizers}</div>
              <div className="text-sm text-muted-foreground">Organizers</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e:any) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="school_admin">School Admins</SelectItem>
              <SelectItem value="organizer">Organizers</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card className="shadow-large">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">User</th>
                    <th className="text-left p-4 font-semibold">Role</th>
                    <th className="text-left p-4 font-semibold">School</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Events</th>
                    <th className="text-left p-4 font-semibold">Total Raised</th>
                    <th className="text-left p-4 font-semibold">Last Login</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">@{user.username}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role === 'school_admin' ? 'Admin' : 'Organizer'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{user.schoolName}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">{user.eventsCount || 0}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">
                          {user.totalRaised ? `${user.totalRaised.toLocaleString()} FCFA` : '0 FCFA'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {user.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          )}
                          {user.status === 'suspended' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(user.id, 'active')}
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                          {user.status === 'pending' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStatusChange(user.id, 'active')}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* User Details Modal */}
        <Dialog
          open={selectedUser !== null}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedUser && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedUser.name} - User Details
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span>Full Name:</span>
                            <span className="font-medium">{selectedUser.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Email:</span>
                            <span className="font-medium">{selectedUser.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Username:</span>
                            <span className="font-medium">@{selectedUser.username}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Role:</span>
                            <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                              {selectedUser.role === 'school_admin' ? 'School Administrator' : 'Event Organizer'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge variant={getStatusBadgeVariant(selectedUser.status)}>
                              {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>School:</span>
                            <span className="font-medium">{selectedUser.schoolName}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Activity Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span>Events Created:</span>
                            <span className="font-bold text-primary">{selectedUser.eventsCount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Raised:</span>
                            <span className="font-bold text-success">
                              {selectedUser.totalRaised ? `${selectedUser.totalRaised.toLocaleString()} FCFA` : '0 FCFA'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Member Since:</span>
                            <span className="font-medium">
                              {new Date(selectedUser.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Login:</span>
                            <span className="font-medium">
                              {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity">
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Activity logs and event history would be displayed here
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings">
                    <div className="text-center py-8">
                      <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        User settings and permissions would be managed here
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}