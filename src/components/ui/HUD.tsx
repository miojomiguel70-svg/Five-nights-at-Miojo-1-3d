import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { translations } from '../../translations';
import { motion, AnimatePresence } from 'motion/react';
import { Battery, Camera, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function HUD() {
  const { 
    energy, 
    time, 
    night, 
    isTabletOpen, 
    setTabletOpen, 
    leftDoorOpen, 
    rightDoorOpen, 
    leftLight, 
    rightLight,
    toggleLeftDoor,
    toggleRightDoor,
    toggleLeftLight,
    toggleRightLight
  } = useGameStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  const usage = 1 + (Number(!leftDoorOpen)) + (Number(!rightDoorOpen)) + (Number(leftLight)) + (Number(rightLight)) + (Number(isTabletOpen));

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* Top Left: Time Unit */}
      <div className="absolute top-8 left-8 flex flex-col p-4 bg-black/80 border border-white/10 backdrop-blur-sm min-w-48">
        <div className="flex justify-between items-center mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_red]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-mono tracking-tighter text-white">
            {time === 0 ? '12' : time}
          </span>
          <span className="text-xl font-bold font-mono text-white/60">{t.am}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-white/5 flex justify-end items-baseline">
            <span className="text-xs font-bold text-red-600 uppercase tracking-tighter italic">{t.night} {night}</span>
        </div>
      </div>

      {/* Bottom Left: Power Core */}
      <div className="absolute bottom-8 left-8 p-4 bg-black/80 border border-white/10 backdrop-blur-sm min-w-64">
        <div className="flex justify-between items-end mb-2">
            <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{t.power}</span>
                <span className={`text-4xl font-black font-mono leading-none ${energy < 20 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                    {Math.floor(energy)}%
                </span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[9px] text-white/30 uppercase tracking-tight mb-1">{t.usage}</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                        key={i} 
                        className={`w-3 h-5 ${i <= usage ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-white/5'}`} 
                        />
                    ))}
                </div>
            </div>
        </div>
        <div className="h-1 bg-white/5 w-full relative">
            <motion.div 
                className={`h-full absolute left-0 ${energy < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${energy}%` }}
            />
        </div>
      </div>

      {/* Door & Light Controls */}
      <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
        {/* Left Control Panel */}
        <div className="flex flex-col gap-6 p-2 bg-black/40 border border-white/5 backdrop-blur-xs pointer-events-auto">
          <SwitchButton 
            id="left-door-switch"
            label="WEST DOOR" 
            active={!leftDoorOpen} 
            onClick={toggleLeftDoor} 
            type="gate"
          />
          <SwitchButton 
            id="left-light-switch"
            label="WEST LIGHT" 
            active={leftLight} 
            onClick={toggleLeftLight} 
            type="light"
          />
        </div>

        {/* Right Control Panel */}
        <div className="flex flex-col gap-6 p-2 bg-black/40 border border-white/5 backdrop-blur-xs pointer-events-auto text-right">
          <SwitchButton 
            id="right-door-switch"
            label="EAST DOOR" 
            active={!rightDoorOpen} 
            onClick={toggleRightDoor} 
            type="gate"
            align="right"
          />
          <SwitchButton 
            id="right-light-switch"
            label="EAST LIGHT" 
            active={rightLight} 
            onClick={toggleRightLight} 
            type="light"
            align="right"
          />
        </div>
      </div>


      {/* Bottom Center: Monitor Deploy */}
      {!isTabletOpen && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-16 flex justify-center pointer-events-auto">
          <button 
            id="tablet-trigger"
            onMouseEnter={() => setTabletOpen(true)}
            onClick={() => setTabletOpen(true)}
            className="w-full bg-gradient-to-t from-white/10 to-transparent hover:from-white/20 transition-all border-t border-white/20 flex flex-col items-center justify-center group overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-1">
                <div className="w-12 h-[1px] bg-white/20 group-hover:w-20 transition-all" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 group-hover:text-white group-hover:tracking-[0.6em] transition-all">External Feed</span>
                <div className="w-12 h-[1px] bg-white/20 group-hover:w-20 transition-all" />
            </div>
            <div className="w-8 h-1 bg-white/40 group-hover:bg-red-500 rounded-full transition-colors" />
          </button>
        </div>
      )}

      {/* Immersive Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-radial-[circle_80%_at_50%_50%,transparent_30%,rgba(0,0,0,0.8)_100%]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-black h-full w-full">
          <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />
      </div>
    </div>
  );
}

function SwitchButton({ id, label, active, onClick, type, align = 'left' }: any) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`
        relative w-24 h-12 border transition-all flex flex-col items-center justify-center gap-1 group
        ${active 
            ? 'bg-zinc-800 border-white/40 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' 
            : 'bg-zinc-900/50 border-white/10 hover:border-white/30'}
      `}
    >
      <div className={`
        absolute top-0 w-full h-1 
        ${active 
            ? (type === 'gate' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-white shadow-[0_0_8px_white]') 
            : 'bg-transparent'}
      `} />
      <span className="text-[8px] font-black text-white/40 group-hover:text-white transition-colors tracking-tight italic">
        {label}
      </span>
      <div className={`
          text-[9px] font-bold uppercase tracking-widest
          ${active ? (type === 'gate' ? 'text-red-500' : 'text-white') : 'text-white/20'}
      `}>
          {active ? 'Active' : 'Offline'}
      </div>
    </button>
  );
}
