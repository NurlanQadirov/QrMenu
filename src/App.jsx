import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";

// DÜZƏLİŞ BURADADIR (PERFORMANS)
const mainContentVariants = {
  open: {
    scale: 0.95,
    opacity: 0.8,
    // filter: "blur(5px)", // PERFORMANSI ÖLDÜRƏN SƏTİR SİLİNDİ
    transition: { type: "spring", stiffness: 120, damping: 30 },
  },
  closed: {
    scale: 1,
    opacity: 1,
    // filter: "blur(0px)", // PERFORMANSI ÖLDÜRƏN SƏTİR SİLİNDİ
    transition: { type: "spring", stiffness: 120, damping: 30 },
  },
};

// Saytın özünün preloader-dən sonra 'fade-in' animasiyası
const appVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const mainContentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-loader-in vəziyyəti
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
      
      {/* 2. Pre-loader */}
      <AnimatePresence>
        {isLoading && <Preloader />} 
      </AnimatePresence>

      {/* 3. ƏSAS SAYT MƏZMUNU (Kiçilən hissə) */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            key="main-app"
            variants={appVariants}
            initial="hidden"
            animate="visible"
            className="h-full"
          >
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

      {/* 4. MODAL (Ən yuxarı səviyyədə) */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal 
            item={selectedItem} 
            onClose={handleCloseModal} 
          />
        )}
      </AnimatePresence>

      {/* 5. SCROLL DÜYMƏSİ (Ən yuxarı səviyyədə) */}
      {!isLoading && <ScrollToTop scrollRef={mainContentRef} />}

    </div>
  );
}

export default App;