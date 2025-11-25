// src/App.jsx
import React, { useState, useRef, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Komponentlər (Bunlar dərhal lazımdır, ona görə lazy etmirik)
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import ItemModal from "./components/ItemModal";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Səhifələr (Lazy Loading - Yalnız lazım olanda yüklənsin)
// Bu, mobil performansını artırır, çünki ilkin yükləmədə bu kodlar olmur.
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const FunZone = lazy(() => import("./pages/FunZone"));

// Əsas Menyu Səhifəsi
const MenuPage = () => {
  // ARTIQ SÜNİ GECİKMƏ (setTimeout) YOXDUR!
  // Menu komponenti özü skeleton loading göstərir, ona görə
  // əlavə 'isLoading' state-nə ehtiyac yoxdur. 
  // Sadəcə istəsəniz, çox qısa (0.5s) bir keçid effekti üçün saxlaya bilərsiniz,
  // amma performans üçün ən yaxşısı dərhal açmaqdır.
  
  const [selectedItem, setSelectedItem] = useState(null);
  const mainContentRef = useRef(null);

  const handleItemSelected = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

  return (
    <div className="relative bg-premium-black overflow-hidden h-screen flex flex-col">
      {/* Navbar həmişə görünür */}
      <Navbar />
      
      {/* Əsas Məzmun */}
      <main 
        ref={mainContentRef} 
        className="flex-1 overflow-y-auto mt-20 scroll-smooth bg-premium-black"
      >
        <Menu onItemSelected={handleItemSelected} mainContentRef={mainContentRef} />
        <Footer />
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal item={selectedItem} onClose={handleCloseModal} />
        )}
      </AnimatePresence>

      {/* Yuxarı Sürüşdürmə Düyməsi */}
      <ScrollToTop scrollRef={mainContentRef} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* Suspense: Lazy komponentlər yüklənənə qədər Preloader göstər */}
      <Suspense fallback={<Preloader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;