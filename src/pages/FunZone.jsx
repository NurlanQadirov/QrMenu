// src/pages/FunZone.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { ArrowLeft, Play, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9999', '#E0F2F1'];

function FunZone() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wheel'); 
  const [showConfetti, setShowConfetti] = useState(false);

  // --- OYUN 1: ŞANS ÇARXI ---
  const [currentName, setCurrentName] = useState('');
  const [names, setNames] = useState([]); 
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0); 

  const addName = (e) => {
    e.preventDefault();
    const trimmed = currentName.trim();
    if (trimmed && !names.includes(trimmed)) {
      setNames([...names, trimmed]);
      setCurrentName('');
    }
  };

  const removeName = (nameToRemove) => {
    setNames(names.filter(n => n !== nameToRemove));
  };

 const handleSpin = () => {
    if (names.length < 2) return alert("Ən azı 2 ad daxil edin!");

    setIsSpinning(true);
    setWinner(null);
    setShowConfetti(false);

    // 1. Təsadüfi bucaq (minimum 5 tam dövrə + təsadüfi hissə)
    const randomDegree = Math.floor(Math.random() * 360) + (360 * 5);
    
    // Yığılan rotasiya (çarx geriyə yox, həmişə irəli fırlansın)
    const newRotation = rotation + randomDegree;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      
      const sliceAngle = 360 / names.length;
      
      // DÜZƏLİŞ EDİLDİ:
      // Çarx saat əqrəbi (clockwise) fırlanır.
      // Ox yuxarıda (0 dərəcədə) sabitdir.
      // Biz tapmalıyıq ki, 0 dərəcəyə çarxın hansı hissəsi gəlib çatıb.
      // Düstur: (360 - (Fırlanma % 360)) % 360
      
      const normalizedRotation = newRotation % 360; // 0-360 arasına salırıq
      const pointerAngle = (360 - normalizedRotation) % 360; // Oxun altındakı bucağı tapırıq
      
      // Həmin bucağın hansı indeksə düşdüyünü hesablayırıq
      const winningIndex = Math.floor(pointerAngle / sliceAngle);
      
      // İndeksi array daxilində saxlayırıq (ehtiyat üçün)
      const finalIndex = winningIndex >= names.length ? 0 : winningIndex;

      setWinner(names[finalIndex]);
      setShowConfetti(true);
    }, 4000);
  };

  // --- OYUN 2: KARTLAR ---
  const [playerCount, setPlayerCount] = useState(4);
  const [cards, setCards] = useState([]);
  const [cardGameStatus, setCardGameStatus] = useState('setup'); 

  const startCardGame = () => {
    const newCards = Array(playerCount).fill(false);
    const loserIndex = Math.floor(Math.random() * playerCount);
    newCards[loserIndex] = true;
    setCards(newCards.map(isLoser => ({ isLoser, isFlipped: false })));
    setCardGameStatus('playing');
    setShowConfetti(false);
  };

  const flipCard = (index) => {
    if (cardGameStatus === 'finished' || cards[index].isFlipped) return;
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    if (newCards[index].isLoser) {
      setCardGameStatus('finished');
      if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
    }
  };

  return (
    <div className="min-h-screen bg-premium-black text-white p-4 pb-20 overflow-x-hidden">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-4">
        <button onClick={() => navigate('/')} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-serif text-gold">Oyun Zonası</h1>
      </div>

      {/* Tablar */}
      <div className="flex bg-gray-900 p-1 rounded-xl mb-8 max-w-md mx-auto">
        <button onClick={() => setActiveTab('wheel')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${activeTab === 'wheel' ? 'bg-gold text-black' : 'text-gray-400'}`}>
           Şans Çarxı
        </button>
        <button onClick={() => setActiveTab('cards')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${activeTab === 'cards' ? 'bg-gold text-black' : 'text-gray-400'}`}>
           Kartlar
        </button>
      </div>

      {/* ================= ÇARX OYUNU (SON VƏ ƏN DÜZGÜN VERSİYA) ================= */}
      {activeTab === 'wheel' && (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          
          <div className="relative w-72 h-72 mb-8">
            {/* Ox */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-white text-4xl drop-shadow-lg">
              ▼
            </div>
            
            {/* Dairə */}
            <div 
              className="w-full h-full rounded-full border-4 border-gray-700 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-transform duration-[4000ms] cubic-bezier(0.25, 0.1, 0.25, 1)"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                background: names.length > 0 
                  ? `conic-gradient(${names.map((_, i) => `${COLORS[i % COLORS.length]} ${(i / names.length) * 100}%, ${COLORS[i % COLORS.length]} ${((i + 1) / names.length) * 100}%`).join(', ')})`
                  : '#333'
              }}
            >
              {names.length > 0 && names.map((name, index) => {
                const anglePerSlice = 360 / names.length;
                const rotate = (index * anglePerSlice) + (anglePerSlice / 2);
                
                return (
                  <div 
                    key={index}
                    // origin-bottom: mərkəzdən fırlanır
                    className="absolute top-0 left-1/2 h-1/2 w-8 origin-bottom flex justify-center pt-4"
                    style={{ transform: `translateX(-50%) rotate(${rotate}deg)` }}
                  >
                    {/* YAZI HİSSƏSİ */}
                    <span 
                        className="text-black font-bold text-sm whitespace-nowrap block text-center" 
                        style={{ 
                           writingMode: 'vertical-rl', // Şaquli (Radius boyunca)
                           textOrientation: 'mixed',   // Hərflər yan durur (Oxunaqlı olması üçün)
                           transform: 'rotate(180deg)', // Mərkəzdən kənara doğru oxunsun
                           maxHeight: '110px',         // Çərçivədən çıxmasın (limit)
                           overflow: 'hidden',         // Artıq hissə gizlənsin
                           textOverflow: 'ellipsis'    // Sonda "..." qoyulsun
                        }}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
              
              {names.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Ad əlavə edin</div>}
            </div>
          </div>

          {winner ? (
            <div className="text-center mb-6 p-6 bg-gray-900 rounded-2xl border border-gold/30 animate-in fade-in zoom-in duration-300 w-full">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">HESABI ÖDƏYƏN ŞƏXS:</p>
              <h2 className="text-4xl font-serif font-bold text-gold animate-bounce">{winner}</h2>
              <button onClick={() => {setWinner(null); setShowConfetti(false)}} className="mt-6 px-6 py-3 bg-gray-800 rounded-xl text-sm font-bold hover:bg-gray-700 transition w-full">
                Yenidən Fırlat
              </button>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <div className="flex gap-2">
                <input type="text" value={currentName} onChange={(e) => setCurrentName(e.target.value)} placeholder="Ad yazın (Məs: Əli)" disabled={isSpinning} className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-3 pl-4 text-white focus:border-gold outline-none disabled:opacity-50" />
                <button onClick={addName} disabled={!currentName.trim() || isSpinning} className="bg-gray-800 text-gold border border-gray-700 px-4 rounded-xl font-bold hover:bg-gray-700 disabled:opacity-50"><Plus size={24} /></button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center min-h-[40px]">
                {names.map((name, idx) => (
                  <span key={idx} className="bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 animate-in zoom-in duration-200">
                    {name}
                    {!isSpinning && <button onClick={() => removeName(name)} className="text-red-400 hover:text-red-300"><X size={14} /></button>}
                  </span>
                ))}
              </div>
              {names.length >= 2 && (
                <button onClick={handleSpin} disabled={isSpinning} className="w-full bg-gold text-black font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSpinning ? "Fırlanır..." : <><Play size={20} fill="black"/> Fırlat!</>}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Kart Oyunu hissəsi eyni qalır */}
      {activeTab === 'cards' && (
        <div className="flex flex-col items-center">
          {cardGameStatus === 'setup' ? (
            <div className="w-full max-w-md text-center space-y-6 mt-10">
              <h3 className="text-xl text-white">Neçə nəfərsiz?</h3>
              <div className="flex justify-center items-center gap-6">
                <button onClick={() => setPlayerCount(Math.max(2, playerCount - 1))} className="w-12 h-12 bg-gray-800 rounded-full text-2xl flex items-center justify-center hover:bg-gray-700">-</button>
                <span className="text-5xl font-serif font-bold text-gold">{playerCount}</span>
                <button onClick={() => setPlayerCount(Math.min(10, playerCount + 1))} className="w-12 h-12 bg-gray-800 rounded-full text-2xl flex items-center justify-center hover:bg-gray-700">+</button>
              </div>
              <p className="text-gray-500 text-sm">Bir nəfər "hesab" kartını çəkəcək...</p>
              <button onClick={startCardGame} className="w-full bg-gold text-black font-bold py-4 rounded-xl mt-8 shadow-lg">Kartları Payla</button>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <div className="grid grid-cols-3 gap-3 px-2" style={{ perspective: '1000px' }}>
                {cards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotateY: card.isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => flipCard(index)}
                    className="aspect-[2/3] rounded-xl cursor-pointer relative"
                    style={{ transformStyle: 'preserve-3d' }} 
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gold/30 rounded-xl flex items-center justify-center shadow-xl" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="text-gold text-2xl font-serif">?</div>
                    </div>
                    <div className={`absolute inset-0 rounded-xl flex items-center justify-center shadow-xl border-2 ${card.isLoser ? 'bg-red-600 border-red-400' : 'bg-green-600 border-green-400'}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      {card.isLoser ? (
                        <div className="text-center text-white"><p className="text-3xl">💸</p><p className="text-xs font-bold mt-1">ÖDƏ!</p></div>
                      ) : (
                        <div className="text-center text-white"><p className="text-3xl">😎</p><p className="text-xs font-bold mt-1">SAFE</p></div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => setCardGameStatus('setup')} className="mt-8 mx-auto block text-gray-500 underline text-sm">Oyunu Bitir</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FunZone;