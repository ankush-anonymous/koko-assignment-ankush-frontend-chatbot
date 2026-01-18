/**
 * Chat Header Component
 * Contains bot name and control buttons (minimize/close)
 * Uses inline styles for standalone bundle compatibility
 */

import React from 'react';

interface ChatHeaderProps {
  botName?: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  isMinimized?: boolean;
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  borderBottom: '1px solid #d1d5db',
  backgroundColor: '#ffffff',
  borderTopLeftRadius: '12px',
  borderTopRightRadius: '12px',
};

const avatarStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  backgroundColor: '#000000',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const buttonStyle: React.CSSProperties = {
  padding: '4px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const iconStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  color: '#000000',
};

export default function ChatHeader({
  botName = 'Chat Assistant',
  onMinimize,
  onMaximize,
  onClose,
  isMinimized = false,
}: ChatHeaderProps) {
  return (
    <div style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={avatarStyle}>
          <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600 }}>
            {botName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 style={{ fontWeight: 600, color: '#000000', margin: 0, fontSize: '16px' }}>{botName}</h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isMinimized ? (
          <button
            onClick={onMaximize}
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Maximize chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={iconStyle}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={onMinimize}
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Minimize chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={iconStyle}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        )}
        <button
          onClick={onClose}
          style={buttonStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={iconStyle}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
