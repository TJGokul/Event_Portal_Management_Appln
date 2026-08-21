import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Start Mock Service Worker (MSW) asynchronously before mounting React
async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass', // Bypass unhandled static resource calls
    quiet: true, // Hides the "[MSW] Mocking enabled." console message
    serviceWorker: {
      url: '/mockServiceWorker.js', // Points to public directory target
    }
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
