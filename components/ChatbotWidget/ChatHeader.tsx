/**
 * Chat Header Component
 * Contains bot name and control buttons (minimize/close)
 */

import React from 'react';

interface ChatHeaderProps {
  botName?: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  isMinimized?: boolean;
}

export default function ChatHeader({
  botName = 'Chat Assistant',
  onMinimize,
  onMaximize,
  onClose,
  isMinimized = false,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white rounded-t-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {botName.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="font-semibold text-black">{botName}</h3>
      </div>
      <div className="flex items-center gap-2">
        {isMinimized ? (
          <button
            onClick={onMaximize}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Maximize chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-black"
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
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Minimize chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-black"
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
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black"
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
