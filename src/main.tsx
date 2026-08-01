import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './lib/LanguageContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

// Global error interceptor to suppress expected WebSocket and HMR errors/rejections
if (typeof window !== 'undefined') {
  const ignorePatterns = [
    'websocket',
    'WebSocket',
    'vite',
    'HMR',
    'failed to connect to websocket'
  ];

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (ignorePatterns.some(p => msg.toLowerCase().includes(p.toLowerCase()))) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, { capture: true });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason?.message || (typeof reason === 'string' ? reason : '');
    if (ignorePatterns.some(p => msg.toLowerCase().includes(p.toLowerCase()))) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, { capture: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
);


