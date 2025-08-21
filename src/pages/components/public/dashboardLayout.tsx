import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa"

function DashboardLayout() {
  return (
    <div className="w-full">
        <NavBar />
        <main className="mb-10 w-full">
            <Outlet/>
        </main>

        <footer className="w-full h-fit py-6 flex flex-col md:flex-row justify-around items-center bg-gray-900 gap-4 md:gap-0">
          <div className="flex flex-col justify-center items-center text-center md:text-left">
            <Link to={"/"} >
            <div className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-orange-500 via-purple-300 to-purple-700 text-3xl md:text-5xl">
                <span className='text-3xl md:text-5xl'>Shaderl</span>
                <i className='text-xl md:text-3xl'>Pay</i>
            </div>
            </Link>
            <span className="w-full md:w-[230px] text-gray-300">
              Enabling seamless contribution campaigns
            </span>
          </div>
          <small className="flex justify-center items-center text-xs md:text-base">
            Copyright @ 2025 Shaderlpay
          </small>
          <div className=" hidden md:flex justify-center items-center gap-3 md:gap-6 flex-wrap">
            <FaFacebook size={30} color="blue"/>
            <FaWhatsapp size={30} color="greenyellow"/>
            <FaInstagram size={30} color="pink"/>
            <FaTwitter size={30} color="cyan"/>

          </div>
        </footer>
    </div>
  )
}

export default DashboardLayout
