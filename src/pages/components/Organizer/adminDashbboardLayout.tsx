import { Outlet } from "react-router-dom"
import LeftSideBar from "./LeftSideBar"

function AdminDashbboardLayout() {
  return (
    <div className="h-screen w-full flex  bg-gray-800/30">
        {/* left side bar */}
        <LeftSideBar/>
      <section className="w-full pt-15 md:pt-0">
        <Outlet/>
      </section>
    </div>
  )
}

export default AdminDashbboardLayout
