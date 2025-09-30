import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {(() => {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') document.documentElement.classList.add('dark');
      if (stored === 'light') document.documentElement.classList.remove('dark');
      return null;
    })()}
    {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    ) : (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="text-2xl font-bold mb-2">Google Sign-In not configured</div>
        <p className="text-sm text-gray-600">Set <code>VITE_GOOGLE_CLIENT_ID</code> in your <code>.env</code> and restart.</p>
      </div>
    )}
  </React.StrictMode>
);
