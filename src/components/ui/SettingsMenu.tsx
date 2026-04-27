import { motion, AnimatePresence } from 'motion/react';
import { useSettingsStore, Platform } from '../../store/useSettingsStore';
import { Language, translations } from '../../translations';
import { X, Globe, Sliders, Smartphone, Monitor, Save } from 'lucide-react';

export default function SettingsMenu() {
  const { 
    isSettingsOpen, 
    setSettingsOpen, 
    language, 
    setLanguage, 
    platform, 
    setPlatform,
    saveSettings 
  } = useSettingsStore();
  const t = translations[language];

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-2xl bg-zinc-950 border border-white/10 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button 
            onClick={() => setSettingsOpen(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 mb-8">
            <Sliders className="text-red-600" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                {t.settings}
            </h2>
          </div>

          <div className="space-y-8">
            {/* Platform Selection */}
            <section>
              <div className="flex items-center gap-2 mb-4 opacity-40">
                <Smartphone size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.platform}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <PlatformBtn 
                    current={platform} 
                    p="pc" 
                    label={t.pc} 
                    icon={<Monitor size={14} />} 
                    onClick={setPlatform} 
                />
                <PlatformBtn 
                    current={platform} 
                    p="mobile" 
                    label={t.mobile} 
                    icon={<Smartphone size={14} />} 
                    onClick={setPlatform} 
                />
              </div>
            </section>

            {/* PC Controls */}
            {platform === 'pc' && (
              <section>
                <div className="flex items-center gap-2 mb-4 opacity-40">
                  <Monitor size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.controls}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center bg-white/5 p-3 border border-white/10">
                    <span className="text-[10px] font-bold text-white/60 uppercase">{t.doorLeft}</span>
                    <span className="text-xs font-black text-red-500 font-mono">Q</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 border border-white/10">
                    <span className="text-[10px] font-bold text-white/60 uppercase">{t.doorRight}</span>
                    <span className="text-xs font-black text-red-500 font-mono">E</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 border border-white/10">
                    <span className="text-[10px] font-bold text-white/60 uppercase">{t.lightLeft}</span>
                    <span className="text-xs font-black text-red-500 font-mono">A</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-3 border border-white/10">
                    <span className="text-[10px] font-bold text-white/60 uppercase">{t.lightRight}</span>
                    <span className="text-xs font-black text-red-500 font-mono">D</span>
                  </div>
                </div>
              </section>
            )}

            {/* Language Selection */}
            <section>
              <div className="flex items-center gap-2 mb-4 opacity-40">
                <Globe size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.language}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <LangBtn current={language} lang="en" label="English" onClick={setLanguage} />
                <LangBtn current={language} lang="pt-BR" label="Português (BR)" onClick={setLanguage} />
                <LangBtn current={language} lang="pt-PT" label="Português (PT)" onClick={setLanguage} />
                <LangBtn current={language} lang="es-ES" label="Español (ES)" onClick={setLanguage} />
                <LangBtn current={language} lang="es-AR" label="Español (AR)" onClick={setLanguage} />
                <LangBtn current={language} lang="fr" label="Français" onClick={setLanguage} />
                <LangBtn current={language} lang="de" label="Deutsch" onClick={setLanguage} />
                <LangBtn current={language} lang="it" label="Italiano" onClick={setLanguage} />
                <LangBtn current={language} lang="ru" label="Русский" onClick={setLanguage} />
                <LangBtn current={language} lang="jp" label="日本語" onClick={setLanguage} />
                <LangBtn current={language} lang="zh" label="简体中文" onClick={setLanguage} />
                <LangBtn current={language} lang="ko" label="한국어" onClick={setLanguage} />
                <LangBtn current={language} lang="pl" label="Polski" onClick={setLanguage} />
                <LangBtn current={language} lang="tr" label="Türkçe" onClick={setLanguage} />
              </div>
            </section>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
             <button 
                onClick={() => {
                    saveSettings();
                    setSettingsOpen(false);
                }}
                className="px-8 py-3 bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
             >
                <Save size={18} />
                {t.save}
             </button>
             <button 
                onClick={() => setSettingsOpen(false)}
                className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest hover:bg-white/80 transition-all"
             >
                {t.back}
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function LangBtn({ current, lang, label, onClick }: { current: Language, lang: Language, label: string, onClick: (l: Language) => void }) {
  const isActive = current === lang;
  return (
    <button 
      onClick={() => onClick(lang)}
      className={`
        px-4 py-3 text-xs font-bold uppercase transition-all text-left border
        ${isActive 
            ? 'bg-red-600 border-red-600 text-white' 
            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}
      `}
    >
      {label}
    </button>
  );
}

function PlatformBtn({ current, p, label, icon, onClick }: { current: Platform, p: Platform, label: string, icon: React.ReactNode, onClick: (p: Platform) => void }) {
    const isActive = current === p;
    return (
      <button 
        onClick={() => onClick(p)}
        className={`
          flex items-center justify-center gap-3 px-4 py-4 text-xs font-black uppercase transition-all border
          ${isActive 
              ? 'bg-white text-black border-white' 
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}
        `}
      >
        {icon}
        {label}
      </button>
    );
}
