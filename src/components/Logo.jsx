import React from 'react';
import { useSettings } from '../context/SettingsContext';

function Logo() {
  const { settings } = useSettings();

  return (
    <a href="#" className="block">
      {settings.logo ? (
        <img 
          src={settings.logo} 
          alt="Restoran Logosu" 
          className="h-12 w-12 object-cover rounded-full shadow-md border border-gold/20" 
        />
      ) : (
        // Logo yüklənməyibsə, default bir şey və ya boş qutu
        <div className="h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
           <span className="text-xs text-gold font-bold">LOGO</span>
        </div>
      )}
    </a>
  );
}

export default Logo;