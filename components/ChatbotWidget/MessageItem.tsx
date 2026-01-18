/**
 * Individual Message Component
 * Displays user or bot messages with appropriate styling
 */

import React from 'react';
import { Message } from './types';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-[fadeIn_0.2s_ease-out]`}
    >
      <div
        className={`
          max-w-[80%] md:max-w-[70%]
          px-4 py-2 rounded-lg
          ${isUser ? 'bg-black' : 'bg-gray-200'}
        `}
      >
        <p className={`text-sm whitespace-pre-wrap break-words ${isUser ? 'text-white' : 'text-black'}`}>
          {message.text}
        </p>
        <span
          className={`
            text-xs mt-1 block
            ${isUser ? 'text-gray-300' : 'text-gray-600'}
          `}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
