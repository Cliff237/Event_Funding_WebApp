import { useState } from 'react';
import { 
  FiDollarSign, FiSmartphone, FiPhone, 
  FiCreditCard, FiCalendar, FiDownload,
  FiUser, FiBell, FiSearch, FiBarChart2,
  FiTrendingUp, FiClock, FiPieChart, FiActivity
} from 'react-icons/fi';

// Types (expanded from previous)
type Transaction = {
  id: string;
  amount: number;
  date: string;
  payer: string;
  method: 'wallet' | 'momo' | 'om' | 'bank';
  status: 'completed' | 'pending' | 'failed';
};

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};
type PaymentSource = {
  id: string;
  type: 'wallet' | 'momo' | 'om' | 'bank';
  balance: number;
  status: 'active' | 'needs_verification';
};
// PaymentSources Component
type PaymentSourcesProps = {
  sources: PaymentSource[];
};

const PaymentSources = ({ sources }: PaymentSourcesProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg shadow">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
        </tr>
      </thead>
      <tbody>
        {sources.map(source => (
          <tr key={source.id} className="border-b last:border-b-0">
            <td className="px-4 py-2 capitalize">{source.type === 'momo' ? 'Mobile Money' : source.type}</td>
            <td className="px-4 py-2">XAF {source.balance.toLocaleString()}</td>
            <td className="px-4 py-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${source.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{source.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// EventFilter Component
type EventFilterProps = {
  onFilterChange: (filter: string) => void;
};

const EventFilter = ({ onFilterChange }: EventFilterProps) => (
  <div className="flex gap-2 mb-2">
    <button onClick={() => onFilterChange('all')} className="px-3 py-1 text-sm border rounded">All</button>
    <button onClick={() => onFilterChange('school')} className="px-3 py-1 text-sm border rounded">School</button>
    <button onClick={() => onFilterChange('donation')} className="px-3 py-1 text-sm border rounded">Donation</button>
    <button onClick={() => onFilterChange('event')} className="px-3 py-1 text-sm border rounded">Event</button>
  </div>
);

// EventBalanceCard Component
type EventBalanceCardProps = {
  event: EventBalance;
};

const EventBalanceCard = ({ event }: EventBalanceCardProps) => (
  <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold text-gray-800">{event.name}</span>
      <span className="text-xs text-gray-500">{event.date}</span>
    </div>
    <div className="text-lg font-bold text-blue-700 mb-1">XAF {event.total.toLocaleString()}</div>
    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
      {Object.entries(event.allocations).map(([type, amount]) => (
        <span key={type} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {type === 'momo' ? 'Mobile Money' : type}: XAF {amount.toLocaleString()}
        </span>
      ))}
    </div>
  </div>
);

type EventBalance = {
  id: string;
  name: string;
  date: string;
  type: 'school' | 'donation' | 'event';
  total: number;
  allocations: Record<string, number>; // e.g., { wallet: 800, momo: 440 }
};


// Mock Data (expanded)
const useDashboardData = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    lastLogin: 'Today at 09:42 AM',
  };

  const paymentSources: PaymentSource[] = [
    { id: '1', type: 'wallet', balance: 2150.00, status: 'active' },
    { id: '2', type: 'momo', balance: 1200.50, status: 'active' },
    { id: '3', type: 'om', balance: 890.00, status: 'needs_verification' },
    { id: '4', type: 'bank', balance: 580.00, status: 'active' },
  ];

  const events: EventBalance[] = [
    { id: 'e1', name: 'School Defense Fees', date: '2023-06-15', type: 'school', total: 1240.00, allocations: { wallet: 800, momo: 440 } },
    { id: 'e2', name: 'Alumni Donations', date: '2023-06-10', type: 'donation', total: 3580.50, allocations: { wallet: 1350, bank: 2230.50 } },
    { id: 'e3', name: 'Graduation Ceremony', date: '2023-05-28', type: 'school', total: 1820.00, allocations: { wallet: 600, momo: 1220 } },
  ];

  const recentTransactions: Transaction[] = [
    { id: 't1', amount: 150, date: '2023-06-15', payer: 'Alice Johnson', method: 'momo', status: 'completed' },
    { id: 't2', amount: 250, date: '2023-06-14', payer: 'Bob Smith', method: 'bank', status: 'pending' },
    { id: 't3', amount: 75, date: '2023-06-14', payer: 'Charlie Brown', method: 'wallet', status: 'completed' },
    { id: 't4', amount: 300, date: '2023-06-13', payer: 'Dana White', method: 'om', status: 'failed' },
  ];

  const notifications: Notification[] = [
    { id: 'n1', title: 'New Payment', message: 'Received XAF 25,000 from Samuel Eto\'o', time: '2 hours ago', read: false },
    { id: 'n2', title: 'Withdrawal Processed', message: 'XAF 50,000 sent to your bank account', time: '1 day ago', read: true },
    { id: 'n3', title: 'Account Verification', message: 'Your OM account needs verification', time: '2 days ago', read: true },
  ];

  const analytics = {
    totalBalance: paymentSources.reduce((sum, source) => sum + source.balance, 0),
    monthlyGrowth: 12,
    activeEvents: events.length,
    pendingTransactions: recentTransactions.filter(t => t.status === 'pending').length,
  };

  return { user, analytics, paymentSources, events, recentTransactions, notifications };
};

// New Components
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-3 ${
          transaction.method === 'wallet' ? 'bg-green-100 text-green-600' :
          transaction.method === 'momo' ? 'bg-purple-100 text-purple-600' :
          transaction.method === 'om' ? 'bg-blue-100 text-blue-600' :
          'bg-yellow-100 text-yellow-600'
        }`}>
          {transaction.method === 'wallet' && <FiDollarSign />}
          {transaction.method === 'momo' && <FiSmartphone />}
          {transaction.method === 'om' && <FiPhone />}
          {transaction.method === 'bank' && <FiCreditCard />}
        </div>
        <div>
          <p className="font-medium">{transaction.payer}</p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">XAF {transaction.amount.toLocaleString()}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[transaction.status]}`}>
          {transaction.status}
        </span>
      </div>
    </div>
  );
};

