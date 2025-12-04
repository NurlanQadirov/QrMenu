import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc, getDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, LogOut, Edit, Image as ImageIcon, ArrowLeft, LayoutTemplate, Settings, Info, X } from 'lucide-react';

function Admin() {
  const navigate = useNavigate();
  
  const [view, setView] = useState('categories'); 
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings: Ünvan silindi
  const [settingsForm, setSettingsForm] = useState({
    logo: '',
    instagram: '',
    whatsapp: ''
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Banner State
  const [bannerForm, setBannerForm] = useState({ title: '', price: '', image: '' });
  const [bannerLoading, setBannerLoading] = useState(false);

  // Modallar
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('az');
  const [uploading, setUploading] = useState(false);

  const [prodForm, setProdForm] = useState({
    categoryId: '', price: '', prepTime: '5 min', image: '', isRecommended: false, order: 1,
    name: { az: '', en: '', ru: '' },
    description: { az: '', en: '', ru: '' },
    ingredients: { az: '', en: '', ru: '' }
  });
  const [catForm, setCatForm] = useState({ key: '', order: 1, name: { az: '', en: '', ru: '' } });

  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
      else {
        fetchData();
        fetchBanner();
        fetchSettings();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pSnap = await getDocs(collection(db, "menuItems"));
      const pList = pSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(pList.sort((a, b) => (a.order || 999) - (b.order || 999)));
      
      const cSnap = await getDocs(collection(db, "categories"));
      const cList = cSnap.docs.map(d => d.data());
      setCategories(cList.sort((a, b) => (a.order || 999) - (b.order || 999)));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchBanner = async () => {
    try {
      const docSnap = await getDoc(doc(db, "settings", "banner"));
      if (docSnap.exists()) setBannerForm(docSnap.data());
    } catch (error) { console.error("Banner error:", error); }
  };

  const fetchSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, "settings", "general"));
      if (docSnap.exists()) setSettingsForm(docSnap.data());
    } catch (error) { console.error("Settings error:", error); }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSettingsLoading(true);
    try {
      const storageRef = ref(storage, `logo/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setSettingsForm({ ...settingsForm, logo: url });
    } catch (error) { alert("Logo yükləmə xətası"); } finally { setSettingsLoading(false); }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      await setDoc(doc(db, "settings", "general"), settingsForm);
      alert("Tənzimləmələr yadda saxlanıldı!");
    } catch (error) { alert("Xəta: " + error.message); } finally { setSettingsLoading(false); }
  };

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerLoading(true);
    try {
      const storageRef = ref(storage, `banner/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setBannerForm({ ...bannerForm, image: url });
    } catch (error) { alert("Şəkil yükləmə xətası"); } finally { setBannerLoading(false); }
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `menu-images/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setProdForm({ ...prodForm, image: url });
    } catch (error) { alert("Xəta"); } finally { setUploading(false); }
  };

  const handleBannerUpload = async (e) => {
     // Banner linki inputu üçün helper (Artıq yuxarıda eynisini yazmışam, bu input `onChange` üçündür)
     const file = e.target.files[0];
     if (!file) return;
     setBannerLoading(true);
     try {
       const storageRef = ref(storage, `banner/${Date.now()}-${file.name}`);
       const snapshot = await uploadBytes(storageRef, file);
       const url = await getDownloadURL(snapshot.ref);
       setBannerForm({ ...bannerForm, image: url });
     } catch (error) { alert("Xəta"); } finally { setBannerLoading(false); }
  }

  const saveBanner = async (e) => {
    e.preventDefault();
    setBannerLoading(true);
    try {
      await setDoc(doc(db, "settings", "banner"), bannerForm);
      alert("Banner yeniləndi!");
    } catch (error) { alert("Xəta: " + error.message); } finally { setBannerLoading(false); }
  };

  // --- CRUD (Category & Product) ---
  const openCatModal = (cat = null) => {
    setEditingItem(cat);
    if (cat) {
      setCatForm({ key: cat.key, order: cat.order, name: cat.name });
    } else {
      const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order || 0)) + 1 : 1;
      setCatForm({ key: '', order: nextOrder, name: { az: '', en: '', ru: '' } });
    }
    setIsCatModalOpen(true);
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    let catKey = editingItem ? editingItem.key : catForm.key;
    if (!catKey) {
      if (!catForm.name.en) return alert("İngiliscə ad mütləqdir (Key üçün)!");
      catKey = catForm.name.en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    const orderNum = Number(catForm.order);
    try {
      await setDoc(doc(db, "categories", catKey), { ...catForm, key: catKey, order: orderNum });
      await fetchData();
      setIsCatModalOpen(false);
    } catch (err) { alert("Xəta: " + err.message); }
  };

  const deleteCategory = async (key) => {
    if (window.confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?")) {
      await deleteDoc(doc(db, "categories", key));
      setCategories(categories.filter(c => c.key !== key));
    }
  };

  const openProdModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setProdForm({
        ...item,
        ingredients: {
            az: Array.isArray(item.ingredients?.az) ? item.ingredients.az.join(', ') : item.ingredients?.az || '',
            en: Array.isArray(item.ingredients?.en) ? item.ingredients.en.join(', ') : item.ingredients?.en || '',
            ru: Array.isArray(item.ingredients?.ru) ? item.ingredients.ru.join(', ') : item.ingredients?.ru || '',
        }
      });
    } else {
      const catId = selectedCategory ? selectedCategory.key : (categories[0]?.key || '');
      const catProducts = products.filter(p => p.categoryId === catId);
      const nextOrder = catProducts.length > 0 ? Math.max(...catProducts.map(p => p.order || 0)) + 1 : 1;
      setProdForm({
        categoryId: catId, price: '', prepTime: '5 min', image: '', isRecommended: false, order: nextOrder,
        name: { az: '', en: '', ru: '' },
        description: { az: '', en: '', ru: '' },
        ingredients: { az: '', en: '', ru: '' }
      });
    }
    setIsProdModalOpen(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const processIng = (str) => str ? str.toString().split(',').map(s => s.trim()).filter(s => s) : [];
    const finalData = {
      ...prodForm,
      order: Number(prodForm.order),
      ingredients: {
        az: processIng(prodForm.ingredients.az),
        en: processIng(prodForm.ingredients.en),
        ru: processIng(prodForm.ingredients.ru),
      }
    };
    try {
      if (editingItem) await updateDoc(doc(db, "menuItems", editingItem.id), finalData);
      else await addDoc(collection(db, "menuItems"), finalData);
      await fetchData();
      setIsProdModalOpen(false);
    } catch (err) { alert("Xəta: " + err.message); }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Silmək istədiyinizə əminsiniz?")) {
      await deleteDoc(doc(db, "menuItems", id));
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen bg-premium-black flex items-center justify-center text-gold">Yüklənir...</div>;

  const visibleProducts = selectedCategory ? products.filter(p => p.categoryId === selectedCategory.key) : products; 

  return (
    <div className="min-h-screen bg-premium-black text-off-white pb-20">
      
      {/* HEADER */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-20 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-serif text-gold flex items-center gap-2">Admin Panel</h1>
          
          <div className="flex bg-black rounded-lg p-1 overflow-x-auto max-w-full">
            <button onClick={() => { setView('categories'); setSelectedCategory(null); }} className={`px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap ${view === 'categories' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}>Kateqoriyalar</button>
            <button onClick={() => { setView('allProducts'); setSelectedCategory(null); }} className={`px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition whitespace-nowrap ${view === 'allProducts' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}>Məhsullar</button>
            <button onClick={() => { setView('banner'); setSelectedCategory(null); }} className={`px-3 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${view === 'banner' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}><LayoutTemplate size={16}/> Banner</button>
            <button onClick={() => { setView('settings'); setSelectedCategory(null); }} className={`px-3 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${view === 'settings' ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}><Settings size={16}/> Tənzimləmələr</button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setIsInfoModalOpen(true)} className="bg-blue-900/30 text-blue-400 p-2 rounded-lg hover:bg-blue-900/50" title="Təlimatlar"><Info size={20}/></button>
            <button onClick={() => { signOut(auth); navigate('/login'); }} className="bg-red-900/30 text-red-400 p-2 rounded-lg hover:bg-red-900/50"><LogOut size={20}/></button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        
        {/* --- VIEW: CATEGORIES --- */}
        {view === 'categories' && !selectedCategory && (
           <div>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl text-white font-bold">Kateqoriyalar</h2>
                 <button onClick={() => openCatModal()} className="bg-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-500"><Plus size={20} /> Yeni</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                 {categories.map(cat => (
                    <div key={cat.key} onClick={() => { setSelectedCategory(cat); setView('products'); }} className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex justify-between items-center cursor-pointer hover:border-gold/50 hover:bg-gray-800 transition group">
                       <div className="flex items-center gap-4">
                          <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-gold font-bold text-sm">{cat.order}</span>
                          <h3 className="text-lg font-bold text-white">{cat.name.az}</h3>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                          <button onClick={() => openCatModal(cat)} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"><Edit size={18}/></button>
                          <button onClick={() => deleteCategory(cat.key)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"><Trash2 size={18}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: PRODUCTS --- */}
        {(selectedCategory || view === 'allProducts') && (
           <div>
              <div className="flex items-center gap-4 mb-6">
                 <button onClick={() => { setSelectedCategory(null); setView('categories'); }} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"><ArrowLeft /></button>
                 <h2 className="text-2xl text-white font-bold">{selectedCategory ? selectedCategory.name.az : "Bütün Məhsullar"}</h2>
                 <div className="ml-auto">
                    <button onClick={() => openProdModal()} className="bg-gold text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-500"><Plus size={20} /> Əlavə Et</button>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {visibleProducts.map(item => (
                    <div key={item.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex gap-4 group">
                       <div className="w-20 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon/></div>}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                             <h3 className="font-bold text-white truncate">{item.name.az}</h3>
                             <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">#{item.order}</span>
                          </div>
                          <p className="text-gold font-bold mt-1">{item.price}</p>
                          <div className="flex justify-end gap-2 mt-2">
                             <button onClick={() => openProdModal(item)} className="p-1.5 bg-blue-500/10 text-blue-400 rounded"><Edit size={16}/></button>
                             <button onClick={() => deleteProduct(item.id)} className="p-1.5 bg-red-500/10 text-red-400 rounded"><Trash2 size={16}/></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: BANNER --- */}
        {view === 'banner' && (
            <div className="max-w-2xl mx-auto">
               <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2"><LayoutTemplate/> Banner Tənzimləmələri</h2>
               <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-6">
                  <div className="w-full h-48 bg-black rounded-xl overflow-hidden relative border border-gray-700">
                     {bannerForm.image ? <img src={bannerForm.image} className="w-full h-full object-cover opacity-70" /> : <div className="w-full h-full flex items-center justify-center text-gray-600">Şəkil Yoxdur</div>}
                     <div className="absolute bottom-4 left-4"><h3 className="text-2xl font-serif font-bold text-white">{bannerForm.title}</h3><p className="text-gold font-bold">{bannerForm.price}</p></div>
                  </div>
                  <form onSubmit={saveBanner} className="space-y-4">
                     <input type="text" className="w-full bg-black border-gray-700 rounded-lg p-3 text-white" value={bannerForm.title} onChange={e=>setBannerForm({...bannerForm, title: e.target.value})} placeholder="Başlıq" />
                     <input type="text" className="w-full bg-black border-gray-700 rounded-lg p-3 text-white" value={bannerForm.price} onChange={e=>setBannerForm({...bannerForm, price: e.target.value})} placeholder="Qiymət" />
                     <div className="flex gap-2"><input type="file" className="text-gray-400 text-sm" onChange={handleBannerUpload} /><input type="text" placeholder="Link" className="flex-1 bg-black border-gray-700 rounded p-2 text-white" value={bannerForm.image} onChange={e=>setBannerForm({...bannerForm, image: e.target.value})} /></div>
                     <button type="submit" disabled={bannerLoading} className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 mt-4">{bannerLoading ? "..." : "Yadda Saxla"}</button>
                  </form>
               </div>
            </div>
        )}

        {/* --- VIEW: SETTINGS --- */}
        {view === 'settings' && (
            <div className="max-w-2xl mx-auto">
               <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2"><Settings/> Ümumi Tənzimləmələr</h2>
               <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-6">
                  
                  <form onSubmit={saveSettings} className="space-y-6">
                     
                     {/* Logo Upload */}
                     <div>
                        <label className="text-gold text-sm font-bold block mb-2">Restoran Logosu</label>
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-black rounded-full border border-gray-700 flex items-center justify-center overflow-hidden">
                              {settingsForm.logo ? <img src={settingsForm.logo} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600"/>}
                           </div>
                           <div className="flex-1">
                              <input type="file" className="text-gray-400 text-sm w-full mb-2" onChange={handleLogoUpload} />
                              <input type="text" placeholder="və ya Logo Linki" className="w-full bg-black border-gray-700 rounded p-2 text-white text-sm" value={settingsForm.logo} onChange={e=>setSettingsForm({...settingsForm, logo: e.target.value})} />
                           </div>
                        </div>
                     </div>

                     <hr className="border-gray-800"/>

                     {/* Footer Settings - ÜNVAN SİLİNDİ */}
                     <div>
                        <label className="text-gold text-sm font-bold block mb-2">Əlaqə & Sosial</label>
                        
                        <div className="space-y-3">
                           <div>
                              <p className="text-xs text-gray-400 mb-1">WhatsApp Nömrəsi (Format: 99450xxxxxxx)</p>
                              <input type="text" className="w-full bg-black border-gray-700 rounded-lg p-3 text-white" value={settingsForm.whatsapp} onChange={e=>setSettingsForm({...settingsForm, whatsapp: e.target.value})} placeholder="994551234567" />
                           </div>
                           
                           <div>
                              <p className="text-xs text-gray-400 mb-1">Instagram Linki</p>
                              <input type="text" className="w-full bg-black border-gray-700 rounded-lg p-3 text-white" value={settingsForm.instagram} onChange={e=>setSettingsForm({...settingsForm, instagram: e.target.value})} placeholder="https://instagram.com/..." />
                           </div>
                        </div>
                     </div>

                     <button type="submit" disabled={settingsLoading} className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 mt-4">
                        {settingsLoading ? "Yüklənir..." : "Tənzimləmələri Yadda Saxla"}
                     </button>
                  </form>
               </div>
            </div>
        )}

      </div>

      {/* --- INFO MODAL (GENİŞLƏNDİRİLMİŞ TƏLİMATLAR) --- */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
           <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gold/30 p-6 relative">
              <button onClick={() => setIsInfoModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X/></button>
              <h2 className="text-xl font-serif text-gold mb-4 flex items-center gap-2"><Info/> Təlimatlar</h2>
              <div className="text-off-white/80 space-y-4 text-sm overflow-y-auto max-h-[60vh]">
                 <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
                    <h3 className="text-white font-bold mb-1">1. Şəkillər haqqında</h3>
                    <p>Saytın sürətli işləməsi üçün şəkilləri <strong>.webp</strong> formatında yükləyin. Ən yaxşı görünüş üçün şəkillərin <strong>kvadrat (1:1)</strong> olması tövsiyə olunur (məsələn: 500x500 piksel).</p>
                 </div>
                 <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
                    <h3 className="text-white font-bold mb-1">2. "Məsləhətli" Məhsullar</h3>
                    <p>Əgər xüsusi "Banner" quraşdırmamısınızsa, menyu açılan kimi "Məsləhətli" (Recommended) seçdiyiniz məhsullardan biri yuxarıda böyük şəkildə görünəcək.</p>
                 </div>
                 <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
                    <h3 className="text-white font-bold mb-1">3. WhatsApp Nömrəsi</h3>
                    <p>Nömrəni yazarkən "+" işarəsi qoymayın. Format: <strong>994501234567</strong> kimi olmalıdır.</p>
                 </div>
                 <div className="bg-black/40 p-3 rounded-lg border border-gray-700">
                    <h3 className="text-white font-bold mb-1">4. Kateqoriya Sırası</h3>
                    <p>Kateqoriyaların yerini dəyişmək üçün "Sıra" (Order) rəqəmini dəyişin (1, 2, 3...). Kiçik rəqəm daha əvvəl gəlir.</p>
                 </div>
                 
                 <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                    <p className="text-gold font-bold">Texniki Dəstək:</p>
                    <p className="text-white text-lg">+994 55 123 45 67</p> {/* Öz nömrəni yaz */}
                    <p className="text-xs text-gray-500">(Nurlan)</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Digər modallar eyni qaldı (Category və Product) */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
           <div className="bg-gray-900 w-full max-w-md rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-serif text-gold mb-4">{editingItem ? 'Redaktə Et' : 'Yeni Kateqoriya'}</h2>
              <form onSubmit={saveCategory} className="space-y-4">
                 <div><label className="text-xs text-gray-400">Sıra</label><input type="number" className="w-full bg-black border-gray-700 rounded p-2 text-white" value={catForm.order} onChange={e=>setCatForm({...catForm, order: e.target.value})} /></div>
                 {['az','en','ru'].map(lang=>(<input key={lang} type="text" placeholder={`Ad (${lang.toUpperCase()})`} required={lang==='az'} className="w-full bg-black border-gray-700 rounded p-2 text-white" value={catForm.name[lang]} onChange={e=>setCatForm({...catForm, name:{...catForm.name, [lang]:e.target.value}})} />))}
                 <div className="flex gap-2 mt-4"><button type="button" onClick={()=>setIsCatModalOpen(false)} className="flex-1 bg-gray-800 text-white py-2 rounded">Ləğv</button><button type="submit" className="flex-1 bg-gold text-black py-2 rounded font-bold">Yadda Saxla</button></div>
              </form>
           </div>
        </div>
      )}

      {isProdModalOpen && (
         <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gray-900 w-full max-w-lg rounded-2xl border border-gray-700 p-6 my-8">
               <h2 className="text-xl font-serif text-gold mb-4">{editingItem ? 'Məhsulu Düzəlt' : 'Yeni Məhsul'}</h2>
               <form onSubmit={saveProduct} className="space-y-4">
                  <div className="flex gap-2 mb-2">{['az','en','ru'].map(l=>(<button key={l} type="button" onClick={()=>setActiveTab(l)} className={`flex-1 py-1 text-sm rounded ${activeTab===l?'bg-gold text-black':'bg-gray-800 text-gray-400'}`}>{l.toUpperCase()}</button>))}</div>
                  <input type="text" placeholder={`Ad (${activeTab})`} className="w-full bg-black border-gray-700 rounded p-2 text-white" value={prodForm.name[activeTab]} onChange={e=>setProdForm({...prodForm, name:{...prodForm.name, [activeTab]:e.target.value}})} />
                  <textarea rows={2} placeholder={`Təsvir (${activeTab})`} className="w-full bg-black border-gray-700 rounded p-2 text-white" value={prodForm.description[activeTab]} onChange={e=>setProdForm({...prodForm, description:{...prodForm.description, [activeTab]:e.target.value}})} />
                  <input type="text" placeholder={`Tərkib (${activeTab})`} className="w-full bg-black border-gray-700 rounded p-2 text-white" value={prodForm.ingredients[activeTab]} onChange={e=>setProdForm({...prodForm, ingredients:{...prodForm.ingredients, [activeTab]:e.target.value}})} />
                  <div className="grid grid-cols-2 gap-3">
                     <div><label className="text-xs text-gray-400">Kateqoriya</label><select className="w-full bg-black border-gray-700 rounded p-2 text-white" value={prodForm.categoryId} onChange={e=>setProdForm({...prodForm, categoryId:e.target.value})}>{categories.map(c=><option key={c.key} value={c.key}>{c.name.az}</option>)}</select></div>
                     <div><label className="text-xs text-gray-400">Qiymət</label><input type="text" className="w-full bg-black border-gray-700 rounded p-2 text-white" value={prodForm.price} onChange={e=>setProdForm({...prodForm, price:e.target.value})} /></div>
                     <div><label className="text-xs text-gray-400">Sıra</label><input type="number" className="w-full bg-black border-gray-700 rounded p-2 text-white" value={prodForm.order} onChange={e=>setProdForm({...prodForm, order:e.target.value})} /></div>
                     <div><label className="text-xs text-gray-400">Hazırlanma</label><input type="text" className="w-full bg-black border-gray-700 rounded p-2 text-white" value={prodForm.prepTime} onChange={e=>setProdForm({...prodForm, prepTime:e.target.value})} /></div>
                     <div className="flex items-center gap-2 mt-4 col-span-2">
                        <input type="checkbox" id="rec" checked={prodForm.isRecommended} onChange={e=>setProdForm({...prodForm, isRecommended: e.target.checked})} className="w-5 h-5 accent-gold" />
                        <label htmlFor="rec" className="text-sm text-white select-none cursor-pointer">Şefin Məsləhəti (Bannerdə görünə bilər)</label>
                     </div>
                  </div>
                  <div className="flex gap-3 items-center border border-gray-700 p-2 rounded bg-black/20">
                     {prodForm.image && <img src={prodForm.image} className="w-12 h-12 rounded object-cover"/>}
                     <div className="flex-1"><input type="file" className="text-xs text-gray-400" onChange={handleProductImageUpload} /><input type="text" placeholder="Link" className="w-full bg-transparent text-xs text-white border-b border-gray-700 mt-1 outline-none" value={prodForm.image} onChange={e=>setProdForm({...prodForm, image:e.target.value})} /></div>
                  </div>
                  {uploading && <p className="text-xs text-gold text-center">Yüklənir...</p>}
                  <div className="flex gap-2 mt-6"><button type="button" onClick={()=>setIsProdModalOpen(false)} className="flex-1 bg-gray-800 text-white py-3 rounded-lg">Ləğv</button><button type="submit" disabled={uploading} className="flex-1 bg-gold text-black py-3 rounded-lg font-bold">Yadda Saxla</button></div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}

export default Admin;