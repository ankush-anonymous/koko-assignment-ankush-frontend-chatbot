'use client';

import ChatbotWidget from '@/components/ChatbotWidget';

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-white p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-black">Chatbot Widget Features</h1>
          <p className="mt-3 text-gray-600">
            The floating chat button widget is embedded below and will appear in the bottom-right corner.
          </p>
          <ul className="mt-6 space-y-2 text-gray-700">
            <li>Floating button with bottom-right or bottom-left placement</li>
            <li>Three states: closed, open, and minimized with smooth transitions</li>
            <li>Message persistence across route changes</li>
            <li>Auto-scroll to the latest message with user scroll preservation</li>
            <li>Keyboard UX: Enter to send, Shift+Enter for newline</li>
            <li>Mobile-friendly full-height bottom sheet behavior</li>
            <li>Typing indicator while the bot is responding</li>
            <li>Session management with auto-generated session IDs</li>
            <li>Booking flow with date picker, slot selection, and confirmation steps</li>
            <li>Embeddable as a standalone script without CSS conflicts</li>
          </ul>
        </div>
      </div>

      {/* Embed the chatbot widget - it's a floating button that can be used in any page */}
      <ChatbotWidget 
        botName="Chat Assistant"
        position="bottom-right"
      />
    </>
  );
}
