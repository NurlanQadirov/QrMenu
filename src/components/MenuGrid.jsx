import React from 'react';
import { motion } from 'framer-motion';
import MenuItemCard from './MenuItemCard';

// Konteyner animasiyası (Bannerin girməsini gözləyir və yavaş başlayır)
const containerVariants = {
  hidden: { }, 
  visible: {
    transition: {
      staggerChildren: 0.15, // Kartlar arası 0.15s gecikmə
      delayChildren: 0.7,    // Bütün animasiyanın başlaması üçün 0.7s gözləmə
    },
  },
};

// Kartların öz animasiyası (Zərif "spring" effekti ilə aşağıdan gəlmə)
const itemCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 20 }
  },
};

function MenuGrid({ items, onItemSelected }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 'AnimatePresence' burada lazımsızdır, çünki
        'Menu.jsx'-dəki 'key' dəyişikliyi bütün komponenti
        yenidən qurur və bu animasiyanı tətikləyir.
      */}
      {items.map((item) => (
        <MenuItemCard
          key={item.id} // Hər kartın öz 'key'-i olmalıdır
          item={item}
          variants={itemCardVariants} 
          onClick={() => onItemSelected(item)}
        />
      ))}
    </motion.div>
  );
}

export default MenuGrid;