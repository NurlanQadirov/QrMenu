// src/components/Menu.jsx (YENİLƏNMİŞ BANNER MƏNTİQİ İLƏ)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Gamepad2 } from 'lucide-react'; 
import { useLanguage } from '../context/LanguageContext';
import MenuCategories from './MenuCategories';
import SpecialsBanner from './SpecialsBanner';
import MenuGrid from './MenuGrid';
import Searchbar from './Searchbar';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore'; // <-- getDoc, doc əlavə olundu

function MenuLoadingSkeleton() {
  // ... (bu hissə eynidir, toxunmayaq)
  return <div className="p-4 max-w-6xl mx-auto animate-pulse text-white">Yüklənir...</div>;
}

function Menu({ onItemSelected, mainContentRef }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [menuData, setMenuData] = useState({});
  const [specialItem, setSpecialItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Kateqoriyalar
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

        // 2. Məhsullar
        const itemsRef = collection(db, "menuItems");
        const itemsSnapshot = await getDocs(itemsRef);
        
        const loadedMenuData = {};
        itemsSnapshot.forEach((doc) => {
          const data = doc.data();
          const catKey = data.categoryId;
          const formattedItem = {
            id: doc.id,
            price: data.price,
            image: data.image,
            prepTime: data.prepTime,
            isRecommended: data.isRecommended,
            order: data.order || 999, // Sıra
            name: data.name[language] || data.name['az'],
            description: data.description[language] || "",
            ingredients: data.ingredients[language] || []
          };

          if (!loadedMenuData[catKey]) loadedMenuData[catKey] = [];
          loadedMenuData[catKey].push(formattedItem);
        });

        // Məhsulları sıraya görə düzmək
        Object.keys(loadedMenuData).forEach(key => {
          loadedMenuData[key].sort((a, b) => a.order - b.order);
        });

        setMenuData(loadedMenuData);

        // 3. BANNER (YENİ MƏNTİQ)
        // Əvvəlcə "settings/banner" sənədini yoxlayırıq
        const bannerDoc = await getDoc(doc(db, "settings", "banner"));
        if (bannerDoc.exists()) {
           const bData = bannerDoc.data();
           // Əgər banner şəkli varsa, onu istifadə et
           if (bData.image) {
               setSpecialItem({
                   id: 'banner',
                   name: bData.title,
                   price: bData.price,
                   image: bData.image,
                   isCustom: true // Xüsusi bayraq
               });
           }
        } else {
           // Banner yoxdursa, köhnə qaydada "isRecommended" olanı götür
           const allItems = Object.values(loadedMenuData).flat();
           const recommendedItem = allItems.find(item => item.isRecommended) || allItems[0];
           setSpecialItem(recommendedItem);
        }

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
      
      <div className="pt-6 px-4">
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <MenuCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        mainContentRef={mainContentRef}
      />

      <div id="menu-grid-start" className="pt-6">
        {!searchTerm && specialItem && (
          <div className="mb-8">
            <SpecialsBanner 
              item={specialItem} 
              // Əgər custom bannerdirsə, klikləyəndə heç nə etmə (və ya gələcəkdə link qoyarıq)
              onClick={() => !specialItem.isCustom && onItemSelected(specialItem)} 
            />
          </div>
        )}

        <MenuGrid
          key={selectedCategory + searchTerm}
          menuData={menuData}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          onItemSelected={onItemSelected}
        />
      </div>

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