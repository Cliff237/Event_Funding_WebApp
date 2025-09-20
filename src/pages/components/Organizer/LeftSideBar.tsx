import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, Menu, X, Home, CalendarPlus, CalendarDays, Wallet, Bell, Settings, LogOut, User, School, Users2 } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function LeftSideBar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // mock, waiting for backend

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const sideBarLinks = [
    { name: "Overview", path: "/overview", 
      icon: (
        <div className="relative">
          <Home className="text-xl" />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {notificationCount}
            </span>
          )}
        </div>
      ) 
    },
    {name:"AdminOverview",path:"/superAdmin/overview",icon:<Home className="text-xl" />},
    { name: "Create Event", path: "/createEvent", icon: <CalendarPlus className="text-xl" /> },
    { name: "My Event", path: "/myEvent", icon: <CalendarDays className="text-xl" /> },
    { name: "Transaction", path: "/transaction", icon: <Wallet className="text-xl" /> },
    { name: "MyOrganizer", path: "/schoolAdmin/organizer", icon: <Users2 className="text-xl" /> },
    { 
      name: "Notification", 
      path: "/notification", 
      icon: (
        <div className="relative">
          <Bell className="text-xl" />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {notificationCount}
            </span>
          )}
        </div>
      ) 
    },
    { name: "Users", path: "/superAdmin/users", icon: <User className="text-xl" /> },
    { name: "Schools", path: "/superAdmin/schools", icon: <School className="text-xl" /> },
    { name: "Settings", path: "/setting", icon: <Settings className="text-xl" /> },
    { name: "LogOut", path: "/logOut", icon: <LogOut className="text-xl" /> },
  ];

  return (
    <> 
      {/* Desktop view */}
      <motion.div 
        className='hidden overflow-y-auto overflow-x-hidden h-full md:flex flex-col items-center gap-6 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 text-white relative backdrop-indigo-lg border-r border-slate-700/50'
        animate={{ width: isSidebarCollapsed ? "5rem" : "18rem" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        initial={false}
      >
        {/* Gradient overlay */}
        {/* 
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 pointer-events-none" /> */}
        
        {/* Collapse button */}
        <motion.button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-4 top-18 bg-white text-slate-800 rounded-full p-2 shadow-xl border-2 border-slate-200 hover:bg-slate-50 hover:shadow-2xl transition-all duration-300 z-10"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSidebarCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
        </motion.button>

        {/* Logo */}
        <div className='mt-8 mb-4 font-bold text-center relative z-10'>
          {!isSidebarCollapsed ? (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center">
              <div className="bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                <span className='text-4xl font-black tracking-tight'>Shaderl</span>
                <span className='text-2xl font-light italic ml-1'>Pay</span>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              SP
            </motion.div>
          )}
        </div>
        
        {/* Divider */}
        <div className="w-full px-4 relative z-10">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>
        
        {/* Nav links */}
        <div className="w-full px-3 flex flex-col space-y-2 relative z-10">
          {sideBarLinks.map((link, index) => (
            <motion.div className="w-full" key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
              <NavLink 
                to={link.path}
                className={({isActive}) => `
                 group px-4 py-3.5 rounded-xl flex items-center transition-all duration-300 relative overflow-hidden
                  ${isActive ? 
                    'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'hover:bg-slate-800/50 hover:shadow-md hover:shadow-slate-700/25 text-slate-300 hover:text-white w-full' 
                  }
                  ${isSidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'}
                `}
              >
                <div className="absolute inset-0 w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative z-10 flex items-center justify-center min-w-[24px]">
                  {link.icon}
                </div>
                
                {!isSidebarCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: isSidebarCollapsed ? 0 : 1 }} transition={{ duration: 0.2 }} className="font-medium relative z-10 truncate">
                    {link.name}
                  </motion.span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mobile view */}
      <div className="md:hidden relative w-[100vw]">
        <div className="absolute w-[100vw] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 shadow-2xl shadow-slate-900/50 border-b border-slate-700/50 backdrop-blur-lg">
          <div className="flex justify-between items-center">
            <motion.button onClick={toggleMenu} className='text-white hover:text-purple-400 transition-colors duration-300 p-2 rounded-lg hover:bg-slate-700/50' whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
            <div className='flex font-bold'>
              <div className="bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                <span className='text-3xl font-black'>Shaderl</span>
                <span className='text-xl font-light italic ml-1'>Pay</span> 
              </div>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 left-0 w-80 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl text-white z-[1010] p-6 space-y-8" onClick={(e) => e.stopPropagation()}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 pointer-events-none" />
                <div className="flex justify-between items-center relative z-10">
                  <div className="bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                    <span className='text-3xl font-black'>Shaderl</span>
                    <span className='text-xl font-light italic ml-1'>Pay</span>
                  </div>
                  <motion.button onClick={closeMenu} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors duration-300" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.95 }}>
                    <X size={30} />
                  </motion.button>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent relative z-10"></div>
                <div className="flex flex-col space-y-3 relative z-10">
                  {sideBarLinks.map((link, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                      <NavLink to={link.path} onClick={closeMenu} className={({isActive}) => `
                          group px-5 py-4 rounded-xl flex items-center space-x-4 font-medium transition-all duration-300 relative overflow-hidden
                          ${isActive ? 
                            'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
                            : 'hover:bg-slate-800/50 hover:shadow-md hover:shadow-slate-700/25 text-slate-300 hover:text-white'
                          }
                        `}>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                        <div className="relative z-10 flex items-center justify-center p-2 rounded-lg">
                          {link.icon}
                        </div>
                        <span className="relative z-10 text-lg">{link.name}</span>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-auto">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default LeftSideBar;
