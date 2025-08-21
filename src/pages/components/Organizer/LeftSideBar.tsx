import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarPlus, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaHistory, 
  FaChartBar, 
  FaBell, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';

function LeftSideBar() {


  const sideBarLinks = [
    { 
      name: 'Overview', 
      path: '/overview', 
      icon: <FaHome className="text-xl" /> 
    },
    { 
      name: 'Create Event', 
      path: '/createEvent', 
      icon: <FaCalendarPlus className="text-xl" /> 
    },
    { 
      name: 'My Event', 
      path: '/myEvent', 
      icon: <FaCalendarAlt className="text-xl" /> 
    },
    { 
      name: 'Transaction', 
      path: '/transaction', 
      icon: <FaMoneyBillWave className="text-xl" /> 
    },
    { 
      name: 'Past Event', 
      path: '/pastEvent', 
      icon: <FaHistory className="text-xl" /> 
    },
    { 
      name: 'Report', 
      path: '/report', 
      icon: <FaChartBar className="text-xl" /> 
    },
    { 
      name: 'Notification', 
      path: '/notification', 
      icon: <FaBell className="text-xl" /> 
    },
    { 
      name: 'Settings', 
      path: '/setting', 
      icon: <FaCog className="text-xl" /> 
    },
    { 
      name: 'LogOut', 
      path: '/logOut', 
      icon: <FaSignOutAlt className="text-xl" /> 
    },
  ];
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  return (
    <> 
      {/* Desktop view */}
      <motion.div 
        className='hidden overflow-y-auto overflow-x-hidden h-full md:flex flex-col items-center gap-2 bg-gray-100 py-5 shadow shadow-amber-50 text-xl text-gray-800 relative'
        animate={{
          width: isSidebarCollapsed ? "5rem" : "16rem" // Adjust these values as needed
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        initial={false}
      >
        {/* Toggle button */}
        <motion.button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-5 bg-gray-100 rounded-full p-1 shadow-md border border-gray-300 hover:bg-gray-200 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSidebarCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </motion.button>

        <div className='font-bold pr-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-purple-700'>
          {!isSidebarCollapsed ? (
            <>
              <span className='text-3xl'>Shaderl</span>
              <i className='text-xl'>Pay</i>
            </>
          ) : (
            <span className='text-3xl'>SP</span>
          )}
        </div>
        
        <div className="border-t-2 border-gray-800/30 w-full"></div>
        
        
        <div className="w-full p-1 flex flex-col space-y-2">
          {sideBarLinks.map((link, index) => (
            <motion.div
              className="w-full"
              key={index}
              variants={{
                hidden: {y: 20, opacity: 0},
                visible: {y: 0, opacity: 1}
              }}
            >
              <NavLink 
                to={link.path}
                className={({isActive}) => `
                  px-4 py-3 items-center justify-center md:justify-start space-x-2 flex font-semibold border-l-6 
                  hover:bg-purple-800/70 hover:text-gray-300 transition-time
                  ${isActive ? 
                    (isSidebarCollapsed ? 
                      'rounded-3xl border-r-6 w-fit border-purple-800 p-2' 
                      : 'bg-gray-950/10 text-purple-900 rounded border-purple-800') 
                    : 'border-transparent'
                  }`
                }
              >
                  {link.icon}
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </motion.div>
       {/* phone view */}
      <div className="md:hidden flex  fixed w-full h-fit bg-gray-100 px-5 py-3 shadow shadow-amber-50 bg-am">
        <div className="flex">
          <button onClick={toggleMenu} className='text-gray-800 md:hidden '>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        <div className='flex justify-end w-full  font-bold pr-2 text-transparent  bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-purple-700'>
          <span className=' text-3xl '>Shaderl</span>
          <i className='text-xl '>Pay</i> 
        </div>
        <AnimatePresence>
          {isOpen &&(
            <>
              {/* closeMenu */}
              <motion.div className=" fixed inset-0 bg-black/10 z-40"
              onClick={closeMenu}/>

              <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 w-64 h-full bg-gray-900 shadow-lg z-900 p-6 space-y-10 md:hidden"
              onClick={(e) => e.stopPropagation()} >
                <div className="flex justify-end">
                  <button onClick={closeMenu}>
                    <X size={30} />
                  </button>
                </div>                
              <div className="flex flex-col space-y-6">
                {sideBarLinks.map((link,index)=>(
                  <motion.div
                  className="text-lg "
                  key={index}
                  variants={{
                    hidden:{y:20, opacity:0},
                    visible:{y:0, opacity:1}
                  }}>
                    <NavLink 
                      to={link.path}
                      className={({isActive})=>`px-4 py-3 items-center space-x-2 flex font-semibold border-l-6  transition
                      ${isActive?'bg-gray-950/10 text-purple-900 rounded border-purple-800':'border-transparent'}`}>
                        {link.icon}
                      <span>{link.name}</span>
                    </NavLink>
                    
                  </motion.div>
                ))}
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default LeftSideBar
