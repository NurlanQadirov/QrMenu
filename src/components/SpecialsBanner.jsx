// src/components/SpecialsBanner.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const bannerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 20, delay: 0.2 }
  }
};

function SpecialsBanner({ item, onClick }) {
  const { texts } = useLanguage();

  if (!item) return null;

  return (
    <motion.div 
      variants={bannerVariants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      // Hündürlüyü azaltdıq və desktopda mərkəzləşdirdik
      className="relative mx-4 md:mx-auto max-w-4xl h-40 md:h-52 rounded-2xl overflow-hidden cursor-pointer group shadow-premium border border-gold/20"
    >
      {/* Arxa fon şəkli (Bulanıq) - Effekt üçün */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-50 scale-110"
        style={{ backgroundImage: `url(${item.image})` }}
      />
      
      {/* Tündləşdirici qat */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      
      {/* Məzmun */}
      <div className="absolute inset-0 flex items-center px-6 md:px-10">
         {/* Orijinal Şəkil (Dairəvi və ya kvadrat, sol tərəfdə) */}
         <img 
            src={item.image} 
            alt={item.name}
            loading="eager" // Dəyişiklik: lazy yox, eager
   fetchPriority="high" // Dəyişiklik: Yüksək prioritet
            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-2 border-gold shadow-lg mr-6 flex-shrink-0 bg-black"
         />

         <div className="flex flex-col justify-center text-white">
            <div className="flex items-center gap-2 mb-1">
               <Star size={14} className="text-gold fill-gold" />
               <span className="text-[10px] md:text-xs font-bold text-gold uppercase tracking-widest">
                  {texts.specialsBanner.title}
               </span>
            </div>
            
            <h3 className="font-serif text-xl md:text-3xl font-bold leading-tight mb-1">
              {item.name}
            </h3>
            <p className="text-gold font-medium text-lg">{item.price}</p>
         </div>
      </div>
    </motion.div>
  );
}

export default SpecialsBanner;