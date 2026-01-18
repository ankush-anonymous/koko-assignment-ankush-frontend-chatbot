'use client';

import ChatbotWidget from '@/components/ChatbotWidget';

export default function Home() {
  return (
    <>
      {/* Your application content goes here */}
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold">Your Application</h1>
        <p className="mt-4 text-gray-600">
          The floating chat button widget is embedded below and will appear in the bottom-right corner.
        </p>
      </div>

      {/* Embed the chatbot widget - it's a floating button that can be used in any page */}
      <ChatbotWidget 
        botName="Chat Assistant"
        position="bottom-right"
      />
    </>
  );
}
