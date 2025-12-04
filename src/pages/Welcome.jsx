// src/pages/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, Gamepad2 } from 'lucide-react';
import Logo from '../components/Logo'; // Logonu burada istifadə edirik

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-premium-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Arxa fon effektləri */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Logo böyük formada */}
        <div className="flex justify-center mb-8">
           <img src="/my-logo.webp" alt="Logo" className="w-32 h-32 rounded-full shadow-2xl border-2 border-gold/20 object-cover" />
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 tracking-tight">
          Xoş Gəlmisiniz
        </h1>
        <p className="text-off-white/60 mb-12 font-light">
          Snap House kulinariya dünyasına daxil olun
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          {/* Menyu Düyməsi */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')}
            className="group relative flex items-center justify-center gap-3 bg-gold text-premium-black py-4 px-8 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Utensils size={24} />
            Menyuya Bax
          </motion.button>

          {/* Oyunlar Düyməsi */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/fun')}
            className="flex items-center justify-center gap-3 bg-gray-900 border border-gray-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
          >
            <Gamepad2 size={24} className="text-blue-400" />
            Oyun Zonası
          </motion.button>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-off-white/20 text-xs">
        © 2025 Snap House
      </div>
    </div>
  );
}

export default Welcome;