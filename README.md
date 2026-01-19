# Chatbot Widget — Plug & Play

## Project Demo Video

[Watch the walkthrough](https://drive.google.com/file/d/1FHyYe7XCdWkgvbNO6MqVUKK8c168-ukp/view?usp=sharing)

An embeddable floating chatbot button you can drop into **any website** in seconds.

**Live Demo:** https://koko-assignment-ankush-frontend-cha-lime.vercel.app/  
**Hosted Script:** https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js
**Backend Repo:** https://github.com/ankush-anonymous/koko-assignment-backend-ankush.git

---

## 1) Plug & Play (copy‑paste)

### ✅ Any website (HTML, React, Vue, etc.)
Paste this **one script tag**:

```html
<script
  src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js"
  data-bot-name="Chat Assistant"
  data-position="bottom-right"
></script>
```

That’s it — the floating chat button appears automatically.

---

## 2) Next.js (App Router)

If your `layout.tsx` is a Server Component, use a small Client Component:

```tsx
"use client";

import Script from "next/script";

export default function ChatbotScript() {
  return (
    <Script
      src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js"
      strategy="afterInteractive"
      data-bot-name="Chat Assistant"
      data-position="bottom-right"
    />
  );
}
```

Then mount it once in `layout.tsx`:

```tsx
import ChatbotScript from "@/components/chatbot-script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatbotScript />
      </body>
    </html>
  );
}
```

---

## 3) Configuration (only two options)

```html
data-bot-name="Chat Assistant"
data-position="bottom-right"  <!-- or bottom-left -->
```

No other runtime config is supported.

---

## 4) JavaScript API (optional)

```html
<script src="https://koko-assignment-ankush-frontend-cha-lime.vercel.app/chatbot.js"></script>
<script>
  window.ChatbotWidget.init({
    botName: "Chat Assistant",
    position: "bottom-right"
  });
</script>
```

Destroy:
```js
window.ChatbotWidget.destroy();
```

---

## 5) How the API works (built‑in)

The widget sends every message to:
```
POST /api/v1/chat
```

Request:
```json
{
  "sessionId": "string",
  "userMessage": "string"
}
```

Response:
```json
{
  "success": true,
  "message": "string",
  "bookingStatus": "initiated" | "pending" | "completed" | null,
  "bookingStep": "ASK_EMAIL" | "ASK_OWNER_NAME" | "ASK_PET_NAME" | "ASK_PHONE" | "ASK_DATE" | "SHOW_SLOTS" | "CONFIRM_SLOT" | null,
  "availableSlots": [
    {
      "id": "string",
      "startTime": "ISO 8601",
      "endTime": "ISO 8601"
    }
  ]
}
```

---

## 6) Booking flow (UI auto‑handled)

When `bookingStep` changes, the widget automatically shows the right UI:

- `ASK_EMAIL` → text input
- `ASK_DATE` → date picker
- `SHOW_SLOTS` → clickable slots
- `CONFIRM_SLOT` → Yes/No buttons

No host‑side work required.

---

## 7) Session behavior

- Session ID is generated on first open and stored in localStorage
- Reused across reloads and tabs
- Cleared when widget closes (`/api/v1/chat/close`)

---

## 8) CSS Isolation (safe for any site)

- Styles are scoped to `#vet-chatbot-widget-container`
- No global Tailwind reset
- High `z-index` (999999)
- Won’t affect your site CSS

---

## 9) Building your own `chatbot.js` (optional)

```bash
npm install
npm run build:standalone
```

Output: `public/chatbot.js`

### Environment variables (build time only)
```
NEXT_PUBLIC_BASE_URL=<backend base URL>
NEXT_PUBLIC_API_ROUTE=api/v1/chat
```

---

## 10) Feature highlights

- Floating button + panel
- Open / minimized / closed states
- Smooth animations
- Mobile full‑height sheet
- Auto‑scroll and typing indicator
- Booking flow UI (date, slots, confirm)
- Session persistence and timeout handling


