import ActivityFeed from "../../components/Organizer/ActivityFeed";
import { getMetrics, getQuickActions, getActivities } from "../../components/Organizer/DasboardData";
import MetricCards from "../../components/Organizer/MetricCards";
import QuickActions from "../../components/Organizer/QuickAction";


export default function Overview() {
  const handleCreateEvent = () => {
    // Replace with actual event creation logic
    console.log('Create Event clicked');
    // router.push('/createEvent');
  };

  return (
    <div className="px-3 space-y-6 h-screen overflow-y-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">Dashboard Overview</h2>
        <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
      </div>

      {/* Metrics Section */}
      <MetricCards cards={getMetrics()} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={getActivities()} />
        </div>

        {/* Right Column - Quick Actions + Optional Widgets */}
        <div className="space-y-6">
          <QuickActions actions={getQuickActions(handleCreateEvent)} />
          
          {/* Additional Widget - Recent Contributors (Example) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">
              Top Contributors
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-800 text-sm font-medium">
                        {item}
                      </span>
                    </div>
                    <span className="font-medium">User {item}</span>
                  </div>
                  <span className="text-purple-800 font-medium">
                    {item * 50000} XAF
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}