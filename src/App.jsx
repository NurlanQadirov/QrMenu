// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Komponentlər
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Səhifələr
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import FunZone from "./pages/FunZone";

const MenuPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const mainContentRef = useRef(null);

  // Əvvəlki 2.5 saniyəlik gecikməni qaytardıq
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleItemSelected = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

  return (
    <div className="relative bg-premium-black overflow-hidden h-screen flex flex-col">
      <AnimatePresence>
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navbar />
          <main 
            ref={mainContentRef} 
            className="flex-1 overflow-y-auto mt-20 scroll-smooth bg-premium-black"
          >
            <Menu onItemSelected={handleItemSelected} mainContentRef={mainContentRef} />
            <Footer />
          </main>

          <AnimatePresence>
            {selectedItem && (
              <ItemModal item={selectedItem} onClose={handleCloseModal} />
            )}
          </AnimatePresence>

          <ScrollToTop scrollRef={mainContentRef} />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="/fun" element={<FunZone />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;