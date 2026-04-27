import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Box, Environment, Stars } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import Office from './Office';
import Factory from './Factory';
import Joystick from '../ui/Joystick';
import * as THREE from 'three';

export default function ExplorationMode() {
  const { isPaused } = useGameStore();
  const { platform } = useSettingsStore();
  const [locked, setLocked] = useState(false);
  const mobileInput = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isPaused) setLocked(false);
  }, [isPaused]);

  const isMobile = platform === 'mobile';

  return (
    <div className="w-full h-full bg-black relative">
        {!isMobile && (
            <div 
                className={`absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer transition-opacity duration-300 ${locked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={() => setLocked(true)}
            >
                <div className="text-center">
                    <p className="text-white font-black text-2xl uppercase tracking-[0.2em] animate-pulse">
                        Click to Explore
                    </p>
                    <p className="text-white/40 text-xs mt-4 uppercase tracking-widest">
                        WASD to Move • ESC to Exit
                    </p>
                </div>
            </div>
        )}

        {isMobile && !isPaused && (
            <div className="absolute bottom-12 left-12 z-[60]">
                <Joystick onMove={(data) => { mobileInput.current = data; }} />
            </div>
        )}

        <Canvas 
            shadows 
            camera={{ fov: 75, position: [0, 1.2, 3] }}
            onTouchStart={(e) => {
                // Prevent scrolling when interacting with game
                if (isMobile) e.preventDefault();
            }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <PerspectiveCameraControls 
                    onLock={() => setLocked(true)} 
                    onUnlock={() => setLocked(false)} 
                    platform={platform}
                    mobileInput={mobileInput}
                />
                
                <Office />
                <Factory />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <fog attach="fog" args={['#000', 2, 15]} />
                <Environment preset="night" />
            </Suspense>
        </Canvas>
    </div>
  );
}

function PerspectiveCameraControls({ onLock, onUnlock, platform, mobileInput }: any) {
    return (
        <>
            {platform !== 'mobile' && <PointerLockControls onLock={onLock} onUnlock={onUnlock} />}
            {platform === 'mobile' && <MobileLook />}
            <PlayerMovement platform={platform} mobileInput={mobileInput} />
        </>
    );
}

function MobileLook() {
    const { camera, gl } = useThree();
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

    useEffect(() => {
        const handleStart = (e: TouchEvent) => {
            if (e.touches[0].clientX > window.innerWidth / 2) {
                isDragging.current = true;
                lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        const handleMove = (e: TouchEvent) => {
            if (!isDragging.current) return;
            const touch = e.touches[0];
            const dx = touch.clientX - lastPos.current.x;
            const dy = touch.clientY - lastPos.current.y;

            euler.current.setFromQuaternion(camera.quaternion);
            euler.current.y -= dx * 0.005;
            euler.current.x -= dy * 0.005;
            euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
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

function PlayerMovement({ platform, mobileInput }: any) {
    const { isPaused } = useGameStore();
    const { camera } = useThree();
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());
    const moveState = useRef({ forward: false, backward: false, left: false, right: false });

    useEffect(() => {
        if (platform === 'mobile') return;
        
        if (isPaused) {
            moveState.current = { forward: false, backward: false, left: false, right: false };
            return;
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': moveState.current.forward = true; break;
                case 'KeyS': moveState.current.backward = true; break;
                case 'KeyA': moveState.current.left = true; break;
                case 'KeyD': moveState.current.right = true; break;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyW': moveState.current.forward = false; break;
                case 'KeyS': moveState.current.backward = false; break;
                case 'KeyA': moveState.current.left = false; break;
                case 'KeyD': moveState.current.right = false; break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPaused, platform]);

    useFrame((_, delta) => {
        if (isPaused) return;
        const speed = 25.0;
        const friction = 10.0;
        
        // Apply friction
        velocity.current.x -= velocity.current.x * friction * delta;
        velocity.current.z -= velocity.current.z * friction * delta;

        if (platform === 'mobile') {
            // Apply joystick input
            velocity.current.z = mobileInput.current.y * speed;
            velocity.current.x = mobileInput.current.x * speed;
        } else {
            // Reset direction for keyboard
            direction.current.z = Number(moveState.current.forward) - Number(moveState.current.backward);
            direction.current.x = Number(moveState.current.right) - Number(moveState.current.left);
            direction.current.normalize();

            // Apply acceleration
            if (moveState.current.forward || moveState.current.backward) velocity.current.z -= direction.current.z * speed * delta;
            if (moveState.current.left || moveState.current.right) velocity.current.x -= direction.current.x * speed * delta;
        }

        // Move camera using built-in translation (respects orientation)
        if (platform === 'mobile') {
            camera.translateX(velocity.current.x * delta * 5);
            camera.translateZ(velocity.current.z * delta * 5);
        } else {
            camera.translateX(-velocity.current.x * delta * 15);
            camera.translateZ(-velocity.current.z * delta * 15);
        }
        
        // Keep fixed height and limit movement area
        camera.position.y = 1.2;
        
        // Clamp position to factory/office area
        camera.position.x = Math.max(-10, Math.min(10, camera.position.x));
        camera.position.z = Math.max(-10, Math.min(10, camera.position.z));
    });

    return null;
}

