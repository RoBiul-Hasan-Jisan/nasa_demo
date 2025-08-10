import React, { useState, useCallback, useRef } from "react";
import * as THREE from "three"; // ✅ Import THREE
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import planets from "../data/planetsData";

export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const planetInfo = planets.find((p) => p.name === selectedPlanet);

  const handlePlanetClick = useCallback((name) => {
    setSelectedPlanet(name);
  }, []);

  const closeDetails = useCallback(() => setSelectedPlanet(null), []);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center py-10 relative">
      <div
        className="relative w-[700px] h-[700px] max-w-full rounded-lg overflow-hidden"
        aria-describedby={selectedPlanet ? "planet-details" : undefined}
      >
        <Canvas camera={{ position: [0, 100, 200], fov: 60 }}>
          {/* Space background */}
          <Stars radius={300} depth={60} count={20000} factor={7} fade />

          {/* Lights */}
          <pointLight position={[0, 0, 0]} intensity={2} />
          <ambientLight intensity={0.3} />

          {/* Sun */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[12, 32, 32]} />
            <meshStandardMaterial emissive={"yellow"} emissiveIntensity={1.5} />
          </mesh>

          {/* Orbits & planets */}
          {planets.map(({ name, size, distance, color, speed }) => (
            <group key={name}>
              {/* Orbit matches planet color */}
              <OrbitRing radius={distance / 2} color={color} />
              <Planet
                name={name}
                size={size / 2}
                distance={distance / 2}
                color={color}
                speed={speed}
                onClick={handlePlanetClick}
              />
            </group>
          ))}

          {/* Camera controls */}
          <OrbitControls />
        </Canvas>

        {/* Details panel */}
        {selectedPlanet && (
          <>
            <div
              onClick={closeDetails}
              className="absolute inset-0 bg-black bg-opacity-70 z-[1100]"
            />
            <section
              id="planet-details"
              className="absolute top-1/2 left-1/2 max-w-xl w-[90vw] bg-gray-900 rounded-lg p-6 shadow-lg text-white z-[1110] -translate-x-1/2 -translate-y-1/2"
              role="dialog"
              aria-modal="true"
              aria-labelledby="planet-details-title"
            >
              <button
                onClick={closeDetails}
                className="absolute top-3 right-3 text-red-500 hover:text-red-400 text-xl font-bold"
              >
                &times;
              </button>
              <h3 id="planet-details-title" className="text-3xl font-bold mb-4">
                {planetInfo?.name}
              </h3>
              <p className="text-lg">{planetInfo?.info}</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

// 3D Planet with orbit animation
function Planet({ name, size, distance, color, speed, onClick }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (speed / 5);
    ref.current.position.x = Math.cos(t) * distance;
    ref.current.position.z = Math.sin(t) * distance;
  });

  return (
    <mesh ref={ref} onClick={() => onClick(name)} castShadow receiveShadow>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Orbit ring around the sun
function OrbitRing({ radius, color }) {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    );
  }

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={0.5} />
    </line>
  );
}
