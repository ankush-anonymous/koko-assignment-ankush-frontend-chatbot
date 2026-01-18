/**
 * Widget Wrapper Component
 * Ensures CSS isolation and prevents style conflicts
 */

import React, { useEffect } from 'react';

interface WidgetWrapperProps {
  children: React.ReactNode;
}

export default function WidgetWrapper({ children }: WidgetWrapperProps) {
  useEffect(() => {
    // Inject scoped styles to prevent conflicts
    const styleId = 'vet-chatbot-widget-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        #vet-chatbot-widget-container {
          all: initial;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: fixed;
          z-index: 999999;
          pointer-events: none;
        }
        #vet-chatbot-widget-container * {
          box-sizing: border-box;
        }
        #vet-chatbot-widget-container button,
        #vet-chatbot-widget-container input,
        #vet-chatbot-widget-container textarea,
        #vet-chatbot-widget-container div,
        #vet-chatbot-widget-container span,
        #vet-chatbot-widget-container p {
          font-family: inherit;
          pointer-events: auto;
        }
        /* Ensure widget elements are interactive */
        #vet-chatbot-widget-container button,
        #vet-chatbot-widget-container input,
        #vet-chatbot-widget-container textarea {
          pointer-events: auto;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup on unmount
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  return <>{children}</>;
}
