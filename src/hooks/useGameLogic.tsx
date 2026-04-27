import { useEffect, useRef } from 'react';
import { useGameStore, CameraPosition } from '../store/useGameStore';

export default function useGameLogic() {
  const { 
    gameState, 
    energy, 
    reduceEnergy, 
    tickTime, 
    isTabletOpen, 
    leftDoorOpen, 
    rightDoorOpen, 
    leftLight, 
    rightLight,
    animatronics,
    moveAnimatronic,
    triggerJumpscare,
    night,
    isPaused,
    toggleLeftDoor,
    toggleRightDoor,
    toggleLeftLight,
    toggleRightLight
  } = useGameStore();

  const lastTick = useRef(Date.now());
  const lastTimeTick = useRef(Date.now());

  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'q') toggleLeftDoor();
      if (key === 'e') toggleRightDoor();
      if (key === 'a') toggleLeftLight();
      if (key === 'd') toggleRightLight();
    };

    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      const now = Date.now();
      
      // 1. Energy Consumption
      let usage = 0.1; // Base idle power
      if (isTabletOpen) usage += 0.3;
      if (!leftDoorOpen) usage += 0.5;
      if (!rightDoorOpen) usage += 0.5;
      if (leftLight) usage += 0.2;
      if (rightLight) usage += 0.2;
      
      reduceEnergy(usage);

      // 2. Time Progression (Every 60 seconds = 1 hour)
      if (now - lastTimeTick.current > 60000) {
        tickTime();
        lastTimeTick.current = now;
      }

      // 3. Animatronic AI
      animatronics.forEach(anim => {
        // Move chance based on difficulty (1-20)
        const moveChance = (anim.difficulty + night) / 100;
        
        if (Math.random() < moveChance && now - anim.lastMove > 5000) {
          const routes: Record<CameraPosition, CameraPosition[]> = {
            'STORAGE': ['AISLE_1', 'AISLE_2', 'FRIDGES'],
            'ENTRANCE': ['AISLE_1', 'AISLE_2', 'COUNTER'],
            'FRIDGES': ['STORAGE', 'AISLE_1'],
            'COUNTER': ['ENTRANCE', 'AISLE_2'],
            'AISLE_1': ['STORAGE', 'OFFICE'],
            'AISLE_2': ['ENTRANCE', 'OFFICE'],
            'OFFICE': ['STORAGE'], // They reset if they fail attack
          };

          const nextPossible = routes[anim.location] || ['STORAGE'];
          const next = nextPossible[Math.floor(Math.random() * nextPossible.length)];
          
          // Check attack logic
          if (next === 'OFFICE') {
              if (anim.location === 'AISLE_1' && !leftDoorOpen) {
                  // Attack blocked! Move back to start
                  moveAnimatronic(anim.id, 'STORAGE');
              } else if (anim.location === 'AISLE_2' && !rightDoorOpen) {
                  // Attack blocked! Move back to start
                  moveAnimatronic(anim.id, 'STORAGE');
              } else if (anim.location === 'AISLE_1' && leftDoorOpen) {
                  triggerJumpscare(anim.id);
              } else if (anim.location === 'AISLE_2' && rightDoorOpen) {
                  triggerJumpscare(anim.id);
              } else {
                  // Wait at the corridor
                  moveAnimatronic(anim.id, anim.location);
              }
          } else {
            moveAnimatronic(anim.id, next);
          }
        }
      });

      // 4. Power Outage Handling
      if (energy <= 0) {
        // Force Tablet off, doors open, lights off
        // This normally triggers Freddy's march in FNAF
        // For simplicity: instant lose after a delay
        setTimeout(() => triggerJumpscare('miojo'), 5000);
      }

    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    gameState, 
    energy, 
    reduceEnergy, 
    tickTime, 
    isTabletOpen, 
    leftDoorOpen, 
    rightDoorOpen, 
    leftLight, 
    rightLight, 
    animatronics, 
    moveAnimatronic, 
    triggerJumpscare,
    night,
    isPaused,
    toggleLeftDoor,
    toggleRightDoor,
    toggleLeftLight,
    toggleRightLight
  ]);
}
