import React from 'react';
import ReactDOM from 'react-dom/client';

import RootLayout from '@/layout.tsx';
import App from '@/App.tsx';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>,
);

