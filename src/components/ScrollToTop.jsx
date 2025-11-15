import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

function ScrollToTop({ scrollRef }) {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll hərəkətinə qulaq asırıq
  const handleScroll = () => {
    // 300px-dən çox aşağı sürüşdürdükdə düyməni göstər
    if (scrollRef.current && scrollRef.current.scrollTop > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Zərif şəkildə yuxarı qayıt
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Haptik rəy
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  // 'scrollRef' (yəni bizim <main> elementimiz) hazır olduqda
  // ona 'scroll' event listener əlavə edirik
  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }
    
    // Komponent silindikdə event listener-i təmizləyirik
    return () => ref?.removeEventListener('scroll', handleScroll);
  }, [scrollRef]); // ref dəyişdikdə yenidən qoşulsun

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          onClick={scrollToTop}
          // Premium görünüş üçün qızılı düymə
          className="fixed bottom-6 right-6 z-50 p-3 bg-gold text-premium-black rounded-full shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default ScrollToTop;