import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // Dil üçün import

// Bannerin öz animasiyası
const bannerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 20, delay: 0.5 }
  }
};

function SpecialsBanner({ item, onClick }) {
  const { texts } = useLanguage(); // Dili götürürük

  if (!item) return null;

  return (
    <motion.div 
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      className="relative mx-4 md:mx-auto h-36 rounded-xl overflow-hidden cursor-pointer group shadow-premium"
    >
      {/* Arxa fon şəkli */}
      <img 
        src={item.image} 
        alt={item.name} 
        loading="lazy" // <--- PERFORMANS ÜÇÜN DƏYİŞİKLİK
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
      />
      
      {/* Şəklin üzərindəki qara qat */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Məzmun (Mərkəzdə) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
        {/* "CHEF'S SPECIAL" nişanı */}
        <div className="flex items-center bg-gold/20 backdrop-blur-sm px-3 py-1 rounded-full mb-2 border border-gold/30">
          <Star size={16} className="text-gold mr-1" />
          <span className="text-xs font-medium text-gold uppercase tracking-wider">
            {texts.specialsBanner.title}
          </span>
        </div>
        
        {/* Yeməyin adı */}
        <h3 className="font-serif text-3xl font-bold">{item.name}</h3>
      </div>
    </motion.div>
  );
}

export default SpecialsBanner;