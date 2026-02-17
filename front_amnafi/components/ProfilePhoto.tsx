import Image from 'next/image';
import { User } from 'lucide-react';

interface ProfilePhotoProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export default function ProfilePhoto({ 
  src, 
  alt = 'Photo de profil', 
  size = 'md',
  className = '' 
}: ProfilePhotoProps) {
  const baseClasses = `${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`;

  if (src) {
    return (
      <div className={baseClasses}>
        <Image
          src={src}
          alt={alt}
          width={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 48 : 32}
          height={size === 'xl' ? 96 : size === 'lg' ? 64 : size === 'md' ? 48 : 32}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <User className={`${size === 'xl' ? 'w-8 h-8' : size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400`} />
    </div>
  );
}