const NotificationItem = ({ notification }: { notification: Notification }) => (
  <div className={`p-3 border-b ${!notification.read ? 'bg-blue-50' : ''}`}>
    <div className="flex justify-between">
      <p className="font-medium">{notification.title}</p>
      <p className="text-xs text-gray-500">{notification.time}</p>
    </div>
    <p className="text-sm mt-1">{notification.message}</p>
  </div>
);

const AnalyticsChart = () => (
  <div className="bg-white p-4 rounded-lg h-full">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium">Payment Trends</h3>
      <select className="text-sm border rounded px-2 py-1">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
      </select>
    </div>
    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
      <FiActivity className="text-gray-400 text-4xl" />
      <p className="text-gray-500 ml-2">Chart visualization</p>
    </div>
  </div>
);

// StatsCard Component
type StatsCardProps = {
  title: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
};

const StatsCard = ({ title, value, change, icon }: StatsCardProps) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 h-full">
    <div className="flex items-center gap-3">
      {icon && <div className="bg-gray-100 p-2 rounded-full text-blue-600">{icon}</div>}
      <span className="text-gray-500 text-xs font-medium">{title}</span>
    </div>
    <div className="flex items-end justify-between mt-2">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {change && (
        <span className="text-xs text-green-600 font-medium ml-2">{change}</span>
      )}
    </div>
  </div>
);

// Updated Main Component
export default function OverviewPage() {
  const { user, analytics, paymentSources, events, recentTransactions, notifications } = useDashboardData();
  const [activeTab, setActiveTab] = useState<'sources' | 'events'>('sources');
  const [filteredEvents, setFilteredEvents] = useState<EventBalance[]>(events);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleFilterChange = (filter: string) => {
    setFilteredEvents(filter === 'all' ? events : events.filter(event => event.type === filter));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
              <FiUser size={20} />
            </div>
            <div>
              <h1 className="font-medium">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-500 hover:text-gray-700 relative"
              >
                <FiBell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-20">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                  <div className="p-3 text-center border-t">
                    <button className="text-blue-600 text-sm">View All</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Total Balance" 
              value={`XAF ${analytics.totalBalance.toLocaleString()}`} 
              change={`↑ ${analytics.monthlyGrowth}% this month`} 
              icon={<FiDollarSign size={20} />} 
            />
            <StatsCard 
              title="Active Events" 
              value={analytics.activeEvents.toString()} 
              change="3 ongoing" 
              icon={<FiCalendar size={20} />} 
            />
            <StatsCard 
              title="Pending Transactions" 
              value={analytics.pendingTransactions.toString()} 
              change="Needs attention" 
              icon={<FiClock size={20} />} 
            />
            <StatsCard 
              title="Wallet Balance" 
              value={`XAF ${paymentSources.find(s => s.type === 'wallet')?.balance.toLocaleString() || '0'}`} 
              change="↑ 8% from last week" 
              icon={<FiCreditCard size={20} />} 
            />
          </div>

          {/* Financial Overview */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Financial Overview</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border rounded">Export</button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">New Event</button>
              </div>
            </div>

            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'sources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('sources')}
              >
                Payment Sources
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'events' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('events')}
              >
                Event Balances
              </button>
            </div>
            
            {activeTab === 'sources' ? (
              <PaymentSources sources={paymentSources} />
            ) : (
              <div>
                <EventFilter onFilterChange={handleFilterChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {filteredEvents.map(event => (
                    <EventBalanceCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            <div className="divide-y">
              {recentTransactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Analytics Chart */}
          <AnalyticsChart />

          {/* Payment Method Distribution */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Payment Methods</h3>
              <FiPieChart className="text-gray-500" />
            </div>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <FiPieChart className="text-gray-400 text-4xl" />
              <p className="text-gray-500 ml-2">Payment methods chart</p>
            </div>
            <div className="mt-4 space-y-2">
              {paymentSources.map(source => (
                <div key={source.id} className="flex justify-between text-sm">
                  <span className="capitalize">{source.type === 'momo' ? 'Mobile Money' : source.type}</span>
                  <span>XAF {source.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50">
                <FiDownload className="text-blue-600 mb-2" />
                <span className="text-sm">Export Data</span>
              </button>
              <button className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50">
                <FiTrendingUp className="text-green-600 mb-2" />
                <span className="text-sm">View Reports</span>
              </button>
              <button className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50">
                <FiBarChart2 className="text-purple-600 mb-2" />
                <span className="text-sm">Analytics</span>
              </button>
              <button className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50">
                <FiUser className="text-yellow-600 mb-2" />
                <span className="text-sm">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}