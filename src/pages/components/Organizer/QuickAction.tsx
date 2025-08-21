// components/overview/QuickActions.tsx

import type { QuickAction } from "./dashboard";

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => {
          const Icon = action.icon; // Assign to variable
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="flex items-center text-gray-700 gap-3 p-3 text-left rounded-lg hover:bg-purple-50 transition-colors border border-purple-100"
            >
              <Icon className="text-purple-800" /> {/* Render as component */}
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}