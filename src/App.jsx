// src/App.jsx
import React, { useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Komponentlər
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Səhifələr
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import FunZone from "./pages/FunZone";

// Menu Səhifəsi Komponenti (App-dan kənarda)
const MenuPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const mainContentRef = useRef(null);

  const handleItemSelected = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

  return (
    <div className="relative bg-premium-black overflow-hidden h-screen flex flex-col">
      {/* Navbar sabit qalır */}
      <Navbar />
      
      <main 
        ref={mainContentRef} 
        // DÜZƏLİŞ: 'min-h-screen' əlavə etdik ki, footer hoppanmasın (CLS balını düzəldir)
        className="flex-1 overflow-y-auto mt-20 scroll-smooth bg-premium-black min-h-screen"
      >
        {/* Menu komponenti özü daxildə yüklənməni idarə edir */}
        <Menu onItemSelected={handleItemSelected} mainContentRef={mainContentRef} />
        
        <Footer />
      </main>

      {/* Modal Pəncərəsi */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal item={selectedItem} onClose={handleCloseModal} />
        )}
      </AnimatePresence>

      {/* Yuxarı Qayıt Düyməsi */}
      <ScrollToTop scrollRef={mainContentRef} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana Səhifə */}
        <Route path="/" element={<MenuPage />} />
        
        {/* Giriş və Admin */}
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        {/* Oyun Zonası */}
        <Route path="/fun" element={<FunZone />} />
        
        {/* Yanlış linklər üçün */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;