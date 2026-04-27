import { Canvas, useThree } from '@react-three/fiber';
import { PointerLockControls, PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import Office from './Office';
import Factory from './Factory';
import Animatronics from './Animatronics';

export default function GameScene() {
  const { currentCamera, isPaused } = useGameStore();
  const { platform } = useSettingsStore();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (isPaused) setLocked(false);
  }, [isPaused]);

  const isMobile = platform === 'mobile';

  return (
    <div className="w-full h-full relative">
      {!isMobile && (
        <div 
            className={`absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer transition-opacity duration-300 ${locked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            onClick={() => setLocked(true)}
        >
            <div className="text-center">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] animate-pulse">
                    Click to Focus System
                </p>
            </div>
        </div>
      )}

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 1.2, 0.5]} fov={75} />
        {!isMobile && <PointerLockControls onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />}
        {isMobile && <MobileLook />}
        
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          
          <group>
            <Office />
            <Factory />
            <Animatronics />
          </group>

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <fog attach="fog" args={['#000', 5, 20]} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function MobileLook() {
    const { camera, gl } = useThree();
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

    useEffect(() => {
        const handleStart = (e: TouchEvent) => {
            isDragging.current = true;
            lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };

        const handleMove = (e: TouchEvent) => {
            if (!isDragging.current) return;
            const touch = e.touches[0];
            const dx = touch.clientX - lastPos.current.x;
            const dy = touch.clientY - lastPos.current.y;

            euler.current.setFromQuaternion(camera.quaternion);
            euler.current.y -= dx * 0.005;
            euler.current.x -= dy * 0.005;
            
            // Constraint look angles for office
            euler.current.x = Math.max(-0.5, Math.min(0.5, euler.current.x));
            euler.current.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.y));
            
            camera.quaternion.setFromEuler(euler.current);

            lastPos.current = { x: touch.clientX, y: touch.clientY };
        };

        const handleEnd = () => { isDragging.current = false; };

        gl.domElement.addEventListener('touchstart', handleStart);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleEnd);

        return () => {
            gl.domElement.removeEventListener('touchstart', handleStart);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [gl, camera]);

    return null;
}
