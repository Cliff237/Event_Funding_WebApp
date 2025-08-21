
import type { MetricCard } from "./dashboard";

interface MetricCardProps {
  card: MetricCard;
  className?: string;
}

export default function MetricCard({ card, className = "" }: MetricCardProps) {
  const Icon = card.icon; // Assign icon component to variable

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-purple-800 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{card.title}</p>
          <p className="text-2xl font-bold mt-1">
            {card.loading ? (
              <span className="inline-block h-8 w-20 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              card.value
            )}
          </p>
        </div>
        <div className="p-2 rounded-full bg-purple-100">
          <Icon className="text-purple-800" size={20} />
        </div>
      </div>

      {card.change !== undefined && (
        <p className={`mt-2 text-sm flex items-center ${
          card.change >= 0 ? "text-green-600" : "text-red-600"
        }`}>
          {card.change >= 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
          {Math.abs(card.change)}%
        </p>
      )}
    </div>
  );
}