import React from 'react';
import { motion } from 'framer-motion'; 

function MenuCategories({ categories, selectedCategory, onSelectCategory, mainContentRef }) {
  const handleSelect = (categoryKey) => {
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    onSelectCategory(categoryKey);
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.5, delay: 0.3 }}
      className="sticky top-20 z-20 bg-premium-black/80 backdrop-blur-lg"
    >
      {/* DƏYİŞİKLİK: 'md:justify-center' əlavə olundu */}
      <div className="flex space-x-4 overflow-x-auto p-4 md:p-6 hide-scrollbar max-w-5xl mx-auto md:justify-center">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => handleSelect(category.key)}
            className={`py-2 px-5 rounded-full whitespace-nowrap text-sm md:text-base font-medium transition-all duration-300 transform
              ${selectedCategory === category.key ? 'bg-gold text-premium-black scale-105' : 'bg-gray-800/50 text-off-white/60 opacity-70 hover:opacity-100 hover:text-off-white'}
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Scrollbar gizlətmək üçün
const style = document.createElement('style');
style.innerHTML = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);

export default MenuCategories;