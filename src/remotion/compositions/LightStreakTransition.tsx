import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

/**
 * Scene 3: Light streak / flash transition.
 * A bright white streak moves diagonally across the screen.
 */
export const LightStreakTransition: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;

  if (f < 0 || f > 25) return null;

  // Streak position - moves from upper-left to lower-right
  const streakX = interpolate(f, [0, 20], [-400, 2400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const streakY = interpolate(f, [0, 20], [-200, 1200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Streak opacity
  const streakOpacity = interpolate(f, [0, 3, 12, 20], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash overlay
  const flashOpacity = interpolate(f, [5, 10, 18], [0, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Light streak */}
      <div
        style={{
          position: "absolute",
          left: streakX,
          top: streakY,
          width: 300,
          height: 6,
          background:
            "linear-gradient(90deg, transparent, white 30%, white 70%, transparent)",
          filter: "blur(3px)",
          opacity: streakOpacity,
          transform: "rotate(-25deg)",
          boxShadow: "0 0 40px 15px rgba(255,255,255,0.4)",
        }}
      />

      {/* Secondary smaller streak */}
      <div
        style={{
          position: "absolute",
          left: streakX - 100,
          top: streakY + 60,
          width: 150,
          height: 3,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 40%, transparent)",
          filter: "blur(2px)",
          opacity: streakOpacity * 0.5,
          transform: "rotate(-25deg)",
        }}
      />

      {/* Screen flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: flashOpacity,
        }}
      />
    </div>
  );
};

export default LightStreakTransition;
