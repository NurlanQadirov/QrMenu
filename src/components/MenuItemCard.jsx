// src/components/MenuItemCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react'; 

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
};

function MenuItemCard({ item, onClick, variants, index = 10 }) { 
  const handleClick = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(30);
    onClick(); 
  };

  // İlk 4 məhsul dərhal yüklənsin (LCP üçün)
  const isPriority = index < 4;

  return (
    <motion.div
      variants={variants || cardVariants} 
      onClick={handleClick}
      className="flex items-center space-x-4 bg-gray-900/40 border border-gray-800 p-4 rounded-xl cursor-pointer relative group overflow-hidden"
      whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.3)', backgroundColor: 'rgba(17, 24, 39, 0.8)' }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Şəkil Qutusu - Sabit ölçü */}
      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden relative border border-gray-700/50">
        {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading={isPriority ? "eager" : "lazy"}
              fetchPriority={isPriority ? "high" : "auto"}
              decoding={isPriority ? "sync" : "async"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
                <ImageIcon size={24} />
            </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg md:text-xl font-serif font-bold text-white leading-tight">
            {item.name}
          </h3>
          <span className="text-base md:text-lg font-bold text-gold whitespace-nowrap">
            {item.price}
          </span>
        </div>
        <p className="text-sm md:text-base text-gray-400 mt-1 line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default MenuItemCard;