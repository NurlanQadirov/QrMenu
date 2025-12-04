import React from 'react';
import { motion } from 'framer-motion'; 

function MenuCategories({ categories, selectedCategory, onSelectCategory, mainContentRef }) {
  const handleSelect = (categoryKey) => {
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    onSelectCategory(categoryKey);
    // mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); // Bunu hələlik bağlaya bilərsən, əgər çox hoppanırsa
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.5, delay: 0.3 }}
      className="sticky top-0 z-50 bg-premium-black border-b border-gray-800 py-3 shadow-xl"
    >
      {/* DÜZƏLİŞ BURADA: 
          1. 'touch-pan-x': Tailwind klassı (yalnız horizontal toxunuşa icazə verir)
          2. style={{ touchAction: 'pan-x' }}: Zəmanət üçün birbaşa stil
      */}
      <div 
        className="flex space-x-3 overflow-x-auto px-4 hide-scrollbar max-w-5xl mx-auto touch-pan-x overscroll-contain"
        style={{ touchAction: 'pan-x' }} 
      >
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => handleSelect(category.key)}
            className={`py-2 px-5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 transform flex-shrink-0
              ${
                selectedCategory === category.key
                  ? 'bg-gold text-premium-black scale-105 shadow-md font-bold'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
} 

// Scrollbar gizlətmək üçün CSS
const style = document.createElement('style');
style.innerHTML = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);

export default MenuCategories;