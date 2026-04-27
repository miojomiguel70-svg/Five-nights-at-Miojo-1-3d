import { create } from 'zustand';

export type GameState = 'MENU' | 'PLAYING' | 'GAMEOVER' | 'EXPLORATION' | 'WIN';
export type CameraPosition = 'OFFICE' | 'AISLE_1' | 'AISLE_2' | 'FRIDGES' | 'COUNTER' | 'STORAGE' | 'ENTRANCE';

interface AnimatronicState {
  id: 'miojo' | 'nissin' | 'lamen';
  location: CameraPosition;
  difficulty: number;
  lastMove: number;
}

interface GameStore {
  gameState: GameState;
  night: number;
  time: number; // 0 to 6 (AM)
  energy: number; // 0 to 100
  currentCamera: CameraPosition;
  isTabletOpen: boolean;
  isPaused: boolean;
  leftDoorOpen: boolean;
  rightDoorOpen: boolean;
  leftLight: boolean;
  rightLight: boolean;
  animatronics: AnimatronicState[];
  jumpscare: string | null;
  
  // Actions
  startGame: () => void;
  startNight: (night: number) => void;
  tickTime: () => void;
  reduceEnergy: (amount: number) => void;
  setTabletOpen: (open: boolean) => void;
  setPaused: (paused: boolean) => void;
  setCamera: (cam: CameraPosition) => void;
  toggleLeftDoor: () => void;
  toggleRightDoor: () => void;
  toggleLeftLight: () => void;
  toggleRightLight: () => void;
  setGameState: (state: GameState) => void;
  moveAnimatronic: (id: string, location: CameraPosition) => void;
  triggerJumpscare: (id: string) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const STORAGE_KEY = 'miojo_game_save_v1';

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'MENU',
  night: 1,
  time: 0,
  energy: 100,
  currentCamera: 'OFFICE',
  isTabletOpen: false,
  isPaused: false,
  leftDoorOpen: true,
  rightDoorOpen: true,
  leftLight: false,
  rightLight: false,
  animatronics: [
    { id: 'miojo', location: 'STORAGE', difficulty: 1, lastMove: 0 },
    { id: 'nissin', location: 'STORAGE', difficulty: 1, lastMove: 0 },
    { id: 'lamen', location: 'ENTRANCE', difficulty: 1, lastMove: 0 },
  ],
  jumpscare: null,

  setGameState: (state) => set({ gameState: state }),
  
  startGame: () => set({ gameState: 'PLAYING', energy: 100, time: 0, jumpscare: null, isTabletOpen: false }),
  
  startNight: (night) => set({ 
    night, 
    gameState: 'PLAYING', 
    energy: 100, 
    time: 0, 
    jumpscare: null,
    isTabletOpen: false,
    leftDoorOpen: true,
    rightDoorOpen: true,
    animatronics: [
      { id: 'miojo', location: 'STORAGE', difficulty: night * 2, lastMove: Date.now() },
      { id: 'nissin', location: 'STORAGE', difficulty: night * 3, lastMove: Date.now() },
      { id: 'lamen', location: 'ENTRANCE', difficulty: night * 2, lastMove: Date.now() },
    ]
  }),

  tickTime: () => set((state) => {
    if (state.time >= 5) {
        const nextNight = state.night + 1;
        // Save automatically on win
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ night: nextNight }));
        return { gameState: 'WIN', night: nextNight };
    }
    return { time: state.time + 1 };
  }),

  reduceEnergy: (amount) => set((state) => ({ 
    energy: Math.max(0, state.energy - amount) 
  })),

  setTabletOpen: (open) => set({ isTabletOpen: open }),
  
  setPaused: (paused) => set({ isPaused: paused }),
  
  setCamera: (cam) => set({ currentCamera: cam }),

  toggleLeftDoor: () => set((state) => ({ leftDoorOpen: !state.leftDoorOpen })),
  
  toggleRightDoor: () => set((state) => ({ rightDoorOpen: !state.rightDoorOpen })),

  toggleLeftLight: () => set((state) => ({ leftLight: !state.leftLight })),

  toggleRightLight: () => set((state) => ({ rightLight: !state.rightLight })),

  moveAnimatronic: (id, location) => set((state) => ({
    animatronics: state.animatronics.map(a => a.id === id ? { ...a, location, lastMove: Date.now() } : a)
  })),

  triggerJumpscare: (id) => set({ jumpscare: id, gameState: 'GAMEOVER' }),

  saveGame: () => {
    const { night } = useGameStore.getState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ night }));
  },

  loadGame: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { night } = JSON.parse(stored);
        set({ night });
      } catch (e) {
        console.error('Failed to load game', e);
      }
    }
  },

  resetGame: () => set({
    gameState: 'MENU',
    night: 1,
    time: 0,
    energy: 100,
    isTabletOpen: false,
    isPaused: false,
    jumpscare: null,
  })
}));
