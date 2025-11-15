import React from 'react';
// YENİ: MapPin (Ünvan) və Smartphone (Telefon) ikonları
import { Instagram, MapPin, Smartphone } from 'lucide-react';
import Logo from './Logo';
import { motion } from 'framer-motion'; // Hovr effekti üçün

function Footer() {
  return (
    <footer className="py-12 bg-premium-black border-t border-gold/20 mt-16">
      <div className="max-w-5xl mx-auto px-6 text-center text-off-white/60">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        {/* YENİ: Premium sloqan */}
        <p className="font-serif text-lg italic text-off-white/80 mb-8">
          "Experience culinary art in every snapshot."
        </p>

        {/* YENİ: İkon siyahısı (Ünvan, Telefon, İnstagram) */}
        <div className="flex justify-center items-center space-x-8 mb-10">
          {/* Ünvan */}
          <motion.a 
            href="https://maps.google.com/" // Hələlik placeholder
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, color: '#D4AF37' }}
            className="flex flex-col items-center text-off-white/70"
          >
            <MapPin size={24} />
            <span className="text-xs mt-1">Address</span>
          </motion.a>
          
          {/* Telefon */}
          <motion.a 
            href="tel:+994500000000" // Hələlik placeholder
            whileHover={{ scale: 1.1, color: '#D4AF37' }}
            className="flex flex-col items-center text-off-white/70"
          >
            <Smartphone size={24} />
            <span className="text-xs mt-1">Call</span>
          </motion.a>

          {/* İnstagram (dizaynı digərlərinə uyğunlaşdırıldı) */}
          <motion.a 
            href="https://www.instagram.com/snaphousebaku/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, color: '#D4AF37' }}
            className="flex flex-col items-center text-off-white/70"
          >
            <Instagram size={24} />
            <span className="text-xs mt-1">Instagram</span>
          </motion.a>
        </div>
        
        <p className="text-sm">
          "Scan the QR to view anytime"
        </p>
        <p className="text-xs mt-4">
          © {new Date().getFullYear()} Snap House. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;