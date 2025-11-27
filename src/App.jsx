// src/App.jsx
import React, { useState, useRef, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Əsas Komponentlər (Dərhal yüklənsin)
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Səhifələri "Tənbəl" yükləyirik (Performans artımı üçün)
// Müştəri menyunu açanda Admin və FunZone kodları yüklənməyəcək
const Login = React.lazy(() => import("./pages/Login"));
const Admin = React.lazy(() => import("./pages/Admin"));
const FunZone = React.lazy(() => import("./pages/FunZone"));

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

// Lazy yüklənən səhifələr üçün sadə loader
const PageLoader = () => (
  <div className="min-h-screen bg-premium-black flex items-center justify-center text-gold">
    Yüklənir...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana Səhifə (Birbaşa yüklənir) */}
        <Route path="/" element={<MenuPage />} />
        
        {/* Digər səhifələr (Gecikdirilmiş yükləmə) */}
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