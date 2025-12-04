import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext'; // YENİ

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <SettingsProvider> {/* YENİ: Bura əlavə olundu */}
        <App />
      </SettingsProvider>
    </LanguageProvider>
  </React.StrictMode>
);