import { Outlet } from "react-router-dom"
import DashboardLayout from "./DashboardLayout"

function AdminDashbboardLayout() {
  return (
    <DashboardLayout>
      <div className="h-full overflow-y-auto w-full bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 overflow-x-hidden">
        <Outlet/>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashbboardLayout
