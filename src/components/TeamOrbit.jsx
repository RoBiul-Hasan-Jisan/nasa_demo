import { useEffect, useState } from "react";

export default function TeamOrbit({ members, containerSize }) {
  const count = members.length;
  const radius = containerSize * 0.4;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="absolute top-1/2 left-1/2 animate-rotate-slow"
      style={{
        width: containerSize,
        height: containerSize,
        transformOrigin: "50% 50%",
        animationTimingFunction: "linear",
        translate: "-50% -50%",
      }}
    >
      {members.map(({ name, img }, index) => {
        const angle = (index / count) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const delay = index * 0.2;

        const style = {
          position: "absolute",
          top: `calc(50% + ${y}px)`,
          left: `calc(50% + ${x}px)`,
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: containerSize * 0.22,
          opacity: mounted ? 1 : 0,
          transition: `opacity 0.6s ease ${delay}s`,
        };

        return (
          <div
            key={name}
            style={style}
            className="group cursor-pointer"
            title={name}
          >
            <img
              src={img}
              alt={name}
              className="rounded-full border-4 border-red-600 shadow-lg mx-auto mb-2
                  group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.9)]
                  transition-transform duration-300"
              style={{
                width: containerSize * 0.22,
                height: containerSize * 0.22,
                objectFit: "cover",
              }}
            />
            <p className="text-red-400 group-hover:text-red-600 font-semibold select-none text-sm">
              {name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
