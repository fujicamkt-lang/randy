import React, { useMemo } from 'react';

interface GiftBoxProps {
  id: number;
  isOpen: boolean;
  isWinner: boolean;
  contentEmoji: string;
  contentLabel: string;
  prizeImage: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  delay: number;
  onClick: (id: number) => void;
}

const GiftBox: React.FC<GiftBoxProps> = ({ 
  id, isOpen, isWinner, prizeImage, contentEmoji, contentLabel, onClick, 
  x, y, rotation, scale, zIndex, delay 
}) => {
  
  // Designs: Colors and patterns
  const designs = [
    { 
      id: 'v-red',
      bgBase: 'bg-[#D32F2F]', 
      bgPattern: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,248,225,0.15) 6px, rgba(255,248,225,0.15) 10px)',
      lidBase: 'bg-[#E53935]',
      ribbon: 'bg-[#FFECB3]', 
      ribbonBorder: 'border-[#FFD54F]',
      tagColor: 'bg-[#FFF9C4]'
    },
    { 
      id: 'v-green',
      bgBase: 'bg-[#2E7D32]',
      bgPattern: 'radial-gradient(circle, rgba(255,255,255,0.2) 1.5px, transparent 2px)',
      bgSize: '12px 12px',
      lidBase: 'bg-[#388E3C]',
      ribbon: 'bg-[#FFCDD2]', 
      ribbonBorder: 'border-[#EF9A9A]',
      tagColor: 'bg-white'
    },
    { 
      id: 'v-blue',
      bgBase: 'bg-[#1565C0]',
      bgPattern: 'linear-gradient(90deg, rgba(255,255,255,0.05) 50%, transparent 50%), linear-gradient(0deg, rgba(255,255,255,0.05) 50%, transparent 50%)',
      bgSize: '16px 16px',
      lidBase: 'bg-[#1976D2]',
      ribbon: 'bg-[#E3F2FD]', 
      ribbonBorder: 'border-[#BBDEFB]',
      tagColor: 'bg-[#E3F2FD]'
    },
    { 
      id: 'v-yellow',
      bgBase: 'bg-[#F9A825]',
      bgPattern: 'radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2.5px)',
      bgSize: '8px 8px',
      lidBase: 'bg-[#FBC02D]',
      ribbon: 'bg-[#4E342E]', 
      ribbonBorder: 'border-[#3E2723]',
      tagColor: 'bg-white'
    },
  ];
  
  const design = designs[id % designs.length];

  // SHAPE LOGIC
  const shapeType = id % 3;
  
  let boxDimensions = "w-12 h-12 sm:w-16 sm:h-16"; 
  let lidHeight = "h-[25%]";
  let ribbonWidth = "w-3 sm:w-4";
  let contentOffset = "-mt-6";

  if (shapeType === 1) { // Tall Box
    boxDimensions = "w-10 h-16 sm:w-12 sm:h-24";
    lidHeight = "h-[20%]";
    contentOffset = "-mt-8";
  } else if (shapeType === 2) { // Flat Box
    boxDimensions = "w-16 h-9 sm:w-24 sm:h-12";
    lidHeight = "h-[30%]";
    contentOffset = "-mt-2";
  }

  // Generate particles for explosion effect
  const particles = useMemo(() => {
    const colors = ['#FFD700', '#FF5252', '#69F0AE', '#40C4FF', '#FFFFFF', '#FFAB91'];
    const particleCount = isWinner ? 30 : 15;
    
    return Array.from({ length: particleCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      return {
        id: i,
        tx,
        ty,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        delay: Math.random() * 0.1,
        duration: 0.6 + Math.random() * 0.4
      };
    });
  }, [isWinner]);

  return (
    <div 
      className={`absolute transition-all duration-500 ease-out`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -100%) rotate(${rotation}deg) scale(${isOpen ? 1.2 : scale})`,
        zIndex: isOpen ? 100 : zIndex,
        opacity: 0,
        animation: `cartoonPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
        transformOrigin: 'bottom center',
      }}
    >
      <style>{`
        @keyframes cartoonPopIn {
          from { opacity: 0; transform: translate(-50%, -80%) rotate(${rotation}deg) scale(0); }
          to { opacity: 1; transform: translate(-50%, -100%) rotate(${rotation}deg) scale(${scale}); }
        }
        @keyframes lidFlyOff {
          0% { transform: translateY(0) rotate(0); }
          20% { transform: translateY(-30px) rotate(-15deg); }
          100% { transform: translateY(-120px) translateX(60px) rotate(120deg) scale(0.9); opacity: 0; }
        }
        @keyframes itemPop {
          0% { transform: translateY(20px) scale(0); opacity: 0; }
          50% { transform: translateY(-35px) scale(1.3); opacity: 1; }
          75% { transform: translateY(-20px) scale(0.9); opacity: 1; }
          100% { transform: translateY(-25px) scale(1.0); opacity: 1; }
        }
        @keyframes particleExplosion {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          60% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        /* Glossy shine animation */
        @keyframes stickerShine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
        .sticker-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
          animation: stickerShine 3s infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Box Container with Variable Dimensions */}
      <div 
        className={`relative cursor-pointer group ${boxDimensions}`}
        onClick={() => !isOpen && onClick(id)}
      >
        
        {/* === SHADOW === */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[95%] h-2 bg-black/40 rounded-[100%] blur-[2px] transition-all duration-300"
          style={{ 
             opacity: isOpen ? 0.2 : 0.6,
             transform: isOpen ? 'scale(0.8)' : 'scale(1)' 
          }}
        ></div>

        {/* === PARTICLES === */}
        {isOpen && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full shadow-sm"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  '--tx': `${p.tx}px`,
                  '--ty': `${p.ty}px`,
                  animation: `particleExplosion ${p.duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* === PRIZE / CONTENT === */}
        {isOpen && (
           <div 
             className="absolute inset-0 flex items-center justify-center pointer-events-none"
             style={{ animation: 'itemPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
           >
             {isWinner ? (
                // Winner Prize: Sticker Effect for Image
                <div className={`relative w-[200%] h-[200%] ${contentOffset} z-20`}>
                  <div className="relative w-full h-full">
                     <img 
                        src={prizeImage} 
                        alt="Prize" 
                        className="w-full h-full object-contain"
                        style={{
                           // Create white outline sticker effect
                           filter: 'drop-shadow(0px 0px 2px #fff) drop-shadow(0px 0px 2px #fff) drop-shadow(0px 0px 2px #fff) drop-shadow(2px 2px 5px rgba(0,0,0,0.3))'
                        }}
                     />
                     {/* Gloss Shine Overlay */}
                     <div className="absolute inset-0 overflow-hidden rounded-lg opacity-30 mix-blend-overlay">
                         <div className="sticker-shine"></div>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 text-xl animate-spin-slow">✨</div>
                </div>
             ) : (
                // Non-Winner: Sticker Effect for Emoji
                <div className="relative flex flex-col items-center justify-center z-10 transform -rotate-6">
                    <div className="relative inline-block">
                      {/* Sticker Outline & Shadow Effect */}
                      <span className="text-6xl sm:text-7xl block relative z-10" 
                            style={{ 
                              textShadow: `
                                3px 3px 0 #fff, -3px -3px 0 #fff, 
                                3px -3px 0 #fff, -3px 3px 0 #fff,
                                3px 0px 0 #fff, -3px 0px 0 #fff,
                                0px 3px 0 #fff, 0px -3px 0 #fff
                              `,
                              filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))'
                            }}>
                        {contentEmoji}
                      </span>
                      {/* Subtle Gloss Shine for Emoji */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-40 z-20">
                         <div className="sticker-shine"></div>
                      </div>
                    </div>
                    
                    {/* Floating Label */}
                    <div className="mt-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-white/60 transform hover:scale-105 transition-transform z-20">
                      <span className="text-[10px] font-extrabold text-[#5D4037] leading-none block uppercase tracking-wide">{contentLabel}</span>
                    </div>
                </div>
             )}
           </div>
        )}

        {/* === BOX BODY & LID === */}
        <div 
          className="relative w-full h-full transition-transform duration-300"
          style={{ 
            opacity: isOpen ? 0 : 1,
            pointerEvents: isOpen ? 'none' : 'auto',
          }}
        >
          {/* Hover Shake Container (Only shakes when closed) */}
          <div className="w-full h-full group-hover:animate-[shake_0.4s_ease-in-out_infinite] origin-bottom">
            
            {/* Box Body */}
            <div className={`absolute bottom-0 w-full h-[85%] ${design.bgBase} rounded-sm border border-black/20 overflow-hidden shadow-inner`}>
               <div className="absolute inset-0" style={{ backgroundImage: design.bgPattern, backgroundSize: design.bgSize || 'auto' }}></div>
               <div className={`absolute left-1/2 -translate-x-1/2 ${ribbonWidth} h-full ${design.ribbon} border-x ${design.ribbonBorder} shadow-sm`}></div>
               <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-black/10 to-transparent"></div>
            </div>

            {/* Box Lid */}
            <div 
              className={`absolute top-0 w-[108%] -left-[4%] ${lidHeight} ${design.lidBase} rounded-sm z-10 flex items-center justify-center border border-black/20 shadow-[0_1px_2px_rgba(0,0,0,0.2)]`}
              style={{ 
                 animation: isOpen ? 'lidFlyOff 0.7s cubic-bezier(0.5, 0, 0.75, 0) forwards' : 'none',
              }}
            >
               <div className="absolute inset-0 rounded-sm overflow-hidden opacity-90" style={{ backgroundImage: design.bgPattern, backgroundSize: design.bgSize || 'auto' }}></div>
               <div className="absolute top-[1px] left-[1px] right-[1px] h-[30%] bg-white/20 rounded-t-sm"></div>

               {/* Ribbons */}
               <div className={`absolute ${ribbonWidth} h-full ${design.ribbon} border-x ${design.ribbonBorder}`}></div>
               <div className={`absolute h-full w-full flex items-center justify-center`}>
                  <div className={`w-full ${ribbonWidth} ${design.ribbon} border-y ${design.ribbonBorder}`}></div>
               </div>
               
               {/* Bow (Scaled down) */}
               <div className="absolute -top-3 sm:-top-4 w-full flex justify-center items-end h-6">
                   <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-[3px] ${design.ribbon.replace('bg-', 'border-')} border-b-transparent transform -rotate-45 translate-x-0.5 shadow-sm`}></div>
                   <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-[3px] ${design.ribbon.replace('bg-', 'border-')} border-b-transparent transform rotate-45 -translate-x-0.5 shadow-sm`}></div>
                   <div className={`absolute bottom-0.5 w-2 h-1.5 sm:w-2.5 sm:h-2 ${design.ribbon} rounded-sm border ${design.ribbonBorder} z-20`}></div>
               </div>

               {/* Tag */}
               <div className={`absolute -right-1 top-4 w-3 h-4 ${design.tagColor} border border-black/10 shadow-sm flex items-center justify-center transform rotate-6 origin-top-left`}>
                  <div className="w-1 h-1 bg-black/20 rounded-full mb-auto mt-0.5"></div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GiftBox;