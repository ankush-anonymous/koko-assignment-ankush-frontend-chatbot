/**
 * Standalone Chatbot Widget Loader
 * This file is used to create an embeddable script
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from '../components/ChatbotWidget';
import WidgetWrapper from '../components/ChatbotWidget/WidgetWrapper';
import '../components/ChatbotWidget/styles.css';

// Global interface for widget configuration
declare global {
  interface Window {
    ChatbotWidgetConfig?: {
      botName?: string;
      position?: 'bottom-right' | 'bottom-left';
    };
    ChatbotWidget?: {
      init: (config?: Window['ChatbotWidgetConfig']) => void;
      destroy: () => void;
    };
  }
}

let widgetContainer: HTMLDivElement | null = null;
let root: ReturnType<typeof createRoot> | null = null;

function initChatbot(config?: Window['ChatbotWidgetConfig']) {
  // Destroy existing widget if any
  if (widgetContainer && root) {
    root.unmount();
    widgetContainer.remove();
  }

  // Create isolated container with unique ID
  widgetContainer = document.createElement('div');
  widgetContainer.id = 'vet-chatbot-widget-container';
  widgetContainer.setAttribute('data-chatbot-widget', 'true');
  document.body.appendChild(widgetContainer);

  // Create React root and render widget
  root = createRoot(widgetContainer);

  root.render(
    <WidgetWrapper>
      <ChatbotWidget
        botName={config?.botName || 'Chat Assistant'}
        position={config?.position || 'bottom-right'}
      />
    </WidgetWrapper>
  );
}

function destroyChatbot() {
  if (root) {
    root.unmount();
    root = null;
  }
  if (widgetContainer) {
    widgetContainer.remove();
    widgetContainer = null;
  }
}

// Expose global API
window.ChatbotWidget = {
  init: initChatbot,
  destroy: destroyChatbot,
};

// Auto-initialize when DOM is ready
function autoInitialize() {
  // Check if config is already set
  if (window.ChatbotWidgetConfig) {
    initChatbot(window.ChatbotWidgetConfig);
    return;
  }

  // Also support direct initialization via data attributes on script tag
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    if (script.src && script.src.includes('chatbot.js')) {
      const botName = script.getAttribute('data-bot-name');
      const position = script.getAttribute('data-position') as 'bottom-right' | 'bottom-left' | null;

      // Auto-initialize if data attributes are found, or if script tag exists (use defaults)
      initChatbot({
        botName: botName || undefined,
        position: position || undefined,
      });
      break;
    }
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitialize);
} else {
  // DOM is already ready
  autoInitialize();
}

// Code executes immediately when script loads
// No export needed - we're using window.ChatbotWidget directly
