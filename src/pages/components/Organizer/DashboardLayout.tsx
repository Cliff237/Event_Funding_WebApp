import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import LeftSideBar from './LeftSideBar';
import MobileNavbar from './MobileNavbar';

interface User {
  id: number;
  name: string;
  email: string;
  profile?: string | null;
  role: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Check if user is authenticated
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

  // If no token, don't render the layout (let the page handle authentication)
  if (!token) {
    return <>{children}</>;
  }

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen ">
      {/* Desktop Sidebar */}
      <LeftSideBar />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 backdrop-blur-lg border-r border-slate-700/50 z-50 overflow-y-auto">
              <LeftSideBar isMobile={true} onCloseMobile={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navbar */}
        <MobileNavbar user={user} onMenuClick={handleMenuClick} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
