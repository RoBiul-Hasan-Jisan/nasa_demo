import { useEffect, useState } from "react";
import teamMembers from "../data/teamMembers";
import AstroCenter from "../components/AstroCenter";
import TeamOrbit from "../components/TeamOrbit";
import HintText from "../components/HintText";
import SolarSystem from "../components/SolarSystem";
import Quiz from "../components/Quiz";
import SatelliteSection from "../components/SatelliteSection";
export default function Home() {
  const [containerSize, setContainerSize] = useState(
    Math.min(window.innerWidth * 0.66, 600)
  );

  useEffect(() => {
    function handleResize() {
      setContainerSize(Math.min(window.innerWidth * 0.66, 600));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
  <div className="nasa-bg min-h-screen flex flex-col items-center justify-center text-white px-4 relative overflow-hidden pt-40">

      {/* Star twinkle overlay */}
      <div className="nasa-stars" aria-hidden="true">
        {[...Array(30)].map((_, i) => (
          <span key={i} style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 3}s`
          }} />
        ))}
      </div>

      {/* Hero Section */}
      <section
        className="relative"
        style={{ width: containerSize, height: containerSize, zIndex: 10 }}
      >
        <AstroCenter size={containerSize * 0.35} />
        <TeamOrbit members={teamMembers} containerSize={containerSize} />
      </section>
      <HintText />

      {/* Solar System Section */}
     <section
  className="w-full h-screen max-w-none mt-20 opacity-0 animate-fadeInUp animation-delay-300 relative z-20"
  style={{ animationFillMode: "forwards", animationDuration: "1s" }}
>
        <SolarSystem />
      </section>

      <SatelliteSection />

      {/* Quiz Section */}
      <section
        className="w-full max-w-3xl mt-20 mb-20 opacity-0 animate-fadeInUp animation-delay-600 relative z-20"
        style={{ animationFillMode: "forwards", animationDuration: "1s" }}
      >
        <Quiz />
      </section>

      {/* Embedded styles */}
      <style>{`
        /* NASA background with drifting starfield */
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, 50px); }
        }

        /* Star twinkle */
        @keyframes twinkle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.2; }
        }

        /* Fade-in up animation */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nasa-bg {
          background: radial-gradient(ellipse at center, #000000 0%, #000010 70%, #000000 100%);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        .nasa-bg::before,
        .nasa-bg::after {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: transparent url("https://www.nasa.gov/sites/default/files/thumbnails/image/stars_background.jpg") no-repeat center center;
          background-size: cover;
          opacity: 0.05;
          animation: drift 120s linear infinite;
          z-index: 0;
          pointer-events: none; /* Important: allow clicks through */
        }

        .nasa-bg::after {
          opacity: 0.02;
          animation-delay: 60s;
        }

        .nasa-stars {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none; /* Important: allow clicks through */
          z-index: 5;
        }

        .nasa-stars span {
          position: absolute;
          border-radius: 50%;
          background: white;
          opacity: 0.7;
          animation: twinkle 3s infinite ease-in-out;
          z-index: 6;
        }

        .animate-fadeInUp {
          animation-name: fadeInUp;
          animation-fill-mode: forwards;
          animation-duration: 1s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}
