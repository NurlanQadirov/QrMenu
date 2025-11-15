import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";

// Modal açıldıqda arxa fonun animasiyası (performans üçün 'filter' olmadan)
const mainContentVariants = {
  open: {
    scale: 0.95,
    opacity: 0.8,
    transition: { type: "spring", stiffness: 120, damping: 30 },
  },
  closed: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 30 },
  },
};

// Saytın özünün preloader-dən sonra 'fade-in' animasiyası
const appVariants = {
  hidden: { opacity: 0 },
  // DÜZƏLİŞ: 'delay: 0.2' əlavə etdik ki, preloader çıxmağa başlasın, sonra sayt gəlsin
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
};

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const mainContentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-loader-in vəziyyəti (2.5 saniyə)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => setSelectedItem(null);
  const handleItemSelected = (item) => setSelectedItem(item);

  return (
    // 1. ƏSAS KONTEYNER
    <div className="App relative bg-premium-black overflow-hidden h-screen">
      
      {/* 2. ƏSAS ANİMASİYA NƏZARƏTÇİSİ */}
      {/* DÜZƏLİŞ: İki 'AnimatePresence' əvəzinə TƏK 'AnimatePresence' */}
      <AnimatePresence>
        {isLoading ? (
          
          // 2.1. Əgər yüklənirsə, Preloader-i göstər
          <Preloader key="preloader" />

        ) : (
          
          // 2.2. Yüklənmə bitibsə, Əsas Saytı göstər
          <motion.div
            key="main-app"
            variants={appVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }} // Bu heç vaxt işləməyəcək
            className="h-full"
          >
            {/* Kiçilən hissə */}
            <motion.div
              variants={mainContentVariants}
              animate={selectedItem ? "open" : "closed"}
              className="will-change-transform h-full flex flex-col relative z-1"
            >
              <Navbar />
              <main ref={mainContentRef} className="flex-1 overflow-y-auto">
                <div className="pt-20" /> 
                <Menu 
                  onItemSelected={handleItemSelected} 
                  mainContentRef={mainContentRef}
                />
                <Footer />
              </main>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MODAL (Ən yuxarı səviyyədə) */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal 
            item={selectedItem} 
            onClose={handleCloseModal} 
          />
        )}
      </AnimatePresence>

      {/* 4. SCROLL DÜYMƏSİ (Ən yuxarı səviyyədə) */}
      {!isLoading && <ScrollToTop scrollRef={mainContentRef} />}

    </div>
  );
}

export default App;