# Chatbot Widget - Floating Chat Button

A fully-featured, embeddable chatbot widget with a floating button interface. The widget can be easily integrated into **any website** - Next.js, React, Vue, vanilla HTML, or any other framework.

**🚀 Live Demo:** [https://koko-assignment-ankush-frontend-cha-lime.vercel.app/](https://koko-assignment-ankush-frontend-cha-lime.vercel.app/)

**📦 Embeddable Script:** [https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js](https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js)

## Features

- **Floating Button**: Always-visible chat button at bottom-right (or bottom-left)
- **Three States**: Closed → Open → Minimized
- **Smooth Animations**: CSS transitions without layout shift
- **Message Persistence**: Messages saved to localStorage
- **Auto-scroll**: Automatically scrolls to latest messages
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for newline
- **Mobile Responsive**: Full-height bottom sheet on mobile, anchored drawer on desktop
- **Booking Flow**: Special UI components for date picker, slot selection, and confirmations
- **Session Management**: Automatic session ID generation and management
- **Typing Indicator**: Animated dots while waiting for bot response

## 🚀 Quick Start - Embed in Your Website (30 seconds!)

### For Any Website (HTML, React, Vue, Next.js, etc.)

Simply add this script tag to your HTML:

```html
<script 
  src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js" 
  data-bot-name="Chat Assistant"
  data-position="bottom-right"
></script>
```

**That's it!** The floating chat button will appear in the bottom-right corner of your website.

### For Next.js Projects

Add to your `app/layout.tsx` or `pages/_app.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js"
          strategy="afterInteractive"
          data-bot-name="Chat Assistant"
          data-position="bottom-right"
        />
      </body>
    </html>
  );
}
```

### Configuration Options

- `data-bot-name` - Name of the chatbot (default: "Chat Assistant")
- `data-position` - Position: `"bottom-right"` or `"bottom-left"` (default: "bottom-right")

**Note:** The API endpoint is pre-configured and points to the hosted backend. No additional setup needed!

---

## 🛠️ Development Setup (For Contributors)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_ROUTE=api/v1/chat
```

### 3. Use the Widget in Next.js

Simply import and add the widget to any page:

```tsx
import ChatbotWidget from '@/components/ChatbotWidget';

export default function YourPage() {
  return (
    <>
      {/* Your page content */}
      
      {/* Embed the chatbot widget */}
      <ChatbotWidget 
        botName="Your Assistant"
        position="bottom-right"
      />
    </>
  );
}
```

## Widget Props

```typescript
interface ChatbotWidgetProps {
  botName?: string;            // Bot name (default: "Chat Assistant")
  initialMessages?: Message[]; // Initial messages (optional)
  theme?: 'light' | 'dark';   // Theme (default: 'light')
  position?: 'bottom-right' | 'bottom-left'; // Button position (default: "bottom-right")
  storageKey?: string;        // localStorage key for messages
}
```

**Note:** API endpoint is configured via environment variables (`NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_API_ROUTE`) and cannot be overridden via props.

## Component Structure

```
components/ChatbotWidget/
  ├── index.tsx              # Main widget component
  ├── ChatButton.tsx         # Floating button
  ├── ChatPanel.tsx          # Chat panel container
  ├── ChatHeader.tsx         # Header with controls
  ├── MessageList.tsx        # Scrollable message area
  ├── MessageItem.tsx        # Individual message
  ├── ChatInput.tsx          # Input with keyboard shortcuts
  ├── BookingInputs.tsx      # Special booking inputs
  ├── TypingIndicator.tsx    # Typing animation
  ├── hooks/                 # Custom hooks
  │   ├── useChatState.ts
  │   ├── useChatAPI.ts
  │   ├── useSession.ts
  │   ├── useBookingState.ts
  │   ├── useAutoScroll.ts
  │   └── useKeyboardShortcuts.ts
  ├── types.ts               # TypeScript types
  └── styles.css             # Custom styles
```

## API Integration

The widget expects the backend API to follow this format:

**Request:**
```json
POST /api/v1/chat
{
  "sessionId": "string",
  "userMessage": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "string",
  "bookingStatus": "initiated" | "pending" | "completed" | null,
  "bookingStep": "ASK_EMAIL" | "ASK_OWNER_NAME" | ... | null,
  "availableSlots": [
    {
      "id": "string",
      "date": "YYYY-MM-DD",
      "startTime": "ISO 8601",
      "endTime": "ISO 8601"
    }
  ]
}
```

## Session Management

- Session ID is automatically generated and stored in localStorage
- Session persists across page reloads
- When widget is closed, session is cleared and a new one is created on next open
- Session is sent to backend `/api/v1/chat/close` endpoint when widget closes

## 🔧 Building the Standalone Embeddable Script

To build your own version of the embeddable `chatbot.js` file:

```bash
# Install build dependencies (if not already installed)
npm install

# Build the standalone script
npm run build:standalone
```

This will create `public/chatbot.js` which can be hosted and embedded in any website.

**Note:** The hosted version is already available at: `https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js`

## 📖 Complete Embedding Guide

### Option 1: Simple Script Tag (Recommended - Easiest!)

**For Vanilla HTML:**
```html
<script 
  src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js" 
  data-bot-name="Chat Assistant"
  data-position="bottom-right"
></script>
```

**For Next.js (in `layout.tsx`):**
```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js"
          strategy="afterInteractive"
          data-bot-name="Chat Assistant"
          data-position="bottom-right"
        />
      </body>
    </html>
  );
}
```

### Option 2: JavaScript API

```html
<script src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js"></script>
<script>
  window.ChatbotWidget.init({
    botName: 'Chat Assistant',
    position: 'bottom-right'
  });
</script>
```

### Option 3: Configure Before Script Loads

```html
<script>
  window.ChatbotWidgetConfig = {
    botName: 'Chat Assistant',
    position: 'bottom-right'
  };
</script>
<script src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js"></script>
```

**See `EMBEDDING.md` for complete embedding documentation with all options.**

## CSS Isolation

The widget is completely isolated and won't interfere with your website:
- Uses unique container ID: `#vet-chatbot-widget-container`
- All Tailwind classes are scoped with `important` selector
- Uses `z-index: 999999` to appear above all content
- Preflight styles disabled to prevent conflicts
- Widget styles are self-contained

## Development

```bash
# Run development server (for Next.js app)
npm run dev

# Build Next.js app for production
npm run build

# Build standalone embeddable script
npm run build:standalone

# Start production server
npm start
```

## Notes

- The widget is a client component (`'use client'`)
- All state is managed internally
- Messages and booking state persist in localStorage
- The widget handles all API communication automatically
- The standalone script bundles React and ReactDOM for true isolation
- The widget works in any framework or vanilla HTML
