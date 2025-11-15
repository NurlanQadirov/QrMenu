import React from 'react';

// Təsadüfi logo placeholder-i (kvadrat şəkil)
// Sən bu URL-i 'public' qovluğundakı öz loqonla əvəz edə bilərsən
// Məsələn: '/snaphouse-logo.png'
const logoUrl = 'https://picsum.photos/id/177/100/100'; // Neytral bir şəkil

function Logo() {
  return (
    <a href="#">
      <img 
        src={logoUrl} 
        alt="Snap House Logo" 
        // Navbar h-20 (80px) içində h-12 (48px) yaxşı görünəcək
        className="h-12 w-12 object-cover rounded-full shadow-md" 
      />
    </a>
  );
}

export default Logo;