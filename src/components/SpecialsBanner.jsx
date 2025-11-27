// src/components/SpecialsBanner.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const bannerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, scale: 1,
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
      className="relative mx-4 md:mx-auto max-w-4xl h-48 md:h-64 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-gold/20"
    >
      {/* Arxa Fon Şəkli */}
      <img 
        src={item.image} 
        alt={item.name} 
        loading="eager" 
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Tündləşdirici Qradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      {/* Məzmun */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
         <div className="flex items-center gap-2 mb-2">
            <div className="bg-gold text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
               <Star size={12} className="fill-black"/> {texts.specialsBanner.title}
            </div>
         </div>
         <h3 className="font-serif text-2xl md:text-4xl font-bold text-white mb-1 drop-shadow-md">
           {item.name}
         </h3>
         <p className="text-gold font-bold text-xl">{item.price}</p>
      </div>
    </motion.div>
  );
}

export default SpecialsBanner;