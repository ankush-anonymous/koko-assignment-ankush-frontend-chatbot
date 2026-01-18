/**
 * Individual Message Component
 * Displays user or bot messages with appropriate styling
 * Uses inline styles for standalone bundle compatibility
 */

import React from 'react';
import { Message } from './types';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === 'user';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '16px',
    animation: 'fadeIn 0.2s ease-out',
  };

  const bubbleStyle: React.CSSProperties = {
    maxWidth: '70%',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: isUser ? '#000000' : '#e5e7eb',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: isUser ? '#ffffff' : '#000000',
    margin: 0,
  };

  const timeStyle: React.CSSProperties = {
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
    color: isUser ? '#d1d5db' : '#4b5563',
  };

  return (
    <div style={containerStyle}>
      <div style={bubbleStyle}>
        <p style={textStyle}>
          {message.text}
        </p>
        <span style={timeStyle}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
