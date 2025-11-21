// src/components/ItemModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Clock } from 'lucide-react'; 
import { useLanguage } from '../context/LanguageContext';

// Arxa fon (Qaranlıq)
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Modalın hərəkəti (Mobil: Aşağıdan, Desktop: Ortadan)
const modalVariants = {
  hidden: { y: "100%", opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    // DƏYİŞİKLİK: Daha ağır və yumşaq animasiya (stiffness: 100, mass: 1.2)
    transition: { type: 'spring', damping: 25, stiffness: 100, mass: 1.2 } 
  },
  exit: { 
    y: "100%", 
    opacity: 0, 
    transition: { duration: 0.4, ease: "easeInOut" } 
  }
};

function ItemModal({ item, onClose }) {
  const { texts } = useLanguage();
  
  // İnqredientləri yoxlayıb göstəririk
  const ingredientsList = Array.isArray(item.ingredients) 
    ? item.ingredients.join(', ') 
    : item.ingredients;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      
      {/* 1. Arxa Fon (Bulanıq və Qara) */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* 2. Modalın Özü */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full md:w-[500px] max-h-[90vh] bg-gray-900 rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col"
      >
        
        {/* Şəkil Hissəsi */}
        <div className="relative h-64 md:h-72 flex-shrink-0">
          {item.image ? (
             <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
          ) : (
             <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">Şəkil yoxdur</div>
          )}
          
          {/* Bağlama Düyməsi */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition backdrop-blur-md"
          >
            <X size={20} />
          </button>
          
          {/* Qradiyent */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>

        {/* Məlumat Hissəsi (Scroll olunan) */}
        <div className="p-6 overflow-y-auto">
          
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight pr-4">
              {item.name}
            </h2>
            <span className="text-xl font-bold text-gold whitespace-nowrap">
              {item.price}
            </span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {item.description}
          </p>
          
          {/* Detallar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-xs text-gray-300 border border-gray-700">
              <Clock size={14} className="text-gold" />
              <span>{item.prepTime}</span>
            </div>
            
            {item.isRecommended && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 rounded-lg text-xs text-gold border border-gold/20">
                <Star size={14} className="fill-gold" />
                <span>{texts.modal.chefPick}</span>
              </div>
            )}
          </div>

          {/* Tərkib */}
          {ingredientsList && (
            <div className="border-t border-gray-800 pt-4">
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
                {texts.modal.ingredients}
              </h4>
              <p className="text-sm text-gray-400">
                {ingredientsList}
              </p>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

export default ItemModal;