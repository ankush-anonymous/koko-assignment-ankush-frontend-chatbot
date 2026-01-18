/**
 * Example: How to embed the chatbot widget in a Next.js layout.tsx
 */

import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Option 1: Auto-initialize with data attributes (Simplest) */}
        <Script
          src="https://your-domain.com/chatbot.js"
          strategy="afterInteractive"
          data-bot-name="Chat Assistant"
          data-position="bottom-right"
        />
        
        {/* Option 2: Initialize manually with JavaScript API */}
        {/* 
        <Script
          src="https://your-domain.com/chatbot.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.ChatbotWidget) {
              window.ChatbotWidget.init({
                botName: 'Chat Assistant',
                position: 'bottom-right'
              });
            }
          }}
        />
        */}
      </body>
    </html>
  );
}
