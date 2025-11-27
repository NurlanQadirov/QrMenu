import React, { useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import FunZone from "./pages/FunZone"; 


const MenuPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const mainContentRef = useRef(null);


  const handleItemSelected = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

  return (
    <div className="relative bg-premium-black overflow-hidden h-screen flex flex-col">
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
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fun" element={<FunZone />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;