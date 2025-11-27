// src/components/MenuItemCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

// Kölgə dəyərləri
const premiumShadow = '0 10px 30px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.1)';

// Kart animasiyası
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    boxShadow: premiumShadow
  },
};

function MenuItemCard({ item, onClick, variants, index }) { 

  const handleClick = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(30);
    onClick(); 
  };

  // İlk 4 məhsul dərhal yüklənsin (Performans üçün)
  const isPriority = index < 4;

  return (
    <motion.div
      variants={variants || cardVariants} 
      onClick={handleClick}
      className="flex items-center space-x-4 bg-gray-900/40 border border-gray-800 p-4 rounded-xl cursor-pointer relative group overflow-hidden transition-colors hover:bg-gray-800/60 hover:border-gold/30"
      whileTap={{ scale: 0.98 }}
    >
      {/* Şəkil Konteyneri (Sabit ölçülü) */}
      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden relative border border-gray-700/50">
        {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              // PERFORMANS AYARLARI:
              loading={isPriority ? "eager" : "lazy"}      // İlk 4-ü dərhal, qalanı gec
              fetchPriority={isPriority ? "high" : "auto"}  // İlk 4-ə üstünlük ver
              decoding="sync"                               // Daha sürətli aç
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        ) : (
            // Şəkil yoxdursa ikon göstər
            <div className="w-full h-full flex items-center justify-center text-gray-600">
                <ImageIcon size={24} />
            </div>
        )}
      </div>

      {/* Yazı Hissəsi */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg md:text-xl font-serif font-bold text-white leading-tight line-clamp-2">
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