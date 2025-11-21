// src/uploadData.js
import { db } from "./firebase";
import { doc, writeBatch } from "firebase/firestore";
import azTranslations from "./i18n/az";
import enTranslations from "./i18n/en";
import ruTranslations from "./i18n/ru";

export const uploadMenuData = async () => {
  console.log("⏳ Yükləmə başladı... Zəhmət olmasa gözləyin.");
  const batch = writeBatch(db);

  // Statik fayllardan məlumatları götürürük
  const azCategories = azTranslations.menu.categories;
  const azMenuData = azTranslations.menu.menuData;
  
  const enCategories = enTranslations.menu.categories;
  const enMenuData = enTranslations.menu.menuData;
  
  const ruCategories = ruTranslations.menu.categories;
  const ruMenuData = ruTranslations.menu.menuData;

  // 1. KATEQORİYALARI YÜKLƏYİRİK
  azCategories.forEach((cat, index) => {
    const catKey = cat.key;
    
    // Digər dillərdəki qarşılığını tapırıq
    const nameEn = enCategories.find(c => c.key === catKey)?.name || cat.name;
    const nameRu = ruCategories.find(c => c.key === catKey)?.name || cat.name;

    const catRef = doc(db, "categories", catKey);
    batch.set(catRef, {
      key: catKey,
      name: {
        az: cat.name,
        en: nameEn,
        ru: nameRu
      },
      order: index // Sıralamaq üçün
    });
  });

  // 2. MƏHSULLARI YÜKLƏYİRİK
  Object.keys(azMenuData).forEach(catKey => {
    const items = azMenuData[catKey];
    
    items.forEach(item => {
      // Digər dillərdəki qarşılığını tapırıq
      const itemEn = enMenuData[catKey]?.find(i => i.id === item.id) || {};
      const itemRu = ruMenuData[catKey]?.find(i => i.id === item.id) || {};

      const itemRef = doc(db, "menuItems", item.id);
      
      // Şəkli bir az düzəldirik (varsa)
      let imageUrl = item.image;
      
      batch.set(itemRef, {
        categoryId: catKey,
        price: item.price,
        image: imageUrl,
        prepTime: item.prepTime || "5 min",
        isRecommended: item.isRecommended || false,
        name: {
          az: item.name,
          en: itemEn.name || item.name,
          ru: itemRu.name || item.name
        },
        description: {
          az: item.description || "",
          en: itemEn.description || "",
          ru: itemRu.description || ""
        },
        ingredients: {
          az: item.ingredients || [],
          en: itemEn.ingredients || [],
          ru: itemRu.ingredients || []
        }
      });
    });
  });

  try {
    await batch.commit();
    console.log("✅ BÜTÜN MƏLUMATLAR UĞURLA YÜKLƏNDİ! 🎉");
    alert("Təbriklər! Bütün menyu Firebase-ə yükləndi.");
  } catch (error) {
    console.error("❌ Xəta baş verdi:", error);
    alert("Xəta oldu: " + error.message);
  }
};