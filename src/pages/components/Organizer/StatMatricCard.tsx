import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatMatricCardProps {
    index: number;
    label: string;
    value: string;
    change?: number;
    icon: React.ReactNode;
    bgGradient?: string;
}

function StatMatricCard({index,label, value, change, icon, bgGradient}: StatMatricCardProps) {
  return (
    <div
    key={index}
    className="sm:relative overflow-hidden rounded-2xl shadow-lg"
  >
    <div className={`absolute bg-gradient-to-br ${bgGradient} opacity-10`} />
    <div className="relative bg-white/80 backdrop-blur-sm p-6 border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} text-white shadow-lg`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          change?(change > 0 ? 'text-green-600' : 'text-red-600'):'text-gray-600'
        }`}>
          {change?(change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />):null}
          <span>{Math.abs(change ?? 0)}%</span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  </div>
  )
}

export default StatMatricCard