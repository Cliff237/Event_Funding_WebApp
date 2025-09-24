import React from 'react';
import { Menu } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

interface User {
  id: number;
  name: string;
  email: string;
  profile?: string | null;
  role: string;
}

interface MobileNavbarProps {
  user: User | null;
  onMenuClick: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ user, onMenuClick }) => {
  return (
    <div className="md:hidden bg-white shadow-md border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <div className="bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          <span className="text-xl font-black">Shaderl</span>
          <span className="text-lg font-light italic">Pay</span>
        </div>
      </div>

      {user && (
        <div className="flex items-center space-x-2">
          <ProfileAvatar name={user.name} profile={user.profile} size="sm" />
          <span className="text-sm font-medium text-gray-700">{user.name}</span>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
