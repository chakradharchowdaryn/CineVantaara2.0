import React from 'react';
import { motion } from 'framer-motion';

interface ClapperboardLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ClapperboardLoader: React.FC<ClapperboardLoaderProps> = ({
  label = "Rolling Scene...",
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div className="relative">
        <motion.div
          animate={{ rotate: [-20, 0, -20] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="origin-bottom-left"
        >
          <svg
            className={`${sizeClasses} text-amber-500`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 11v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8"/>
            <path d="m4 11 2.3-4.6a2 2 0 0 1 1.8-1.1h9.8a2 2 0 0 1 1.8 1.1L22 11"/>
            <path d="m6 11 3-5"/>
            <path d="m11 11 3-5"/>
            <path d="m16 11 3-5"/>
          </svg>
        </motion.div>
      </div>
      <p className="font-cinematic text-sm tracking-widest text-amber-300 uppercase animate-pulse">
        {label}
      </p>
    </div>
  );
};
