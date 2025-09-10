import type { ReactElement } from "react"

interface TransactionCardProps{
  totalTransaction:string,
  overViewStat:string | number,
  icon:ReactElement
}
export function TransactionCard({totalTransaction,overViewStat,icon}:TransactionCardProps){
  return (
   <div 
    className="bg-gradient-to-r overflow-hidden from-purple-600 rounded-xl to-blue-600 shadow-md hover:shadow-gray-500 sm:p-6 p-3 ">
      <div className="flex  items-center justify-around ">
        <div>
          <p className="text-xl font-medium text-gray-100">{totalTransaction}</p>
          <p className="text-2xl font-bold text-gray-900">{overViewStat}</p>
        </div>
        <div className="p-3 bg-purple-100 rounded-full">
          {icon}
        </div>
      </div>
    </div>

  )
}