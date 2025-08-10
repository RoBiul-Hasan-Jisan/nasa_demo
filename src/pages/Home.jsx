import { useEffect, useState } from "react";
import teamMembers from "../data/teamMembers";
import AstroCenter from "../components/AstroCenter";
import TeamOrbit from "../components/TeamOrbit";
import HintText from "../components/HintText";
import SolarSystem from "../components/SolarSystem";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      {/* Hero Section */}
      <div
        className="relative"
        style={{ width: containerSize, height: containerSize }}
      >
        <AstroCenter size={containerSize * 0.35} />
        <TeamOrbit members={teamMembers} containerSize={containerSize} />
      </div>
      <HintText />

      {/* Solar System Section */}
      <div className="w-full max-w-5xl mt-20">
        <SolarSystem />
      </div>
    </div>
  );
}
