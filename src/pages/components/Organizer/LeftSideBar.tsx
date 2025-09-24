import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Home,
  CalendarPlus,
  CalendarDays,
  Wallet,
  Bell,
  Settings,
  LogOut,
  User,
  School,
  Users2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ProfileAvatar from "./ProfileAvatar";
import ProfileModal from "./ProfileModal";
import LogoutConfirmation from "./LogoutConfirmation";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  email: string;
  profile?: string | null;
  role: string;
}

interface LeftSideBarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

function LeftSideBar({ isMobile = false, onCloseMobile }: LeftSideBarProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Helper to close mobile sidebar via parent
  const closeMobile = () => onCloseMobile?.();

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Decode JWT to get role
  const token = localStorage.getItem("token");
  let userRole: string | null = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userRole = decoded.role || null;
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  // Helper: resolve stored profile value to a usable image URL
  const resolveProfileUrl = (profile?: string | null): string | null => {
    if (!profile) return null;
    if (profile.startsWith('http') || profile.startsWith('blob:')) return profile;

    // Normalize Windows backslashes to forward slashes
    const normalized = profile.replace(/\\/g, '/');

    // If the stored path contains '/uploads/', strip everything up to that folder
    const marker = '/uploads/';
    const idx = normalized.indexOf(marker);
    const tail = idx !== -1 ? normalized.substring(idx + marker.length) : normalized.split('/').pop()!;

    return `http://localhost:5000/uploads/${tail}`;
  };

  // Navigation links
  const sideBarLinks = [
    {
      name: "Overview",
      path: "/overview",
      icon: (
        <div className="relative">
          <Home className="text-xl" />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {notificationCount}
            </span>
          )}
        </div>
      ),
      roles: ["ORGANIZER", "SCHOOL_ADMIN","SCHOOL_ORGANIZER"],
    },
    {
      name: "AdminOverview",
      path: "/superAdmin/overview",
      icon: <Home className="text-xl" />,
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Create Event",
      path: "/createEvent",
      icon: <CalendarPlus className="text-xl" />,
      roles: ["ORGANIZER", "SCHOOL_ADMIN","SCHOOL_ORGANIZER", "SUPER_ADMIN"],
    },
    {
      name: "My Event",
      path: "/myEvent",
      icon: <CalendarDays className="text-xl" />,
      roles: ["ORGANIZER", "SCHOOL_ADMIN","SCHOOL_ORGANIZER", "SUPER_ADMIN"],
    },
    {
      name: "Transaction",
      path: "/transaction",
      icon: <Wallet className="text-xl" />,
      roles: ["ORGANIZER", "SCHOOL_ADMIN","SCHOOL_ORGANIZER", "SUPER_ADMIN"],
    },
    {
      name: "MyOrganizer",
      path: "/schoolAdmin/organizer",
      icon: <Users2 className="text-xl" />,
      roles: ["SCHOOL_ADMIN"],
    },
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
      ),
      roles: ["ORGANIZER", "SUPER_ADMIN", "SCHOOL_ADMIN","SCHOOL_ORGANIZER"],
    },
    {
      name: "Users",
      path: "/superAdmin/users",
      icon: <User className="text-xl" />,
      roles: ["SUPER_ADMIN"],
    },
    {
      name: "Schools",
      path: "/superAdmin/schools",
      icon: <School className="text-xl" />,
      roles: ["SUPER_ADMIN"],
    },
    // {
    //   name: "Settings",
    //   path: "/setting",
    //   icon: <Settings className="text-xl" />,
    //   roles: ["ORGANIZER", "SUPER_ADMIN", "SCHOOL_ADMIN","SCHOOL_ORGANIZER"],
    // },
  ];

  // Filter links by role
  const filteredLinks = sideBarLinks.filter(
    (link) => !link.roles || (userRole && link.roles.includes(userRole))
  );

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Handle profile update
  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden overflow-y-auto overflow-x-hidden h-full md:flex flex-col items-center gap-6 
        bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 backdrop-blur-lg border-r border-slate-700/50  text-white relative"
        animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        initial={false}
      >
        {/* Collapse button */}
        <motion.button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-4 top-18 bg-white text-slate-800 rounded-full p-2 shadow-xl border-2 border-slate-200 hover:bg-slate-50 hover:shadow-2xl transition-all duration-300 z-10"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSidebarCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </motion.button>

        {/* Logo */}
        <div className="mt-8 mb-4 font-bold text-center relative z-10">
          {!isSidebarCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center"
            >
              <div className="bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                <span className="text-4xl font-black tracking-tight">
                  Shaderl
                </span>
                <span className="text-2xl font-light italic ml-1">Pay</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg"
            >
              SP
            </motion.div>
          )}
        </div>

        {/* Profile Section */}
        {user && (
          <div className="w-full px-3 relative z-10">
            <motion.div
              className={`px-4 py-3 rounded-xl flex items-center transition-all duration-300 cursor-pointer ${
                isSidebarCollapsed ? "justify-center" : "justify-start space-x-3"
              } hover:bg-slate-800/50`}
              onClick={() => setShowProfileModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Show img tag if user has profile image, otherwise show ProfileAvatar */}
              {user.profile ? (
                <img
                  src={resolveProfileUrl(user.profile) || ''}
                  alt={user.name}
                  className={`${isSidebarCollapsed ? "w-10 h-10" : "w-15 h-15"} rounded-full object-cover`}
                  onError={(e) => {
                    // Fallback to ProfileAvatar if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallbackDiv) {
                      fallbackDiv.classList.remove('hidden');
                    }
                  }}
                />
              ) : <ProfileAvatar
              name={user.name}
              profile={user.profile}
              size={isSidebarCollapsed ? "sm" : "md"}
            />}

              {!isSidebarCollapsed && (
                  <p className="font-medium text-xl text-white truncate">{user.name}</p>
              )}
            </motion.div>
          </div>
        )}

        {/* Nav links */}
        <div className="w-full px-3 flex flex-col space-y-2 relative z-10 flex-1">
          {filteredLinks.map((link, index) => (
            <motion.div
              className="w-full"
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) => `
                  group px-4 py-3.5 rounded-xl flex items-center transition-all duration-300 relative overflow-hidden
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "hover:bg-slate-800/50 hover:shadow-md hover:shadow-slate-700/25 text-slate-300 hover:text-white w-full"
                  }
                  ${isSidebarCollapsed ? "justify-center" : "justify-start space-x-3"}
                `}
              >
                <div className="absolute inset-0 w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <div className="relative z-10 flex items-center justify-center min-w-[24px]">
                  {link.icon}
                </div>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium relative z-10 truncate"
                  >
                    {link.name}
                  </motion.span>
                )}
              </NavLink>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            className="w-full mt-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filteredLinks.length * 0.1 }}
          >
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`w-full px-4 py-3.5 rounded-xl flex items-center transition-all duration-300 relative overflow-hidden hover:bg-red-600/20 text-slate-300 hover:text-white ${
                isSidebarCollapsed ? "justify-center" : "justify-start space-x-3"
              }`}
            >
              <LogOut className="text-xl" />
              {!isSidebarCollapsed && (
                <span className="font-medium">Logout</span>
              )}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <div className="h-full w-full bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 backdrop-blur-lg border-r border-slate-700/50 overflow-y-auto">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={closeMobile}
              className="p-2 hover:bg-slate-800/50 rounded-full transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Profile Section */}
          {user && (
            <div className="px-6 pb-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-4">
                {/* Show img tag if user has profile image, otherwise show ProfileAvatar */}
                {user.profile ? (
                  <img
                    src={resolveProfileUrl(user.profile) || ''}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to ProfileAvatar if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallbackDiv) {
                        fallbackDiv.classList.remove('hidden');
                      }
                    }}
                  />
                ) : null}

                {/* ProfileAvatar as fallback - hidden initially if img is shown */}
                <div className={user.profile ? 'hidden' : ''}>
                  <ProfileAvatar name={user.name} profile={user.profile} size="lg" />
                </div>

                <div>
                  <h3 className="font-semibold text-white text-lg">{user.name}</h3>
                  <p className="text-slate-400 capitalize">{user.role.replace('_', ' ')}</p>
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      closeMobile();
                    }}
                    className="text-purple-400 hover:text-purple-300 text-sm mt-1"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="px-6 py-4 space-y-2">
            {filteredLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                onClick={closeMobile}
                className={({ isActive }) => `
                  flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }
                `}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </NavLink>
            ))}

            {/* Logout Button */}
            <button
              onClick={() => {
                setShowLogoutModal(true);
                closeMobile();
              }}
              className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 text-slate-300 hover:bg-red-600/20 hover:text-white mt-4"
            >
              <LogOut className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      <LogoutConfirmation
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default LeftSideBar;
