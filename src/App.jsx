// src/App.jsx
import React, { useState, useRef, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Əsas Komponentlər
import Navbar from "./components/Navbar";
import Menu from "./components/Menu"; // Bu komponent artıq '/menu' səhifəsində olacaq
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Yeni Səhifə (Dərhal yüklənir)
import Welcome from "./pages/Welcome"; 

// Lazy Load olunanlar
const Login = React.lazy(() => import("./pages/Login"));
const Admin = React.lazy(() => import("./pages/Admin"));
const FunZone = React.lazy(() => import("./pages/FunZone"));

// Menyu Səhifəsi (Köhnə App-in içindəki məzmun)
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
        className="flex-1 overflow-y-auto mt-20 scroll-smooth bg-premium-black min-h-screen"
      >
        {/* Menyu burada yüklənir */}
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

const PageLoader = () => (
  <div className="min-h-screen bg-premium-black flex items-center justify-center text-gold">
    Yüklənir...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Ana Səhifə artıq "Welcome" səhifəsidir */}
        <Route path="/" element={<Welcome />} />
        
        {/* 2. Menyu düyməsinə basanda bura gələcək */}
        <Route path="/menu" element={<MenuPage />} />
        
        <Route 
          path="/login" 
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Admin />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/fun" 
          element={
            <Suspense fallback={<PageLoader />}>
              <FunZone />
            </Suspense>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;