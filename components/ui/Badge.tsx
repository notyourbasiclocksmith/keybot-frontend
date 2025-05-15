import React from 'react';

type BadgeVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'danger' 
  | 'warning' 
  | 'info'
  | 'neutral';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
  dot = false,
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-indigo-100 text-indigo-800',
    neutral: 'bg-gray-100 text-gray-600',
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  };

  const radiusClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`inline-flex items-center font-medium ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${radiusClass} ${className}`}
    >
      {dot && (
        <span
          className={`mr-1.5 h-2 w-2 rounded-full ${
            variant === 'primary'
              ? 'bg-blue-500'
              : variant === 'secondary'
              ? 'bg-gray-500'
              : variant === 'success'
              ? 'bg-green-500'
              : variant === 'danger'
              ? 'bg-red-500'
              : variant === 'warning'
              ? 'bg-yellow-500'
              : variant === 'info'
              ? 'bg-indigo-500'
              : 'bg-gray-500'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
