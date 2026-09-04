import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { AppContent } from './App';
import './style.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </React.StrictMode>
  );
}
