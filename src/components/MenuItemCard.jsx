import React from 'react';
import { motion } from 'framer-motion';

// Kölgə dəyərləri
const premiumShadow = '0 10px 30px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.1)';
const premiumHoverShadow = '0 15px 30px rgba(212, 175, 55, 0.15), 0 5px 15px rgba(0, 0, 0, 0.2)';

// Kart variantları (stagger olmadıqda)
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    boxShadow: premiumShadow
  },
};

function MenuItemCard({ item, onClick, variants }) { 

  const handleClick = () => {
    // Haptik rəy
    if (window.navigator.vibrate) window.navigator.vibrate(30);
    onClick(); // Əsas 'onClick' funksiyasını çağır
  };

  return (
    <motion.div
      variants={variants || cardVariants} 
      onClick={handleClick}
      className="flex items-center space-x-4 bg-premium-black/50 p-4 rounded-xl cursor-pointer relative"
      whileHover={{ scale: 1.015, boxShadow: premiumHoverShadow, zIndex: 30 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <img
        src={item.image}
        alt={item.name}
        loading="lazy" // <--- PERFORMANS ÜÇÜN DƏYİŞİKLİK
        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
      />
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <h3 className="text-lg md:text-xl font-serif font-bold text-off-white">
            {item.name}
          </h3>
          <span className="text-base md:text-lg font-medium text-gold">
            {item.price}
          </span>
        </div>
        <p className="text-sm md:text-base text-off-white/70 mt-1">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default MenuItemCard;