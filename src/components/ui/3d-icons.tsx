import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Icon3DProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent';
  glow?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const variantClasses = {
  primary: 'from-primary to-primary-dark',
  secondary: 'from-secondary to-secondary-dark', 
  accent: 'from-accent to-accent-dark'
};

export function Icon3D({ 
  icon: Icon, 
  size = 'md', 
  variant = 'primary', 
  glow = false,
  animated = true,
  className = ''
}: Icon3DProps) {
  return (
    <div className={`relative group ${animated ? 'hover:scale-110 transition-transform duration-300' : ''} ${className}`}>
      {/* Glow effect */}
      {glow && (
        <div className={`absolute inset-0 bg-gradient-to-br ${variantClasses[variant]} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
      )}
      
      {/* Main icon container */}
      <div className={`relative bg-gradient-to-br ${variantClasses[variant]} p-3 rounded-xl shadow-lg backdrop-blur-sm border border-white/10`}>
        <Icon className={`${sizeClasses[size]} text-white drop-shadow-lg`} />
        
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl pointer-events-none"></div>
        
        {/* Bottom shadow */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent rounded-xl pointer-events-none"></div>
      </div>
      
      {/* Floating animation */}
      {animated && (
        <div className="absolute inset-0 animate-pulse opacity-30">
          <div className={`bg-gradient-to-br ${variantClasses[variant]} rounded-xl blur-sm h-full w-full`}></div>
        </div>
      )}
    </div>
  );
}

interface IconContainer3DProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  glow?: boolean;
  className?: string;
}

export function IconContainer3D({ 
  children, 
  variant = 'primary', 
  glow = false,
  className = '' 
}: IconContainer3DProps) {
  return (
    <div className={`relative group ${className}`}>
      {glow && (
        <div className={`absolute inset-0 bg-gradient-to-br ${variantClasses[variant]} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
      )}
      
      <div className={`relative bg-gradient-to-br ${variantClasses[variant]} p-4 rounded-xl shadow-lg backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform duration-300`}>
        {children}
        
        {/* Inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl pointer-events-none"></div>
        
        {/* Bottom shadow */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent rounded-xl pointer-events-none"></div>
      </div>
    </div>
  );
}