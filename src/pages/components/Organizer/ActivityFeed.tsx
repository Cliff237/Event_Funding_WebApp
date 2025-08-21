// components/overview/ActivityFeed.tsx

import { FaBell, FaCalendarAlt, FaCog, FaMoneyBillWave } from "react-icons/fa";
import type { ActivityItem } from "./dashboard";

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'contribution': return <FaMoneyBillWave className="text-green-500" />;
    case 'event': return <FaCalendarAlt className="text-purple-500" />;
    case 'notification': return <FaBell className="text-yellow-500" />;
    default: return <FaCog className="text-blue-500" />;
  }
};

export default function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className={`flex gap-3 p-3 border-b last:border-b-0 ${
              !activity.read ? 'bg-purple-50 rounded-lg' : ''
            }`}
          >
            <div className="mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">{activity.title}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{activity.description}</p>
              {activity.amount && (
                <p className="text-purple-800 font-medium mt-1">
                  {activity.amount.toLocaleString()} XAF
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}