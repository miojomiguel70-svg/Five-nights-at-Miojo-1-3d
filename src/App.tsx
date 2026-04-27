/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { useSettingsStore } from './store/useSettingsStore';
import { translations } from './translations';
import MainMenu from './components/ui/MainMenu';
import HUD from './components/ui/HUD';
import Tablet from './components/ui/Tablet';
import GameScene from './components/game/GameScene';
import ExplorationMode from './components/game/ExplorationMode';
import Jumpscare from './components/ui/Jumpscare';
import SettingsMenu from './components/ui/SettingsMenu';
import PauseMenu from './components/ui/PauseMenu';
import { Menu } from 'lucide-react';
import useGameLogic from './hooks/useGameLogic';

export default function App() {
  const { gameState, jumpscare, energy, setGameState, setPaused, isPaused } = useGameStore();
  const { language, platform } = useSettingsStore();
  const t = translations[language];

  useGameLogic();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'PLAYING' || gameState === 'EXPLORATION') {
          setPaused(!isPaused);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isPaused, setPaused]);

  useEffect(() => {
    if (energy <= 0 && gameState === 'PLAYING') {
      // Power outage handling can be added here
    }
  }, [energy, gameState]);

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative font-sans">
      {/* Mobile Menu Button */}
      {platform === 'mobile' && (gameState === 'PLAYING' || gameState === 'EXPLORATION') && (
        <button 
          onClick={() => setPaused(true)}
          className="fixed top-6 left-6 z-[60] p-3 bg-black/40 border border-white/20 text-white rounded-full backdrop-blur-sm active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>
      )}

      {gameState === 'MENU' && <MainMenu />}
      
      {(gameState === 'PLAYING' || gameState === 'EXPLORATION') && (
        <>
          <div className="absolute inset-0 z-0">
            {gameState === 'PLAYING' ? <GameScene /> : <ExplorationMode />}
          </div>
          
          {gameState === 'PLAYING' && <HUD />}
          {gameState === 'PLAYING' && <Tablet />}

          {gameState === 'EXPLORATION' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 p-2 bg-black/60 border border-white/10 text-[10px] uppercase tracking-widest text-white/60 z-10">
                  {t.exploreInfo}
              </div>
          )}
        </>
      )}

      {jumpscare && <Jumpscare id={jumpscare} />}

      {gameState === 'WIN' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 animate-pulse">
          <h1 className="text-8xl font-black text-white mb-2 tracking-tighter italic uppercase">{t.win}</h1>
          <p className="text-xl mb-12 uppercase tracking-[0.5em] text-white/40">{t.initShiftSub} SUCCESSFUL</p>
          <button 
            onClick={() => setGameState('MENU')}
            className="px-12 py-4 border-2 border-white hover:bg-white hover:text-black transition-all font-black uppercase tracking-widest"
          >
            {t.menu}
          </button>
        </div>
      )}

      <SettingsMenu />
      <PauseMenu />
    </div>
  );
}


