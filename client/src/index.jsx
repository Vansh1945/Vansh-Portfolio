import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { WebsiteSettingsProvider } from './context/WebsiteSettingsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <WebsiteSettingsProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </WebsiteSettingsProvider>
  </BrowserRouter>
);
