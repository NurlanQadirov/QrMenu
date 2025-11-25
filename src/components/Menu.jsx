// src/components/Menu.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Yönləndirmə üçün
import { Gamepad2 } from 'lucide-react'; // Oyun ikonu
import { useLanguage } from '../context/LanguageContext';
import MenuCategories from './MenuCategories';
import SpecialsBanner from './SpecialsBanner';
import MenuGrid from './MenuGrid';
import Searchbar from './Searchbar';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Yükləmə Skleti (Loading)
function MenuLoadingSkeleton() {
  return (
    <div className="p-4 max-w-6xl mx-auto animate-pulse space-y-6">
      <div className="h-12 bg-gray-800 rounded-xl w-full max-w-xl mx-auto"></div>
      <div className="flex gap-4 overflow-hidden justify-center">
        {[...Array(5)].map((_, i) => <div key={i} className="h-10 w-24 bg-gray-800 rounded-full flex-shrink-0"></div>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>)}
      </div>
    </div>
  );
}

function Menu({ onItemSelected, mainContentRef }) {
  const { language } = useLanguage();
  const navigate = useNavigate(); // Səhifəni dəyişmək üçün
  
  const [categories, setCategories] = useState([]);
  const [menuData, setMenuData] = useState({});
  const [specialItem, setSpecialItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Firebase-dən məlumatları çəkmək
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Kateqoriyaları gətir (sıraya görə)
        const catsRef = collection(db, "categories");
        const q = query(catsRef, orderBy("order"));
        const catSnapshot = await getDocs(q);
        
        const loadedCats = [];
        catSnapshot.forEach((doc) => {
          const data = doc.data();
          loadedCats.push({
            key: data.key,
            name: data.name[language] || data.name['az']
          });
        });
        setCategories(loadedCats);

        // 2. Məhsulları gətir
        const itemsRef = collection(db, "menuItems");
        const itemsSnapshot = await getDocs(itemsRef);
        
        const loadedMenuData = {};
        let loadedSpecialItem = null;

        itemsSnapshot.forEach((doc) => {
          const data = doc.data();
          const catKey = data.categoryId;

          const formattedItem = {
            id: doc.id,
            price: data.price,
            image: data.image,
            prepTime: data.prepTime,
            isRecommended: data.isRecommended,
            name: data.name[language] || data.name['az'],
            description: data.description[language] || "",
            ingredients: data.ingredients[language] || []
          };

          if (!loadedMenuData[catKey]) loadedMenuData[catKey] = [];
          loadedMenuData[catKey].push(formattedItem);

          // Şefin seçimi (ilk tapılan tövsiyəli məhsul)
          if (formattedItem.isRecommended && !loadedSpecialItem) {
            loadedSpecialItem = formattedItem;
          }
        });

        setMenuData(loadedMenuData);
        setSpecialItem(loadedSpecialItem);

        if (loadedCats.length > 0) setSelectedCategory(loadedCats[0].key);

      } catch (error) {
        console.error("Firebase Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const handleSelectCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setSearchTerm('');
    
    // Kateqoriya seçəndə biraz aşağı sürüşdür ki, header görünməsin
    const yOffset = -140; 
    const element = document.getElementById('menu-grid-start');
    if (element) {
       const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
       mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) return <MenuLoadingSkeleton />;
  if (categories.length === 0) return <div className="text-center p-10 text-white">Məlumat yoxdur.</div>;

  return (
    <section id="menu" className="pb-16 max-w-6xl mx-auto min-h-screen relative">
      
      {/* 1. AXTARIŞ (ƏN ÜSTDƏ) */}
      <div className="pt-6 px-4">
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* 2. KATEQORİYALAR (YAPIŞQAN/STICKY) */}
      <MenuCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        mainContentRef={mainContentRef}
      />

      <div id="menu-grid-start" className="pt-6">
        {/* 3. BANNER (Yalnız axtarış yoxdursa və Xüsusi Məhsul varsa) */}
        {!searchTerm && specialItem && (
          <div className="mb-8">
            <SpecialsBanner 
              item={specialItem} 
              onClick={() => onItemSelected(specialItem)} 
            />
          </div>
        )}

        {/* 4. MƏHSULLAR GRID-İ */}
        <MenuGrid
          key={selectedCategory + searchTerm}
          menuData={menuData}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onItemSelected={onItemSelected}
        />
      </div>

      {/* --- YENİ: ÜZƏN OYUN DÜYMƏSİ (FLOATING BUTTON) --- */}
      <button
        onClick={() => navigate('/fun')}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center animate-bounce hover:scale-110 transition border-2 border-white/20"
        style={{ animationDuration: '2s' }}
      >
        <Gamepad2 size={28} />
      </button>

    </section>
  );
}

export default Menu;