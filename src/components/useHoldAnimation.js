import { useState } from "react";

export default function useHoldAnimation(initial = false) {
  const [isAnimating, setIsAnimating] = useState(initial);

  function startAnimation() {
    setIsAnimating(true);
  }

  function stopAnimation() {
    setIsAnimating(false);
  }

  return { isAnimating, startAnimation, stopAnimation };
}
