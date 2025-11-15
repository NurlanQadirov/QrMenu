import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Clock } from 'lucide-react'; 
import { useLanguage } from '../context/LanguageContext'; // Dil üçün import

// --- Animasiya Variantları ---

// Arxa fon (Bulanıqlıq)
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Mobil üçün modal (Aşağıdan yavaş açılma və bağlanma)
const modalVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 120, damping: 30 } 
  },
  exit: { 
    opacity: 0, 
    y: "100%",
    transition: { type: 'spring', stiffness: 120, damping: 30 }
  },
};

// Desktop üçün modal (Mərkəzdən yavaş açılma və bağlanma)
const desktopModalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 120, damping: 30 } 
  },
  exit: { 
    opacity: 0, 
    y: 50,
    transition: { type: 'spring', stiffness: 120, damping: 30 }
  },
};

// --- Komponent ---

function ItemModal({ item, onClose }) {
  const { texts } = useLanguage(); // Dili kontekstdən götürürük
  const isMobile = window.innerWidth < 768;

  return (
    <>
      {/* 1. Arxa Fon (Bulanıq) */}
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50" 
      />

      {/* 2. Modal Pəncərəsi */}
      <motion.div
        key="modal"
        variants={isMobile ? modalVariants : desktopModalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed z-50 bottom-0 left-0 right-0 h-[90vh] md:h-[85vh] md:w-[90vw] md:max-w-2xl md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                   bg-gray-900/60 backdrop-blur-md border-t-2 md:border-2 border-gold/50 
                   rounded-t-2xl md:rounded-2xl shadow-premium overflow-hidden flex flex-col"
      >
        {/* --- Modalın Daxili Məzmunu --- */}

        {/* 2.1. Bağlama Düyməsi */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-white/10 rounded-full"
        >
          <X size={20} className="text-white" />
        </button>

        {/* 2.2. Şəkil */}
        <div className="h-60 md:h-80 w-full overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            loading="lazy" // <--- PERFORMANS ÜÇÜN DƏYİŞİKLİK
            className="w-full h-full object-cover" 
          />
        </div>

        {/* 2.3. Məlumat Hissəsi (Scroll ola bilən) */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Başlıq və Qiymət */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-3xl font-serif text-gold">{item.name}</h2>
            <span className="text-2xl font-medium text-gold">{item.price}</span>
          </div>

          {/* Təsvir */}
          <p className="text-off-white/80 mb-6">{item.description}</p>
          
          {/* Əlavə Məlumatlar (Dildən gəlir) */}
          <div className="flex space-x-6 mb-6">
            {item.isRecommended && (
              <div className="flex items-center text-off-white/70">
                <Star size={18} className="text-gold mr-2" />
                <span>{texts.modal.chefPick}</span>
              </div>
            )}
            <div className="flex items-center text-off-white/70">
              <Clock size={18} className="text-gold mr-2" />
              <span>{item.prepTime}</span>
            </div>
          </div>

          {/* Tərkib (Dildən gəlir) */}
          <h4 className="text-lg font-serif text-white mb-2">
            {texts.modal.ingredients}
          </h4>
          <p className="text-off-white/70">
            {item.ingredients ? item.ingredients.join(', ') : '...'}
          </p>
        </div>
      </motion.div>
    </>
  );
}

export default ItemModal;