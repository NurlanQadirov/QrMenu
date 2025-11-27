import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Gamepad2 } from 'lucide-react'; 
import { useLanguage } from '../context/LanguageContext';
import MenuCategories from './MenuCategories';
import SpecialsBanner from './SpecialsBanner';
import MenuGrid from './MenuGrid';
import Searchbar from './Searchbar';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore'; 

// --- TƏKMİLLƏŞDİRİLMİŞ SKELET (Skeleton) ---
// Bu, real menyuya çox bənzəyir, ona görə də CLS (Sürüşmə) problemini həll edir
function MenuLoadingSkeleton() {
  return (
    <div className="p-4 max-w-6xl mx-auto animate-pulse space-y-8 mt-6">
      {/* Searchbar Skeleton */}
      <div className="h-14 bg-gray-800/50 rounded-xl w-full max-w-xl mx-auto"></div>
      
      {/* Categories Skeleton */}
      <div className="flex gap-4 overflow-hidden justify-center py-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-800/50 rounded-full flex-shrink-0"></div>
        ))}
      </div>

      {/* Banner Skeleton */}
      <div className="h-48 md:h-64 bg-gray-800/50 rounded-3xl w-full max-w-4xl mx-auto border border-gray-800"></div>

      {/* Menu Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 bg-gray-900/30 p-4 rounded-xl border border-gray-800">
             <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0"></div>
             <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800/50 rounded w-full"></div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Menu({ onItemSelected, mainContentRef }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // --- STATE OPTİMİZASİYASI ---
  // Başlanğıc dəyərləri boş qoyuruq
  const [data, setData] = useState({ categories: [], menuData: {}, specialItem: null });
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // AbortController: Səhifə tez dəyişsə, köhnə sorğunu ləğv edir (Sürət üçün)
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // PARALEL YÜKLƏMƏ (Promise.all) - Daha sürətli nəticə üçün
        const [catsSnapshot, itemsSnapshot, bannerDoc] = await Promise.all([
           getDocs(query(collection(db, "categories"), orderBy("order"))),
           getDocs(collection(db, "menuItems")),
           getDoc(doc(db, "settings", "banner"))
        ]);

        // 1. Kateqoriyalar
        const loadedCats = catsSnapshot.docs.map(doc => ({
            key: doc.data().key,
            name: doc.data().name[language] || doc.data().name['az']
        }));

        // 2. Məhsullar
        const loadedMenuData = {};
        let loadedSpecialItem = null;

        itemsSnapshot.docs.forEach((doc) => {
          const d = doc.data();
          const catKey = d.categoryId;
          const item = {
            id: doc.id,
            price: d.price,
            image: d.image,
            prepTime: d.prepTime,
            isRecommended: d.isRecommended,
            order: d.order || 999,
            name: d.name[language] || d.name['az'],
            description: d.description[language] || "",
            ingredients: d.ingredients[language] || []
          };

          if (!loadedMenuData[catKey]) loadedMenuData[catKey] = [];
          loadedMenuData[catKey].push(item);
        });

        // Sıralama
        Object.keys(loadedMenuData).forEach(key => {
          loadedMenuData[key].sort((a, b) => a.order - b.order);
        });

        // 3. Banner
        if (bannerDoc.exists() && bannerDoc.data().image) {
           const b = bannerDoc.data();
           loadedSpecialItem = { id: 'banner', name: b.title, price: b.price, image: b.image, isCustom: true };
        } else {
           const allItems = Object.values(loadedMenuData).flat();
           loadedSpecialItem = allItems.find(i => i.isRecommended) || allItems[0];
        }

        setData({ categories: loadedCats, menuData: loadedMenuData, specialItem: loadedSpecialItem });

        if (loadedCats.length > 0) setSelectedCategory(loadedCats[0].key);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [language]);

  const handleSelectCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setSearchTerm('');
    const el = document.getElementById('menu-grid-start');
    if (el) {
       const y = el.getBoundingClientRect().top + window.pageYOffset - 140;
       mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // SKELET GÖSTƏRİLMƏSİ
  if (isLoading) return <MenuLoadingSkeleton />;
  
  if (data.categories.length === 0) return <div className="text-center p-10 text-white">Məlumat yoxdur.</div>;

  return (
    <section id="menu" className="pb-16 max-w-6xl mx-auto min-h-screen relative">
      
      <div className="pt-6 px-4">
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <MenuCategories
        categories={data.categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        mainContentRef={mainContentRef}
      />

      <div id="menu-grid-start" className="pt-6">
        {!searchTerm && data.specialItem && (
          <div className="mb-8">
            <SpecialsBanner 
              item={data.specialItem} 
              onClick={() => !data.specialItem.isCustom && onItemSelected(data.specialItem)} 
            />
          </div>
        )}

        <MenuGrid
          key={selectedCategory + searchTerm}
          menuData={data.menuData}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onItemSelected={onItemSelected}
        />
      </div>

      <button
        onClick={() => navigate('/fun')}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center animate-bounce hover:scale-110 transition border-2 border-white/20"
        style={{ animationDuration: '2s' }}
        aria-label="Oyun Zonası"
      >
        <Gamepad2 size={28} />
      </button>

    </section>
  );
}

export default Menu;