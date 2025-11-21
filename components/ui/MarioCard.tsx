import React from 'react';
import clsx from 'clsx';

interface MarioCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  type?: 'brick' | 'question' | 'plain';
}

const MarioCard: React.FC<MarioCardProps> = ({ children, className, title, type = 'plain' }) => {
  
  const containerStyles = "bg-white border-4 border-black shadow-cartoon-lg rounded-xl overflow-hidden relative";
  
  // Decorative corner screws/dots
  const Dot = ({ pos }: { pos: string }) => (
    <div className={`absolute w-2 h-2 bg-black rounded-full ${pos} z-10`}></div>
  );

  return (
    <div className={clsx(containerStyles, className)}>
      {type === 'question' && (
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
      )}
      
      <Dot pos="top-2 left-2" />
      <Dot pos="top-2 right-2" />
      <Dot pos="bottom-2 left-2" />
      <Dot pos="bottom-2 right-2" />

      {title && (
        <div className="bg-mario-yellow border-b-4 border-black p-3 text-center">
          <h2 className="font-pixel text-black text-sm md:text-lg uppercase tracking-widest">{title}</h2>
        </div>
      )}
      <div className="p-6 relative z-0">
        {children}
      </div>
    </div>
  );
};

export default MarioCard;