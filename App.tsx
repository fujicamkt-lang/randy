import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Gift, Music, VolumeX } from 'lucide-react';
import { generateGameAssets } from './services/geminiService';
import { AppStatus, BoxState, GameAssets } from './types';
import Snowfall from './components/Snowfall';
import GiftBox from './components/GiftBox';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.LOADING);
  const [assets, setAssets] = useState<GameAssets | null>(null);
  const [boxes, setBoxes] = useState<BoxState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const initialized = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  // List of consolation prizes
  const christmasItems = [
    { emoji: '🧸', label: '温暖小熊' },
    { emoji: '🧦', label: '圣诞袜' },
    { emoji: '🍪', label: '姜饼人' },
    { emoji: '🍬', label: '甜甜糖果' },
    { emoji: '🔔', label: '幸运铃铛' },
    { emoji: '🧣', label: '暖暖围巾' },
    { emoji: '🦌', label: '小麋鹿' },
    { emoji: '☃️', label: '小雪人' },
    { emoji: '🕯️', label: '许愿蜡烛' },
    { emoji: '🧤', label: '毛绒手套' },
  ];

  const generateBoxPositions = (count: number) => {
    // 3-4-3 Fixed Layout for 10 items
    // Center alignment
    
    const positions = [
      // Row 1 (Back) - 3 items
      { x: 35, y: 55, scale: 0.8 }, { x: 50, y: 55, scale: 0.8 }, { x: 65, y: 55, scale: 0.8 },
      // Row 2 (Middle) - 4 items
      { x: 28, y: 70, scale: 0.9 }, { x: 43, y: 70, scale: 0.9 }, { x: 57, y: 70, scale: 0.9 }, { x: 72, y: 70, scale: 0.9 },
      // Row 3 (Front) - 3 items
      { x: 35, y: 88, scale: 1.0 }, { x: 50, y: 88, scale: 1.0 }, { x: 65, y: 88, scale: 1.0 },
    ];

    // Ensure we only take what we need (though logic is hardcoded for 10)
    const layoutPositions = positions.slice(0, count);

    return layoutPositions.map((pos, i) => {
      const randomItem = christmasItems[Math.floor(Math.random() * christmasItems.length)];
      
      return {
        id: i,
        isOpen: false,
        isWinner: false, 
        contentEmoji: randomItem.emoji,
        contentLabel: randomItem.label,
        x: pos.x,
        y: pos.y,
        rotation: 0, // No random rotation initially for "neat" look
        scale: pos.scale,
        zIndex: Math.floor(pos.y * 10), // Proper layering
        delay: i * 0.1 // Staggered entrance
      };
    });
  };

  const initGame = async () => {
    try {
      setStatus(AppStatus.LOADING);
      setError(null);
      setShowSuccessModal(false);
      
      const newAssets = await generateGameAssets();
      setAssets(newAssets);

      const numBoxes = 10; 
      const winnerIndex = Math.floor(Math.random() * numBoxes);
      
      const newBoxes = generateBoxPositions(numBoxes).map(box => ({
        ...box,
        isWinner: box.id === winnerIndex
      }));
      
      // Sort by Z-Index so lower items (closer) render on top of higher items (further)
      newBoxes.sort((a, b) => a.zIndex - b.zIndex);

      setBoxes(newBoxes);
      setStatus(AppStatus.PLAYING);
    } catch (err) {
      // Safe error logging preventing circular JSON issues with Error objects
      console.error("Game Init Error:", err instanceof Error ? err.message : String(err));
      setError(err instanceof Error ? err.message : "无法生成游戏，请重试。");
      setStatus(AppStatus.ERROR);
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initGame();
    }
  }, []);

  const handleBoxClick = (id: number) => {
    if (status !== AppStatus.PLAYING) return;

    const box = boxes.find(b => b.id === id);
    if (box?.isOpen) return;

    // Play Sound Effect
    if (box?.isWinner) {
      if (winSoundRef.current) {
        winSoundRef.current.currentTime = 0;
        winSoundRef.current.play().catch(() => console.log("Win sound play failed"));
      }
    } else {
      if (popSoundRef.current) {
        popSoundRef.current.currentTime = 0;
        popSoundRef.current.play().catch(() => console.log("Pop sound play failed"));
      }
    }

    setBoxes(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, isOpen: true };
      }
      return b;
    }));

    if (box && box.isWinner) {
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 1200); 
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(() => {
            console.error("Audio play failed");
            setIsMusicPlaying(false);
          });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 text-slate-100 overflow-hidden font-sans select-none">
      <Snowfall />

      {/* Background Music */}
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        onError={() => console.error("Audio playback error")}
      >
        <source src="https://actions.google.com/sounds/v1/holidays/jingle_bells.ogg" type="audio/ogg" />
        <source src="https://ia800501.us.archive.org/5/items/WeWishYouAMerryChristmas_58/We%20wish%20you%20a%20merry%20Christmas.mp3" type="audio/mpeg" />
      </audio>

      {/* Sound Effects */}
      <audio ref={popSoundRef} preload="auto" src="https://cdn.pixabay.com/audio/2022/03/24/audio_7314777553.mp3" />
      <audio ref={winSoundRef} preload="auto" src="https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3" />

      {/* Music Toggle Button - Top Right */}
      <button 
        onClick={toggleMusic}
        className="absolute top-4 right-4 z-[70] p-3 bg-black/30 hover:bg-black/50 text-[#FFD700] rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg group pointer-events-auto"
        title={isMusicPlaying ? "关闭音乐" : "播放音乐"}
      >
        {isMusicPlaying ? (
          <Music className="w-6 h-6 animate-pulse" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </button>

      {/* Background Layer */}
      {assets?.background && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 transform scale-[1.05]"
          style={{ backgroundImage: `url(${assets.background})`, opacity: status === AppStatus.PLAYING ? 1 : 0 }}
        >
          {/* Subtle vignette to focus attention */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50"></div>
        </div>
      )}

      {/* UI Overlay (Header) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">
        
        <header className="pt-6 md:pt-10 text-center drop-shadow-xl animate-in slide-in-from-top duration-700 pointer-events-auto">
          <h1 className="font-christmas text-4xl md:text-6xl text-[#FFD700] mb-2 text-shadow-lg tracking-wider" style={{ textShadow: '2px 2px 0px #c62828, 4px 4px 5px rgba(0,0,0,0.5)' }}>
            找出你的圣诞礼物
          </h1>
          <div className="inline-block bg-black/30 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 mt-2">
            <p className="text-white/90 text-base md:text-xl font-medium tracking-wide">
               哪一个是晓天的圣诞礼物？
            </p>
          </div>
        </header>

        {/* Loading Screen */}
        {status === AppStatus.LOADING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a0b0b]/80 backdrop-blur-md z-50 pointer-events-auto">
            <div className="relative w-24 h-24 mb-6">
               <div className="absolute inset-0 animate-ping opacity-30 bg-red-500 rounded-full"></div>
               <Gift className="relative z-10 text-[#FFD700] w-full h-full animate-bounce" />
            </div>
            <p className="text-2xl font-christmas text-white animate-pulse">正在布置复古圣诞客厅...</p>
          </div>
        )}

        {/* Error Screen */}
        {status === AppStatus.ERROR && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/80">
            <div className="bg-[#fff1f0] p-8 rounded-2xl border-4 border-[#c62828] text-center max-w-sm shadow-2xl">
              <p className="text-[#c62828] mb-6 text-lg font-bold">{error}</p>
              <button
                onClick={initGame}
                className="px-8 py-3 bg-[#c62828] text-white rounded-full font-bold hover:bg-[#b71c1c] transition-colors shadow-lg"
              >
                再试一次
              </button>
            </div>
          </div>
        )}

        {/* The Gift Area */}
        {status === AppStatus.PLAYING && assets && (
          <div 
            className="absolute inset-0 pointer-events-auto"
            style={{ perspective: '1200px' }} // Adjusted perspective for 45 deg feel
          >
             {boxes.map((box) => (
               <GiftBox
                 key={box.id}
                 {...box}
                 prizeImage={assets.prize}
                 onClick={handleBoxClick}
               />
             ))}
             
             {/* Reset Button */}
             <div className="absolute bottom-6 right-6 z-[60]">
                <button 
                  onClick={initGame}
                  className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md border border-white/30 transition-all hover:scale-110 shadow-lg group"
                  title="重新布置"
                >
                  <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && assets && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          ></div>
          
          <div className="relative bg-[#FFF8E1] text-slate-900 p-8 rounded-[2rem] shadow-[0_0_0_8px_rgba(255,255,255,0.3),0_20px_50px_rgba(0,0,0,0.5)] max-w-sm w-full text-center animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border-4 border-[#c62828]">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <div className="relative">
                   <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                   <div className="relative bg-gradient-to-br from-[#d32f2f] to-[#b71c1c] text-white w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-2xl ring-4 ring-[#FFF8E1] animate-[bounce_2s_infinite]">
                      🎁
                   </div>
                </div>
             </div>

             <div className="mt-10">
                <h2 className="text-3xl font-extrabold text-[#c62828] mb-2 font-christmas tracking-widest uppercase" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>Surprise!</h2>
                
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 shadow-inner ring-4 ring-[#FFD700]/30 relative group bg-white/50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,215,0,0.2)_0%,transparent_70%)] animate-pulse"></div>
                    <img src={assets.prize} alt="Prize" className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110 drop-shadow-xl" />
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-[#5D4037] text-xs font-bold uppercase tracking-[0.2em] opacity-70">Merry Christmas</p>
                  <p className="text-xl font-bold text-[#3E2723] leading-relaxed">
                    你找到了<span className="text-[#c62828] text-2xl mx-1 font-christmas">城城</span>准备的<br/>
                    <span className="text-[#1976D2] text-2xl drop-shadow-sm font-christmas">雪吻巧克力</span>
                  </p>
                </div>

                <button 
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full py-4 bg-gradient-to-r from-[#d32f2f] to-[#c62828] text-[#FFF8E1] rounded-xl font-bold text-lg shadow-[0_4px_0_#b71c1c] hover:shadow-[0_2px_0_#b71c1c] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
                >
                    ❤️ 收下这份心意
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;