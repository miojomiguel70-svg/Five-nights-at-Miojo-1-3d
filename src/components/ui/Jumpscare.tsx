import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, Suspense } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { translations } from '../../translations';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import Animatronics from '../game/Animatronics';

export default function Jumpscare({ id }: { id: string }) {
  const [showButton, setShowButton] = useState(false);
  const { resetGame, animatronics } = useGameStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowButton(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
    >
      {/* 3D Jumpscare Feed */}
      <div className="absolute inset-0 z-[101]">
          <Canvas shadows dpr={[1, 1.5]}>
              <PerspectiveCamera makeDefault position={[0, 1.2, 1.2]} fov={85} />
              <ambientLight intensity={0.02} />
              <pointLight position={[0, 1.5, 1]} intensity={2} color="red" />
              
              <Suspense fallback={null}>
                  <group scale={1.5} position={[0, 1, 0]}>
                      {/* Force show the specific animatronic even if visibility logic would hide it */}
                      <Animatronics forceVisibleId={id} />
                  </group>
                  <Environment preset="night" />
              </Suspense>

              <fog attach="fog" args={['#000', 1, 5]} />
          </Canvas>
      </div>

      {/* Extreme Intensity Overlays */}
      <div className="absolute inset-0 z-[105] pointer-events-none">
          {/* Static/Noise */}
          <div className="absolute inset-0 opacity-[0.15] bg-[url('https://media.giphy.com/media/oEI9uWUznW3Vm/giphy.gif')] mix-blend-screen mix-scanlines" />
          
          {/* Red Flash */}
          <motion.div 
            animate={{ opacity: [0, 0.4, 0, 0.6, 0] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="absolute inset-0 bg-red-600 mix-blend-overlay"
          />

          {/* Shaking Container for UI */}
          <div className="absolute inset-0 jumpscare-shake flex flex-col items-center justify-center">
              <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-[0.5em] drop-shadow-[0_0_80px_red] animate-pulse">
                  SYSTEM FAILURE
              </h2>
              <div className="text-white/20 font-mono text-sm mt-4 uppercase tracking-[0.8em]">
                   Fatal Entity Breach: {id}
              </div>
          </div>
      </div>

      <AnimatePresence>
        {showButton && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-16 z-[110] outline outline-4 outline-white/20"
            >
                <button 
                    onClick={resetGame}
                    className="px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] italic hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                >
                    [ {t.menu} ]
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0% { transform: translate(2px, 2px) rotate(0deg); }
          10% { transform: translate(-3px, -5px) rotate(-1deg); }
          20% { transform: translate(-7px, 0px) rotate(3deg); }
          30% { transform: translate(7px, 5px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 5px) rotate(-2deg); }
          60% { transform: translate(-7px, 1px) rotate(0deg); }
          70% { transform: translate(7px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(3deg); }
          90% { transform: translate(1px, 5px) rotate(0deg); }
          100% { transform: translate(1px, -5px) rotate(-1deg); }
        }
        .jumpscare-shake {
          animation: shake 0.1s infinite;
        }
        .mix-scanlines {
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 0, 0.05), rgba(0, 0, 255, 0.1));
            background-size: 100% 4px, 6px 100%;
        }
      `}} />
    </motion.div>
  );
}
