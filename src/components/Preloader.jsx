import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const logoUrl = 'https://picsum.photos/id/177/100/100'; 

// --- Animasiya Variantları ---

// 1. Preloader (Əsas pəncərə)
const preloaderVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  // DÜZƏLİŞ: Səhv 'delay: 2' silindi. İndi 0.5 saniyəyə çıxacaq.
  exit: { opacity: 0, transition: { duration: 0.5 } } 
};

// 2. Loqo Şəkli
const logoVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, delay: 0.2 } 
  },
  // DÜZƏLİŞ: Çıxış animasiyası əlavə edildi
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } }
};

// 3. Mətn Konteyneri
const textContainerVariants = {
  hidden: { }, // Bu boş qalır, sadəcə uşaqları idarə edir
  visible: { 
    transition: { 
      staggerChildren: 0.08, 
      delayChildren: 0.5
    }
  },
  // DÜZƏLİŞ: Çıxış animasiyası əlavə edildi
  exit: { opacity: 0, transition: { duration: 0.3 } } // Hərflər daha tez itsin
};

// 4. Hər Bir Hərf
const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// --- Komponent ---

function Preloader() {
  const { texts } = useLanguage(); 
  const text = texts.preloader.title; 

  return (
    <motion.div
      key="preloader" // 'key' mütləqdir
      variants={preloaderVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-premium-black"
    >
      {/* 1. Loqo Şəkli */}
      <motion.img
        key="logo-img"
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        src={logoUrl}
        alt="Snap House Logo"
        className="w-24 h-24 object-cover rounded-full shadow-lg" 
      />
      
      {/* 2. Hərflərlə Animasiya Edilən Mətn */}
      <motion.h1
        key="logo-text"
        variants={textContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="font-serif text-4xl text-gold mt-6 flex overflow-hidden"
        aria-label={text}
      >
        {text.split('').map((char, index) => (
          <motion.span 
            key={`${char}-${index}`} 
            variants={letterVariants} 
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>
    </motion.div>
  );
}

export default Preloader;