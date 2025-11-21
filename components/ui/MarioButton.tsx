import React from 'react';
import clsx from 'clsx';

interface MarioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'red' | 'green' | 'yellow' | 'blue' | 'brown';
  size?: 'sm' | 'md' | 'lg';
}

const MarioButton: React.FC<MarioButtonProps> = ({ 
  children, 
  className, 
  variant = 'red', 
  size = 'md',
  ...props 
}) => {
  const baseStyles = "font-pixel text-white font-bold border-2 border-black shadow-cartoon active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase";
  
  const variants = {
    red: "bg-mario-red hover:bg-red-600",
    green: "bg-mario-green hover:bg-green-600",
    yellow: "bg-mario-yellow text-black hover:bg-yellow-400",
    blue: "bg-mario-blue hover:bg-blue-500",
    brown: "bg-mario-brown hover:bg-amber-800",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={clsx(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

export default MarioButton;