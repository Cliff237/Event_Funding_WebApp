import { Outlet } from "react-router-dom"
import LeftSideBar from "./LeftSideBar"

function AdminDashbboardLayout() {
  return (
    <div className="h-screen w-full flex ">
        {/* left side bar */}
        <LeftSideBar/>
      <section className=" h-fit  bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 w-full pt-15 md:pt-0">
        <Outlet/>
      </section>
    </div>
  )
}

export default AdminDashbboardLayout
