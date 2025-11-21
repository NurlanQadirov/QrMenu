import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './context/LanguageContext'; // YENİ İMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Bütün tətbiqi dil təminatçısı ilə əhatə edirik */}
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

