import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { translations } from '../../translations';
import { Play, Settings, X, Ghost } from 'lucide-react';

export default function MainMenu() {
  const { startNight, setGameState, night, loadGame } = useGameStore();
  const { language, setSettingsOpen } = useSettingsStore();

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const t = translations[language];

  return (
    <div className="absolute inset-0 bg-black flex flex-col p-12 md:p-24 z-50 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-zinc-900 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent)] animate-pulse" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0" />
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 flex flex-col h-full justify-between"
      >
        {/* Massive Typographic Hero */}
        <div>
            <h1 className="text-7xl md:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase italic mb-2">
                {t.title.split(' ')[0]} {t.title.split(' ')[1]}<br />
                {t.title.split(' ').slice(2).join(' ')}
            </h1>
        </div>

        {/* Action List */}
        <div className="flex flex-col gap-2 max-w-xs md:max-w-md">
            {night > 1 && (
                <MenuAction 
                    label={t.continue} 
                    sub={`${t.initShiftSub} 0${night}`} 
                    onClick={() => startNight(night)} 
                />
            )}
            <MenuAction 
                label={t.initShift} 
                sub={`${t.initShiftSub} 01`} 
                onClick={() => startNight(1)} 
            />
            <MenuAction 
                label={t.inspection} 
                sub={t.inspectionSub} 
                onClick={() => setGameState('EXPLORATION')} 
                disabled={true}
                warning={t.devWarning}
            />
            <MenuAction 
                label={t.config} 
                sub={t.configSub} 
                onClick={() => setSettingsOpen(true)} 
            />
        </div>

        {/* Footer Credit */}
        <div className="flex justify-end border-t border-white/10 pt-8 mt-12 bg-black/40 backdrop-blur-sm -mx-12 px-12 -mb-12 pb-12">
            <p className="text-[10px] text-white/10 font-mono">FIVE NIGHTS AT MIOJO</p>
        </div>
      </motion.div>

      {/* Post FX Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-screen bg-white [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    </div>
  );
}


function MenuAction({ label, sub, onClick, disabled, warning }: any) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`
                group flex flex-col items-start p-4 border-l-2 transition-all text-left w-full relative
                ${disabled 
                    ? 'border-white/10 opacity-60 cursor-not-allowed' 
                    : 'border-white/20 hover:border-red-600 hover:bg-white/5'}
            `}
        >
            <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black uppercase tracking-tight text-white group-hover:text-red-500 transition-colors">
                    {label}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold group-hover:text-white/60 transition-colors">
                    {sub}
                </span>
            </div>
            
            {disabled && warning && (
                <div className="absolute top-1/2 -translate-y-1/2 right-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 px-2 py-1 border border-red-600/50 bg-red-600/10">
                        {warning}
                    </span>
                </div>
            )}
        </button>
    );
}

// Fixed duplicate import removed
