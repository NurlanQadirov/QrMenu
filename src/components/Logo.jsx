import React from 'react';

function Logo() {
  return (
    <a href="#">
      <img 
        src="/my-logo.webp" 
        alt="Restoran Logosu" 
        className="h-12 w-12 object-cover rounded-full shadow-md" 
      />
    </a>
  );
}

export default Logo;