import React from 'react';
import { motion } from 'framer-motion'; // motion import edildi
import Logo from './Logo';

function Navbar() {
  return (
    // 'header'-i 'motion.header'-ə dəyişirik
    <motion.header
      initial={{ y: -100, opacity: 0 }} // Başlanğıcda yuxarıda və görünməz
      animate={{ y: 0, opacity: 1 }}     // Son vəziyyət
      transition={{ ease: "easeOut", duration: 0.5, delay: 0.1 }} // Animasiya
      className="fixed top-0 left-0 right-0 z-30 h-20 
                   bg-premium-black/50 backdrop-blur-md 
                   border-b border-gold/30"
    >
      <div className="max-w-5xl mx-auto h-full flex items-center px-6">
        <Logo />
      </div>
    </motion.header>
  );
}

export default Navbar;