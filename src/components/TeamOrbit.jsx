import React, { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";

// Simple ease-in-out cubic function
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function TeamOrbit({ members, containerSize }) {
  const count = members.length;
  const radius = useMemo(() => containerSize * 0.45, [containerSize]);

  const animationRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // For pulsation animation: store elapsed time
  const pulseTimeRef = useRef(0);

  function updateRotation(prevRotation, deltaSeconds, speed) {
    // Use easing to smoothly speed up/down rotation between 0 and 1 cycle
    const easedSpeed = speed * easeInOutCubic((Math.sin(pulseTimeRef.current) + 1) / 2);
    return (prevRotation + easedSpeed * deltaSeconds) % (2 * Math.PI);
  }

  useEffect(() => {
    const baseSpeed = 0.8; // radians per second (faster orbit)

    function animate(timestamp) {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaSeconds = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (!isPaused) {
        pulseTimeRef.current += deltaSeconds * 3; // speed of pulse animation
        rotationRef.current = updateRotation(rotationRef.current, deltaSeconds, baseSpeed);
        setRotation(rotationRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPaused]);

  // Memoize rendering for performance
  const renderedMembers = useMemo(() => {
    return members.map(({ name, img, role }, index) => {
      // Orbit position
      const angle = (index / count) * 2 * Math.PI + rotation;

      // Calculate X, Y for circle orbit
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      // Pulsation scale oscillates between 0.85 and 1.15 with phase offset by index
      const pulse = 0.85 + 0.3 * Math.abs(Math.sin(pulseTimeRef.current * 2 + (index * Math.PI) / count));

      // Z-depth illusion: scale Y based on position in orbit (simulate 3D)
      const depthScale = 0.7 + 0.3 * ((Math.sin(angle) + 1) / 2); // 0.7 to 1.0 scale

      // Shadow intensity changes with depth for 3D feel
      const shadowIntensity = 0.2 + 0.5 * ((Math.sin(angle) + 1) / 2);

      return (
        <article
          role="listitem"
          key={name}
          tabIndex={0}
          aria-label={`Team member: ${name}, Role: ${role}`}
          style={{
            position: "absolute",
            top: `calc(50% + ${y}px)`,
            left: `calc(50% + ${x}px)`,
            transform: `translate(-50%, -50%) scale(${pulse * depthScale})`,
            width: containerSize * 0.3,
            textAlign: "center",
            cursor: "pointer",
            outline: "none",
            transition: "box-shadow 0.3s ease",
            filter: `drop-shadow(0 4px 4px rgba(0,0,0,${shadowIntensity}))`,
            zIndex: Math.round(depthScale * 100), // ensure front ones overlay
          }}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => setSelectedMember(members[index])}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedMember(members[index]);
            }
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = `translate(-50%, -50%) scale(${pulse * depthScale * 1.2})`;
            e.currentTarget.style.boxShadow = "0 0 20px rgba(239,68,68,0.95)";
            e.currentTarget.style.filter = `drop-shadow(0 6px 8px rgba(0,0,0,${Math.min(shadowIntensity + 0.3, 0.7)}))`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = `translate(-50%, -50%) scale(${pulse * depthScale})`;
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.filter = `drop-shadow(0 4px 4px rgba(0,0,0,${shadowIntensity}))`;
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.transform = `translate(-50%, -50%) scale(${pulse * depthScale * 1.2})`;
            e.currentTarget.style.boxShadow = "0 0 20px rgba(239,68,68,0.95)";
            e.currentTarget.style.filter = `drop-shadow(0 6px 8px rgba(0,0,0,${Math.min(shadowIntensity + 0.3, 0.7)}))`;
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.transform = `translate(-50%, -50%) scale(${pulse * depthScale})`;
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.filter = `drop-shadow(0 4px 4px rgba(0,0,0,${shadowIntensity}))`;
          }}
        >
          <img
            src={img}
            alt={name}
            loading="lazy"
            style={{
              width: "100%",
              height: containerSize * 0.3,
              borderRadius: "50%",
              border: "4px solid #dc2626",
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              objectFit: "cover",
              display: "block",
              margin: "0 auto 8px",
              transition: "transform 0.3s ease",
            }}
          />
          <p
            style={{
              color: "#f87171",
              fontWeight: "600",
              fontSize: 14,
              userSelect: "none",
              margin: 0,
            }}
          >
            {name}
          </p>
          <p
            style={{
              color: "#fca5a5",
              fontWeight: "400",
              fontSize: 12,
              marginTop: 2,
              userSelect: "none",
            }}
          >
            {role}
          </p>
        </article>
      );
    });
  }, [members, rotation, radius, containerSize]);

  return (
    <>
      <section
        aria-label="Team orbit"
        role="list"
        tabIndex={-1}
        style={{
          position: "relative",
          width: containerSize,
          height: containerSize,
          margin: "20px auto 0 auto",
          userSelect: "none",
          outline: "none",
        }}
      >
        {/* Orbit path circle */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: radius * 2,
            height: radius * 2,
            border: "1.5px dashed #dc2626",
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            boxSizing: "border-box",
            filter: "drop-shadow(0 0 4px #dc2626)",
          }}
        />
        {renderedMembers}
      </section>

      {/* Modal for selected member */}
      {selectedMember && (
        <Modal onClose={() => setSelectedMember(null)}>
          <h2 style={{ marginTop: 0, color: "#b91c1c" }}>{selectedMember.name}</h2>
          <p style={{ fontWeight: "600", color: "#dc2626" }}>{selectedMember.role}</p>
          <img
            src={selectedMember.img}
            alt={selectedMember.name}
            style={{ width: "100%", borderRadius: 12, marginTop: 10 }}
          />
        </Modal>
      )}
    </>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        {children}
        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            cursor: "pointer",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: "700",
            fontSize: 16,
            userSelect: "none",
          }}
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>
  );
}

TeamOrbit.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
  containerSize: PropTypes.number.isRequired,
};
