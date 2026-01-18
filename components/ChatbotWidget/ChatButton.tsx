/**
 * Floating Chat Button Component
 * Default state: visible button at bottom-right
 * Uses inline styles for standalone bundle compatibility
 */

import React from 'react';

interface ChatButtonProps {
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

export default function ChatButton({ onClick, position = 'bottom-right' }: ChatButtonProps) {
  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: position === 'bottom-right' ? '24px' : 'auto',
    left: position === 'bottom-left' ? '24px' : 'auto',
    zIndex: 999999,
    width: '56px',
    height: '56px',
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '50%',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    pointerEvents: 'auto',
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#333333';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#000000';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      aria-label="Open chat"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '24px', height: '24px' }}
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
