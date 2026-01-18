# Embedding the Chatbot Widget

The chatbot widget can be embedded in any website using a simple script tag. It's completely isolated and won't interfere with your website's CSS or JavaScript.

## Quick Embed

### Option 1: Simple Script Tag with Data Attributes (Recommended - Easiest!)

**For Vanilla HTML:**
```html
<script 
  src="https://your-domain.com/chatbot.js" 
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
          src="https://your-domain.com/chatbot.js"
          strategy="afterInteractive"
          data-bot-name="Chat Assistant"
          data-position="bottom-right"
        />
      </body>
    </html>
  );
}
```

**That's it!** The widget automatically initializes when the script loads. No additional JavaScript needed!

### Option 2: JavaScript API (For Next.js or Dynamic Loading)

#### For Next.js Projects

In your `layout.tsx` or `_app.tsx`, use Next.js `Script` component:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        {/* Embed chatbot widget */}
        <Script
          src="https://your-domain.com/chatbot.js"
          strategy="afterInteractive"
          onLoad={() => {
            // Initialize after script loads
            if (window.ChatbotWidget) {
              window.ChatbotWidget.init({
                botName: 'Chat Assistant',
                position: 'bottom-right'
              });
            }
          }}
        />
      </body>
    </html>
  );
}
```

#### For Vanilla HTML or Other Frameworks

```html
<script src="https://your-domain.com/chatbot.js"></script>
<script>
  // Wait for script to load, then initialize
  window.addEventListener('load', () => {
    if (window.ChatbotWidget) {
      window.ChatbotWidget.init({
        botName: 'Chat Assistant',
        position: 'bottom-right'
      });
    }
  });
</script>
```

### Option 3: Configure Before Script Loads

```html
<script>
  // Set configuration before script loads
  window.ChatbotWidgetConfig = {
    botName: 'Chat Assistant',
    position: 'bottom-right'
  };
</script>
<script src="https://your-domain.com/chatbot.js"></script>
```

## Configuration Options

### Data Attributes (Option 1)

- `data-bot-name` - Name of the chatbot (default: "Chat Assistant")
- `data-position` - Position: "bottom-right" or "bottom-left" (default: "bottom-right")

**Note:** API endpoint is configured via environment variables when building the script (`NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_API_ROUTE`).

### JavaScript Config Object

```javascript
{
  botName?: string;            // Bot name (default: "Chat Assistant")
  position?: 'bottom-right' | 'bottom-left'; // Position (default: "bottom-right")
}
```

## API Methods

### Initialize Widget

```javascript
window.ChatbotWidget.init({
  botName: 'My Assistant',
  position: 'bottom-right'
});
```

### Destroy Widget

```javascript
window.ChatbotWidget.destroy();
```

## CSS Isolation

The widget is completely isolated:
- Uses a unique container ID: `#vet-chatbot-widget-container`
- All styles are scoped to prevent conflicts
- Uses `z-index: 999999` to appear above all content
- Uses `pointer-events: none` on container, `pointer-events: auto` on interactive elements
- Won't affect your website's styles

## Building the Standalone Script

To build the embeddable script:

```bash
npm run build:standalone
```

This will create `public/chatbot.js` which can be hosted and embedded.

## Example HTML Page

See `standalone/index.html` for a complete example of embedding the widget.

## API Endpoint Configuration

The API endpoint is configured when building the script using environment variables:

- `NEXT_PUBLIC_BASE_URL` - Base URL (e.g., "http://localhost:3000")
- `NEXT_PUBLIC_API_ROUTE` - API route (default: "api/v1/chat")

These are set in `.env.local` and baked into the built script. The endpoint cannot be changed at runtime.

## Notes

- The widget requires React and ReactDOM to be available (bundled in the script)
- The widget is responsive and works on mobile and desktop
- All state is managed internally using localStorage
- The widget automatically handles session management
- API endpoint is configured at build time, not runtime
