import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import MenuItemCard from './MenuItemCard';

const containerVariants = {
  hidden: { }, 
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.4 },
  },
};

const itemCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.4 }
  },
};

function MenuGrid({ menuData, selectedCategory, searchTerm, onItemSelected }) {
  const filteredItems = useMemo(() => {
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const allItems = Object.values(menuData).flat(); 
      return allItems.filter(item => 
        (item.name && item.name.toLowerCase().includes(lowerCaseSearch)) ||
        (item.description && item.description.toLowerCase().includes(lowerCaseSearch))
      );
    }
    return menuData[selectedCategory] || [];
  }, [searchTerm, selectedCategory, menuData]);

  return (
    <motion.div
      layout
      // DƏYİŞİKLİK: 'lg:grid-cols-3' əlavə olundu
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-4 md:p-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filteredItems.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          index={index}
          variants={itemCardVariants} 
          onClick={() => onItemSelected(item)}
        />
      ))}
      
      {filteredItems.length === 0 && (
        <p className="text-off-white/60 text-center col-span-1 md:col-span-2 lg:col-span-3">
          Məhsul tapılmadı.
        </p>
      )}
    </motion.div>
  );
}

export default MenuGrid;