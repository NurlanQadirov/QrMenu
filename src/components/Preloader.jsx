import React from 'react';
import { motion } from 'framer-motion';

// Loqo üçün eyni placeholder URL
const logoUrl = 'https://picsum.photos/id/177/100/100'; 

// Bütün pre-loader pəncərəsi (arxa fon)
const preloaderVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  // 2 saniyə göstərildikdən sonra 0.5s ərzində zərifcə yox ol
  exit: { opacity: 0, transition: { duration: 0.5, delay: 2 } } 
};

// Təkrarlanan nəbz effekti (ümumi)
const itemVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      opacity: { duration: 0.5 },
      yoyo: Infinity, // 'yoyo' nəbz effekti yaradır
      duration: 1.5,
      ease: "easeInOut"
    }
  },
  // Pre-loader çıxanda elementlər də yox olsun
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function Preloader() {
  return (
    <motion.div
      key="preloader"
      variants={preloaderVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-premium-black"
    >
      {/* 1. Loqo Şəkli */}
      <motion.img
        key="logo-img"
        variants={itemVariants} // Ümumi nəbz effektini tətbiq et
        initial="initial"
        animate="animate"
        exit="exit"
        src={logoUrl}
        alt="Snap House Logo"
        className="w-24 h-24 object-cover rounded-full shadow-lg" 
      />
      
      {/* 2. Restoran Adı */}
      <motion.h1
        key="logo-text"
        variants={itemVariants} // Ümumi nəbz effektini tətbiq et
        initial="initial"
        animate="animate"
        exit="exit"
        className="font-serif text-4xl text-gold mt-6"
      >
        Snap House
      </motion.h1>
    </motion.div>
  );
}

export default Preloader;