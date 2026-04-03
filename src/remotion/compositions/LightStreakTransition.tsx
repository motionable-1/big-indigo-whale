import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Scene 3: Light streak / flash transition on the perspective grid.
 *
 * Reference timing:
 * Frame 45 (ref 16, 3000ms): Just grid visible + small white glow point lower-right
 * Frame 48 (ref 17, 3200ms): Bright white streak moving across grid, lower area
 * Frame 51 (ref 18, 3400ms): Streak continues diagonal, upper-left to lower-right
 * Frame 54 (ref 19, 3600ms): Streak still moving, elongated with trail
 */
export const LightStreakTransition: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;

  if (f < 0 || f > 16) return null;

  // Small initial glow point (visible before streak)
  const glowOpacity = interpolate(f, [0, 2, 4, 8], [0.6, 1, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Streak position - travels from lower-left toward upper-right area
  const streakProgress = interpolate(f, [2, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const streakX = interpolate(streakProgress, [0, 1], [1200, 400]);
  const streakY = interpolate(streakProgress, [0, 1], [800, 350]);

  // Streak opacity
  const streakOpacity = interpolate(f, [2, 4, 10, 14], [0, 1, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Streak length grows then shrinks
  const streakLength = interpolate(f, [2, 6, 10, 14], [50, 250, 200, 80], {
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
      {/* Initial glow point - lower right */}
      <div
        style={{
          position: "absolute",
          left: 1100,
          top: 700,
          width: 60,
          height: 30,
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, transparent 70%)",
          filter: "blur(8px)",
          opacity: glowOpacity,
          borderRadius: "50%",
        }}
      />

      {/* Main light streak */}
      <div
        style={{
          position: "absolute",
          left: streakX,
          top: streakY,
          width: streakLength,
          height: 5,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 30%, white 60%, rgba(255,255,255,0.7) 100%)",
          filter: "blur(2px)",
          opacity: streakOpacity,
          transform: "rotate(-30deg)",
          transformOrigin: "center center",
          boxShadow:
            "0 0 20px 8px rgba(255,255,255,0.3), 0 0 60px 20px rgba(255,255,255,0.15)",
          borderRadius: 10,
        }}
      />

      {/* Streak glow halo */}
      <div
        style={{
          position: "absolute",
          left: streakX - 20,
          top: streakY - 30,
          width: streakLength + 40,
          height: 60,
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)",
          filter: "blur(15px)",
          opacity: streakOpacity * 0.6,
          transform: "rotate(-30deg)",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};

export default LightStreakTransition;
