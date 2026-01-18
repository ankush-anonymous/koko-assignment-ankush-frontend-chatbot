/**
 * Floating Chat Button Component
 * Default state: visible button at bottom-right
 */

import React from 'react';

interface ChatButtonProps {
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

export default function ChatButton({ onClick, position = 'bottom-right' }: ChatButtonProps) {
  const positionClasses =
    position === 'bottom-right' 
      ? 'bottom-6 right-4 md:right-6' 
      : 'bottom-6 left-4 md:left-6';

  return (
    <button
      onClick={onClick}
      className={`
        ${positionClasses}
        fixed
        z-[999999]
        w-14 h-14
        md:w-14 md:h-14
        bg-black hover:bg-gray-800
        text-white
        rounded-full
        shadow-lg
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
      `}
      aria-label="Open chat"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>
  );
}
