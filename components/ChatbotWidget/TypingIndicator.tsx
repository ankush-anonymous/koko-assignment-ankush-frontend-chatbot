/**
 * Typing Indicator Component
 * Shows animated dots while waiting for bot response
 */

import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-gray-200 rounded-lg px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span 
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" 
            style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
          ></span>
          <span 
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" 
            style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
          ></span>
          <span 
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" 
            style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
          ></span>
        </div>
      </div>
    </div>
  );
}
