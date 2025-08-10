import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Outline effect for selected model
function HighlightOutline({ object, active }) {
  const outlineRef = useRef();

  useEffect(() => {
    if (!object || !outlineRef.current) return;
    outlineRef.current.visible = active;
  }, [active, object]);

  if (!object) return null;

  return (
    <primitive
      ref={outlineRef}
      object={object.clone()}
      scale={[1.05, 1.05, 1.05]}
      onUpdate={(self) => {
        self.traverse((child) => {
          if (child.isMesh) {
            child.material = child.material.clone();
            child.material.color = new THREE.Color(0x00ffff);
            child.material.emissive = new THREE.Color(0x00ffff);
            child.material.emissiveIntensity = 0.7;
            child.material.side = THREE.BackSide;
            child.material.transparent = true;
            child.material.opacity = 0.4;
            child.material.depthWrite = false;
          }
        });
      }}
      visible={false}
    />
  );
}

function ClickableModel({ path, position, scale = 1, rotation = [0, 0, 0], name, onSelect, isSelected }) {
  const gltf = useGLTF(path);
  const ref = useRef();

  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = hovered
          ? new THREE.Color(0x00ffff)
          : new THREE.Color(0x000000);
      }
    });
  });

  return (
    <>
      <primitive
        object={gltf.scene}
        position={position}
        scale={scale}
        rotation={rotation}
        ref={ref}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(name, ref.current);
        }}
      />
      {isSelected && <HighlightOutline object={ref.current} active={isSelected} />}
    </>
  );
}

// Typewriter effect component for animated text reveal
function TypewriterText({ text, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText(""); // Reset displayed text on new input

    if (!text) return;

    indexRef.current = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        indexRef.current++;
        if (indexRef.current > text.length) {
          clearInterval(intervalId);
          return prev;
        }
        return text.slice(0, indexRef.current);
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <p
      style={{
        margin: 0,
        lineHeight: 1.4,
        color: "#a0f0f0",
        textShadow: "0 0 4px #00cccc",
        whiteSpace: "pre-wrap",
        minHeight: "4.2em", // prevent layout shift
      }}
    >
      {displayedText}
    </p>
  );
}

export default function SatelliteSection() {
  const [selected, setSelected] = useState({ name: null, object: null });

  const infoData = {
    "Aquarius (B) (unfurled)":
      "Aquarius (B) is the larger unfurled solar array configuration of the Aquarius satellite.",
    "Aquarius (A)": "Aquarius (A) is the compact solar array configuration of the Aquarius satellite.",
    "Apollo Lunar Module":
      "Apollo Lunar Module: The lunar landing module used in the Apollo missions to land astronauts on the Moon.",
  };

  // Control info panel fade in/out
  const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    if (selected.name) setShowInfo(true);
    else setTimeout(() => setShowInfo(false), 300);
  }, [selected.name]);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "700px",
          position: "relative",
          background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 80%)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <Canvas shadows camera={{ position: [0, 3, 20], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[5, 10, 5]}
            intensity={1}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <pointLight position={[-5, -5, -5]} intensity={0.3} />

          <Suspense fallback={null}>
            {[
              {
                path: "/model/Aquarius (B) (unfurled).glb",
                position: [-8, 0, 0],
                scale: 1,
                rotation: [0, Math.PI / 3, 0],
                name: "Aquarius (B) (unfurled)",
              },
              {
                path: "/model/Aquarius (A).glb",
                position: [0, 0, 0],
                scale: 1,
                rotation: [0, Math.PI, 0],
                name: "Aquarius (A)",
              },
              {
                path: "/model/Apollo Lunar Module.glb",
                position: [8, 0, 0],
                scale: 0.6,
                rotation: [0, Math.PI, 0],
                name: "Apollo Lunar Module",
              },
            ].map(({ path, position, scale, rotation, name }) => (
              <ClickableModel
                key={name}
                path={path}
                position={position}
                scale={scale}
                rotation={rotation}
                name={name}
                onSelect={(name, obj) => setSelected({ name, object: obj })}
                isSelected={selected.name === name}
              />
            ))}
          </Suspense>

          <OrbitControls enablePan enableZoom enableRotate />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
        </Canvas>

        {/* Info panel */}
        {(showInfo || selected.name) && (
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              maxWidth: 320,
              padding: "20px 25px",
              background:
                "rgba(0, 0, 0, 0.6) linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(0, 100, 100, 0.25))",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0, 255, 255, 0.2)",
              color: "#00ffff",
              userSelect: "none",
              transition: "opacity 0.3s ease",
              opacity: selected.name ? 1 : 0,
              pointerEvents: selected.name ? "auto" : "none",
              fontWeight: 600,
              fontSize: "1rem",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              zIndex: 10,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            role="dialog"
            aria-live="polite"
            aria-label={`Information about ${selected.name}`}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 12,
                fontWeight: "bold",
                fontSize: "1.3rem",
                color: "#00ffff",
                textShadow: "0 0 6px #00ffff",
              }}
            >
              {selected.name}
            </h2>
            <TypewriterText text={infoData[selected.name]} speed={30} />
            <button
              onClick={() => setSelected({ name: null, object: null })}
              style={{
                marginTop: 20,
                backgroundColor: "#003333",
                border: "none",
                padding: "8px 18px",
                borderRadius: 10,
                color: "#00ffff",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005555")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#003333")}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}
