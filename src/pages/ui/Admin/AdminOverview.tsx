import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Calendar, Users, School, Heart, Music, Briefcase,Filter, RefreshCw} from 'lucide-react';
import type { PlatformStats, QuickStats } from '../../components/Organizer/Events/type';
import StatMatricCard from '../../components/Organizer/StatMatricCard';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

const SuperAdminOverview = () => {

  const [dateRange, setDateRange] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'organizer' | 'event'>('organizer');
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');
  // Mock data - replace with actual API calls
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalEvents:20,
    totalOrganizers:89,
    totalSchoolAdmins:23,
    regularOrganizers: 66,
    recentGrowth: 12.5
  });

  const quickStats: QuickStats[] = [
    {
      label: 'Total Events',
      value: (platformStats.totalEvents??0).toString(),
      change: platformStats.recentGrowth??0,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-green-600',
      bgGradient: 'from-green-400 to-emerald-700'
    },
    {
      label: 'Total organizers',
      value: (platformStats.totalOrganizers??0).toString(),
      change: platformStats.recentGrowth??0,
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-600',
      bgGradient: 'from-purple-400 to-indigo-600'
    },
    {
      label: 'Total School Admins',
      value: (platformStats.totalSchoolAdmins??0).toString(),
      change: platformStats.recentGrowth??0,
      icon: <School className="w-6 h-6" />,
      color: 'text-red-100',
      bgGradient: 'from-blue-400 to-blue-600'
    },
  ];

  
  const eventsByCategory = [
    { name: 'School Events', count: 456,  bgGradient: 'from-blue-400 to-blue-600', icon: School },
    { name: 'Weddings', count: 312, bgGradient: 'from-pink-400 to-pink-600', icon: Heart },
    { name: 'Concerts', count: 234, bgGradient: 'from-green-400 to-emerald-700', icon: Music },
    { name: 'Corporate', count: 189, bgGradient: 'from-yellow-400 to-yellow-600', icon: Briefcase },
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {y: 0,opacity: 1,
      transition: { type: "spring", stiffness: 100
      }
    }
  }satisfies Variants;
  
  return (
    <div className="h-screen w-full overflow-y-s  overflow-x-hidden p-6">
      {/* Header */}
      <div className="mb-8 rounded-xl bg-gray-100 shadow-lg p-3">
        <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible" 
         className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent">
              Welcome Mr Bitom to Your Dashboard Overview
            </h1>
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
              className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 hover:cursor-pointer flex items-center gap-2 transition-colors"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </motion.div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid  grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <StatMatricCard
            index={index}
            label={stat.label??''}
            value={stat.value??''}
            change={stat.change??0}
            icon={stat.icon}
            bgGradient={stat.bgGradient??''}  />
        ))}
      </div>
     
      {/* Events by Category */}
      <div className=" bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Events by Category</h1>          
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventsByCategory.map((category) => {
            const Icon = category.icon;
            const percentage = (((platformStats.totalEvents??0)/category.count) * 100).toFixed(1);
            
            return (
              <div key={category.name} className="flex items-center justify-between p-4 lg:p-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${category.bgGradient} text-white shadow-lg`}>
                    <Icon className="h-5 w-5"  />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{percentage}% of total events</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{category.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

        {/* statistics  */}
      <div className='p-4 rounded-xl bg-white shadow-lg mb-4'>
        <div className='flex flex-col lg:flex-row w-[100vw] lg:w-full lg:items-center justify-between'>
          <h1 className='text-3xl font-semibold text-gray-900'>Statistics</h1>
          <div className='flex lg:justify-end w-full  items-center gap-2 ml-4'>

            <select name="" id="" value={activeView} onChange={(e) => setActiveView(e.target.value as 'organizer' | 'event')}>
              <option value="organizer">Organizer</option>
              <option value="event">Event</option>
            </select>
            {/* filter dropdown  */}
            <div className='flex items-center gap-2'>
              <select value={chartType} onChange={(e) => setChartType(e.target.value as 'pie' | 'bar' | 'line')}>
                <option value="" disabled>Filter</option>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
          </div>
        </div>

        {/* charts  */}
        <div className='w-full rounded-xl shadow-lg p-4 flex justify-center items-center'>
          <div className='w-full'> 
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeView}-${chartType}`}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="w-full"
              >
                {activeView === 'organizer' ? (
                  <div className="grid grid-cols-1  gap-6">
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'pie' ? (
                          <PieChart>
                            <Pie
                              data={organizerData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="name"
                            >
                              {organizerData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: any, name: any) => [`${value}`, name]} />
                          </PieChart>
                        ) : chartType === 'bar' ? (
                          <BarChart data={organizerData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8B5CF6" radius={[6,6,0,0]} />
                          </BarChart>
                        ) : (
                          <LineChart data={organizerData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2">
                        {organizerData.map((entry) => (
                          <div key={entry.name} className="flex items-center space-x-2 ">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor: entry.color}}></div>
                              <span className="text-sm text-gray-600">{entry.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{entry.value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
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
                        {chartType === 'bar' ? (
                          <BarChart data={monthlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="events" fill="#3B82F6" radius={[6,6,0,0]} />
                            <Bar dataKey="organizers" fill="#8B5CF6" radius={[6,6,0,0]} />
                          </BarChart>
                        ) : chartType === 'line' ? (
                          <LineChart data={monthlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="events" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="organizers" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        ) : (
                          // Fallback for 'pie' selection on monthly view: show stacked area for nicer look
                          <AreaChart data={monthlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="events" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="organizers" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
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