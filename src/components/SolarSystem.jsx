import React, { useState } from "react";

const planets = [
  {
    name: "Mercury",
    size: 12,
    distance: 60,
    color: "bg-gray-400",
    info: "Mercury is the closest planet to the Sun and the smallest in our solar system.",
    speed: 8,
  },
  {
    name: "Venus",
    size: 16,
    distance: 90,
    color: "bg-yellow-400",
    info: "Venus has a thick toxic atmosphere and is the hottest planet in the solar system.",
    speed: 6,
  },
  {
    name: "Earth",
    size: 18,
    distance: 120,
    color: "bg-blue-500",
    info: "Earth is our home planet, the only one known to support life.",
    speed: 5,
  },
  {
    name: "Mars",
    size: 16,
    distance: 150,
    color: "bg-red-600",
    info: "Mars is the red planet, known for its iron oxide-rich soil and the largest volcano in the solar system.",
    speed: 4,
  },
  {
    name: "Jupiter",
    size: 32,
    distance: 200,
    color: "bg-orange-500",
    info: "Jupiter is the largest planet, a gas giant with a Great Red Spot storm.",
    speed: 3,
  },
  {
    name: "Saturn",
    size: 28,
    distance: 250,
    color: "bg-yellow-300",
    info: "Saturn is famous for its beautiful rings made of ice and rock.",
    speed: 2,
  },
  {
    name: "Uranus",
    size: 24,
    distance: 290,
    color: "bg-cyan-400",
    info: "Uranus is an ice giant with a faint ring system and unique sideways rotation.",
    speed: 1.5,
  },
  {
    name: "Neptune",
    size: 24,
    distance: 330,
    color: "bg-blue-700",
    info: "Neptune is the farthest known planet from the Sun, a cold, blue gas giant.",
    speed: 1.2,
  },
];

export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center py-10">
      <div
        className="relative w-[700px] h-[700px] bg-gradient-to-b from-[#0a0d1a] to-black rounded-lg overflow-visible"
        aria-label="Solar System"
      >
        {/* Sun */}
        <div
          className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-yellow-400 shadow-lg
          -translate-x-1/2 -translate-y-1/2 flex items-center justify-center
          text-black font-bold text-xl select-none"
        >
          ☀️ Sun
        </div>

        {/* Orbit rings + invisible clickable button */}
        {planets.map(({ distance, name }, i) => (
          <div
            key={"orbit-" + i}
            className="absolute rounded-full border border-gray-700/40 pointer-events-none"
            style={{
              width: distance * 2,
              height: distance * 2,
              top: `calc(50% - ${distance}px)`,
              left: `calc(50% - ${distance}px)`,
            }}
          >
            {/* Invisible ring button for clicking orbit */}
            <button
              type="button"
              onClick={() => setSelectedPlanet(name)}
              aria-label={`Select planet ${name} orbit`}
              title={`Click to view ${name}`}
              className="absolute top-0 left-0 w-full h-full rounded-full cursor-pointer bg-transparent"
              style={{ pointerEvents: "auto" }}
            />
          </div>
        ))}

        {/* Planets */}
        {planets.map(({ name, size, distance, color, speed }) => {
          const duration = 40 / speed;
          return (
            <div
              key={name}
              className="absolute top-1/2 left-1/2 rounded-full"
              style={{
                width: distance * 2,
                height: distance * 2,
                marginTop: -distance,
                marginLeft: -distance,
                animation: `spin ${duration}s linear infinite`,
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedPlanet(name)}
                className="absolute rounded-full cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:scale-125 transition-transform duration-300"
                style={{
                  width: size,
                  height: size,
                  top: "50%",
                  left: "100%",
                  marginTop: -size / 2,
                  marginLeft: -size / 2,
                }}
                aria-label={`Select planet ${name}`}
                title={name}
              >
                <div className={`${color} w-full h-full rounded-full`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Details panel */}
      {selectedPlanet && (
        <div
          className="mt-12 bg-gray-900 rounded-lg p-6 max-w-xl w-full shadow-lg relative text-white select-text z-50"
          role="region"
          aria-live="polite"
        >
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-3 right-3 text-red-500 hover:text-red-400 text-xl font-bold focus:outline-none"
            aria-label="Close planet details"
          >
            &times;
          </button>
          <h3 className="text-3xl font-bold mb-4">{selectedPlanet}</h3>
          <p className="text-lg">
            {planets.find((p) => p.name === selectedPlanet)?.info ||
              "No information available."}
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg);}
          to { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}
