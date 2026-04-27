import { Suspense } from 'react';
import { useGameStore, CameraPosition } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { translations } from '../../translations';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Map as MapIcon, Signal, Wifi, Battery } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import Factory from '../game/Factory';
import Animatronics from '../game/Animatronics';
import Office from '../game/Office';

const CAMERAS: { id: CameraPosition; name: string; position: [number, number, number]; rotation: [number, number, number] }[] = [
  { id: 'ENTRANCE', name: 'CAM 01 - ENTRANCE', position: [0, 5, 20], rotation: [-0.3, 0, 0] },
  { id: 'AISLE_1', name: 'CAM 02 - AISLE 1', position: [-8, 6, -5], rotation: [-0.6, 0.8, 0] },
  { id: 'AISLE_2', name: 'CAM 03 - AISLE 2', position: [8, 6, -5], rotation: [-0.6, -0.8, 0] },
  { id: 'FRIDGES', name: 'CAM 04 - FRIDGES', position: [20, 6, -5], rotation: [-0.6, -1.2, 0] },
  { id: 'COUNTER', name: 'CAM 05 - COUNTER', position: [10, 6, 12], rotation: [-0.7, 0.5, 0] },
  { id: 'STORAGE', name: 'CAM 06 - STORAGE', position: [0, 6, -28], rotation: [-0.6, 0, 0] },
];

export default function Tablet() {
  const { isTabletOpen, setTabletOpen, currentCamera, setCamera, animatronics } = useGameStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  if (!isTabletOpen) return null;

  const currentCam = CAMERAS.find(c => c.id === currentCamera) || CAMERAS[0];

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="absolute inset-0 z-40 bg-zinc-950 flex flex-col pointer-events-auto p-4 md:p-8"
    >
      {/* Tablet Frame */}
      <div className="absolute inset-0 border-[16px] border-zinc-900 rounded-[2rem] pointer-events-none shadow-2xl overflow-hidden z-50">
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-[1.5rem]" />
      </div>
      
      {/* Viewport Content */}
      <div className="flex-1 flex overflow-hidden rounded-[1.2rem] bg-black relative border border-white/5">
        
        {/* Left Feed Area */}
        <div className="flex-1 relative bg-black overflow-hidden">
             
            {/* CRT & Noise Layers */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.04] bg-[url('https://media.giphy.com/media/oEI9uWUznW3Vm/giphy.gif')] mix-blend-screen" />
            <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
            <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentCamera}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                >
                    <Canvas shadows dpr={[1, 1.2]}>
                        <PerspectiveCamera 
                            makeDefault 
                            position={currentCam.position} 
                            rotation={currentCam.rotation} 
                            fov={65} 
                        />
                        <ambientLight intensity={0.05} />
                        <Suspense fallback={null}>
                            <Factory />
                            <Animatronics />
                            <Office />
                            <Environment preset="night" />
                        </Suspense>
                        <fog attach="fog" args={['#000', 5, 45]} />
                    </Canvas>
                </motion.div>
            </AnimatePresence>

            {/* Overlays */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-40">
                <div className="flex justify-between items-start">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4">
                        <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] italic font-black uppercase tracking-[0.2em] mb-1">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_red]" />
                            LIVE FEED [CH_0{CAMERAS.findIndex(c => c.id === currentCamera) + 1}]
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                            {currentCam.name}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-white/30 font-mono text-[10px]">
                        <div className="flex items-center gap-1"><Wifi size={12}/> 98%</div>
                        <div className="flex items-center gap-1"><Battery size={12}/> 88%</div>
                        <div className="bg-black/40 px-2 py-1 border border-white/5">{new Date().toLocaleTimeString()}</div>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <button 
                        onClick={() => setTabletOpen(false)}
                        className="bg-red-950/40 hover:bg-red-600 text-red-500 hover:text-white px-8 py-3 border border-red-500/20 rounded font-black uppercase text-[10px] tracking-widest pointer-events-auto transition-all"
                    >
                        [ DISCONNECT ]
                    </button>
                    <div className="text-[9px] text-white/20 font-black tracking-widest uppercase italic">
                        MIOJO SURVEILLANCE v3.1.2
                    </div>
                </div>
            </div>
        </div>

        {/* Right Map Area */}
        <div className="w-80 bg-zinc-950 border-l border-white/10 flex flex-col p-6 z-40">
            <div className="flex items-center gap-2 mb-4 opacity-50">
                <MapIcon size={14} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest">Store Topology</span>
            </div>

            <div className="relative flex-1 bg-black/40 border border-white/5 rounded-xl overflow-hidden p-4">
                <MapOverlay />
            </div>

            <div className="mt-6 flex flex-col gap-2">
                <div className="text-[10px] font-black text-white/20 uppercase mb-2">Device Status</div>
                <div className="bg-white/5 p-3 border border-white/10 rounded-lg flex justify-between items-center text-[10px] font-bold">
                    <span className="text-white/40">CPU TEMP</span>
                    <span className="text-orange-500">54°C</span>
                </div>
                <div className="bg-white/5 p-3 border border-white/10 rounded-lg flex justify-between items-center text-[10px] font-bold">
                    <span className="text-white/40">SIGNAL</span>
                    <span className="text-green-500 animate-pulse tracking-widest font-black italic">ULTRA STABLE</span>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

