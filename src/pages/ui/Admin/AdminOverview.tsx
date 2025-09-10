import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calendar, Users, TrendingUp, Activity, School, Heart, Music, Briefcase, Search, Filter, RefreshCw } from 'lucide-react';

const SuperAdminOverview = () => {
  const [dateRange, setDateRange] = useState('30');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 1247,
    totalOrganizers: 89,
    schoolAdmins: 23,
    regularOrganizers: 66,
    recentGrowth: 12.5
  });

  // Events by category data
  const eventsByCategory = [
    { name: 'School Events', count: 456, color: '#8B5CF6', icon: School },
    { name: 'Weddings', count: 312, color: '#EF4444', icon: Heart },
    { name: 'Concerts', count: 234, color: '#10B981', icon: Music },
    { name: 'Corporate', count: 189, color: '#F59E0B', icon: Briefcase },
    { name: 'Others', count: 56, color: '#6B7280', icon: Activity }
  ];

  // Organizer distribution data
  const organizerData = [
    { name: 'Regular Organizers', value: 66, color: '#3B82F6' },
    { name: 'School Admins', value: 23, color: '#8B5CF6' }
  ];

  // Monthly trends data
  const monthlyTrends = [
    { month: 'Jan', events: 98, organizers: 12 },
    { month: 'Feb', events: 115, organizers: 8 },
    { month: 'Mar', events: 142, organizers: 15 },
    { month: 'Apr', events: 156, organizers: 11 },
    { month: 'May', events: 178, organizers: 19 },
    { month: 'Jun', events: 198, organizers: 24 }
  ];

  // Recent activity data
  const recentActivities = [
    { id: 1, type: 'event', message: 'New school event "Science Fair 2024" created', time: '2 hours ago', user: 'Marie Dubois (School Admin)' },
    { id: 2, type: 'organizer', message: 'New organizer registered', time: '4 hours ago', user: 'Jean Kamga' },
    { id: 3, type: 'event', message: 'Wedding event "Sarah & Paul" updated', time: '6 hours ago', user: 'Events Pro' },
    { id: 4, type: 'organizer', message: 'School admin activated', time: '1 day ago', user: 'Lycée Bilingue Admin' }
  ];

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
            <button 
              onClick={refreshData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.totalEvents.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+{dashboardData.recentGrowth}% vs last period</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Organizers</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.totalOrganizers}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Regular: {dashboardData.regularOrganizers}</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">School Admins</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.schoolAdmins}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Active institutions</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <School className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Rate</p>
              <p className="text-3xl font-bold text-gray-900">94%</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-green-600">Excellent engagement</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events by Category */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Events by Category</h3>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search categories..."
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {eventsByCategory.map((category) => {
              const Icon = category.icon;
              const percentage = ((category.count / dashboardData.totalEvents) * 100).toFixed(1);
              
              return (
                <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{backgroundColor: category.color + '20'}}>
                      <Icon className="h-5 w-5" style={{color: category.color}} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">{percentage}% of total events</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{category.count}</p>
                    <p className="text-sm text-gray-500">events</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organizer Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Organizer Distribution</h3>
            <Filter className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={organizerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {organizerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} organizers`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2 mt-4">
            {organizerData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: entry.color}}></div>
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-sm text-gray-600">New Organizers</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="events" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="organizers" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                activity.type === 'event' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {activity.type === 'event' ? (
                  <Calendar className={`h-4 w-4 ${activity.type === 'event' ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <Users className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">{activity.user}</p>
                  <span className="text-xs text-gray-400">•</span>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminOverview;