import React, { useState } from 'react';

interface ProfileAvatarProps {
  name: string;
  profile?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  profile,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  // Get first two letters of the name
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names[1] || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Generate color based on initials
  const getColorFromInitials = (initials: string) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-red-500',
      'B': 'bg-blue-500',
      'C': 'bg-green-500',
      'D': 'bg-yellow-500',
      'E': 'bg-indigo-500',
      'F': 'bg-purple-500',
      'G': 'bg-pink-500',
      'H': 'bg-orange-500',
      'I': 'bg-teal-500',
      'J': 'bg-cyan-500',
      'K': 'bg-lime-500',
      'L': 'bg-emerald-500',
      'M': 'bg-rose-500',
      'N': 'bg-violet-500',
      'O': 'bg-amber-500',
      'P': 'bg-sky-500',
      'Q': 'bg-fuchsia-500',
      'R': 'bg-red-600',
      'S': 'bg-blue-600',
      'T': 'bg-green-600',
      'U': 'bg-yellow-600',
      'V': 'bg-indigo-600',
      'W': 'bg-purple-600',
      'X': 'bg-pink-600',
      'Y': 'bg-orange-600',
      'Z': 'bg-teal-600',
    };

    const firstLetter = initials.charAt(0);
    return colors[firstLetter] || 'bg-gray-500';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const initials = getInitials(name);
  const colorClass = getColorFromInitials(initials);

  // If there's a profile image and no error, show the image
  if (profile && !imageError) {
    // Handle different types of profile paths
    let imageUrl: string;

    if (profile.startsWith('http://') || profile.startsWith('https://')) {
      // Full URL
      imageUrl = profile;
    } else if (profile.startsWith('blob:')) {
      // Blob URL (for preview)
      imageUrl = profile;
    } else if (profile.startsWith('data:')) {
      // Base64 data URL
      imageUrl = profile;
    } else {
      // Relative path or filename, add uploads path
      // Remove any leading slashes and normalize path
      const cleanPath = profile.replace(/^\/+/, '').replace(/\\/g, '/');
      imageUrl = `http://localhost:5000/uploads/${cleanPath}`;
    }

    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={() => setImageError(true)}
        onLoad={() => console.log('Profile image loaded successfully:', imageUrl)}
      />
    );
  }

  // Fallback to initials
  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
      {initials}
    </div>
  );
};

export default ProfileAvatar;
