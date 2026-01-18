/**
 * Typing Indicator Component
 * Shows animated dots while waiting for bot response
 * Uses inline styles for standalone bundle compatibility
 */

import React from 'react';

const dotKeyframes = `
  @keyframes chatbot-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
`;

export default function TypingIndicator() {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '16px',
  };

  const bubbleStyle: React.CSSProperties = {
    backgroundColor: '#e5e7eb',
    borderRadius: '8px',
    padding: '12px 16px',
  };

  const dotsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const dotStyle = (delay: number): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    backgroundColor: '#4b5563',
    borderRadius: '50%',
    animation: 'chatbot-bounce 1.4s ease-in-out infinite',
    animationDelay: `${delay}ms`,
  });

  return (
    <>
      <style>{dotKeyframes}</style>
      <div style={containerStyle}>
        <div style={bubbleStyle}>
          <div style={dotsContainerStyle}>
            <span style={dotStyle(0)}></span>
            <span style={dotStyle(200)}></span>
            <span style={dotStyle(400)}></span>
          </div>
        </div>
      </div>
    </>
  );
}
