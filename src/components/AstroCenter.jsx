export default function AstroCenter({ size }) {
  return (
    <div
      className="absolute rounded-full bg-red-700 border-8 border-red-400 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-xl animate-pulse-glow"
      style={{
        top: "50%",
        left: "50%",
        width: size,
        height: size,
        zIndex: 10,
      }}
    >
      <h2
        className="text-white font-extrabold uppercase tracking-widest text-center select-none leading-tight"
        style={{
          fontSize: size * 0.2,
          lineHeight: 1.1,
        }}
      >
        Astro
        <br />
        lopper
      </h2>
    </div>
  );
}