function MapOverlay() {
  return (
    <div className="w-full h-full relative">
        <svg viewBox="0 0 200 320" className="w-full h-full stroke-white/10 fill-none stroke-[2]">
            <path d="M 20 20 L 180 20 L 180 300 L 20 300 Z" />
            <rect x="50" y="80" width="20" height="120" className="stroke-white/5" />
            <rect x="130" y="80" width="20" height="120" className="stroke-white/5" />
            <path d="M 170 100 L 170 200" className="stroke-white/30 stroke-[4]" />
            <path d="M 60 260 L 140 260" className="stroke-white/10" />
            <path d="M 20 65 L 180 65" className="stroke-white/20" />
        </svg>

        {CAMERAS.map((cam) => (
            <CameraMapBtn 
                key={cam.id} 
                id={cam.id} 
                name={cam.name.split(' ')[2] || 'CAM'} 
                pos={getMapPos(cam.id)} 
            />
        ))}

        <div className="absolute top-[82%] left-[35%] text-[8px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">
            SECURITY OFFICE
        </div>
    </div>
  );
}

function getMapPos(id: CameraPosition): string {
    switch(id) {
        case 'STORAGE': return 'top-[8%] left-[45%]';
        case 'AISLE_1': return 'top-[30%] left-[20%]';
        case 'AISLE_2': return 'top-[30%] left-[60%]';
        case 'FRIDGES': return 'top-[45%] right-[5%]';
        case 'COUNTER': return 'bottom-[25%] left-[25%]';
        case 'ENTRANCE': return 'bottom-[12%] right-[15%]';
        default: return '';
    }
}

function CameraMapBtn({ id, name, pos }: { id: CameraPosition; name: string; pos: string }) {
  const { currentCamera, setCamera, animatronics } = useGameStore();
  const isActive = currentCamera === id;
  const hasAnimatronic = animatronics.some(a => a.location === id);

  return (
    <button
      onClick={() => setCamera(id)}
      className={`
        absolute ${pos} px-2 py-1 text-[9px] font-black transition-all border
        ${isActive 
          ? 'bg-white text-black border-white shadow-[0_0_15px_white] scale-110 z-20' 
          : 'bg-zinc-900/80 text-white/60 border-white/10 hover:border-white/40 hover:text-white z-10'}
        active:scale-95
      `}
    >
      <div className="flex items-center gap-1">
          {name}
          {hasAnimatronic && (
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
          )}
      </div>
    </button>
  );
}


