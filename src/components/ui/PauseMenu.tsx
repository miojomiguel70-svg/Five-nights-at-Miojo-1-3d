import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { translations } from '../../translations';

export default function PauseMenu() {
  const { isPaused, setPaused, resetGame } = useGameStore();
  const { language } = useSettingsStore();
  const t = translations[language];

  if (!isPaused) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
        >
            {/* Scanned Background Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%]" />
            </div>

            <div className="relative z-10 text-center">
                <h2 className="text-zinc-500 text-xs uppercase tracking-[0.4em] mb-2">System Paused</h2>
                <h3 className="text-white text-3xl font-black uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">
                    {t.settings}
                </h3>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setPaused(false)}
                        className="w-full py-4 bg-zinc-800 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest font-bold text-sm border border-zinc-700 hover:border-white"
                    >
                        {t.resume}
                    </button>

                    <button
                        onClick={() => {
                            setPaused(false);
                            resetGame();
                        }}
                        className="w-full py-4 bg-transparent border border-zinc-800 hover:border-red-600 hover:text-red-500 transition-all duration-300 uppercase tracking-widest font-bold text-sm"
                    >
                        {t.quit}
                    </button>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center opacity-40">
                    <span className="text-[10px] font-mono">[ PROTOCOL: SUSPENDED ]</span>
                    <span className="text-[10px] font-mono">ID: 0x4F2A</span>
                </div>
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
