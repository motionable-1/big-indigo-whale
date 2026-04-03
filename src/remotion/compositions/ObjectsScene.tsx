import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

/**
 * Scene 4: Red glossy card and white glowing sphere on perspective grid.
 * The sphere approaches the red card and they merge into a cyan cylinder.
 */
export const ObjectsScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 80) return null;

  // Phase 1: Red card appears (frames 0-15)
  const cardEntrance = spring({
    frame: f,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Phase 2: White sphere appears and moves toward card (frames 8-45)
  const sphereEntrance = spring({
    frame: Math.max(0, f - 8),
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Sphere position - starts far right, moves toward card
  const sphereX = interpolate(f, [8, 50], [350, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const sphereY = interpolate(f, [8, 50], [180, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Phase 3: Merge - both objects fade and cyan cylinder appears (frames 45-60)
  const mergeProgress = interpolate(f, [45, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const objectsOpacity = 1 - mergeProgress;

  // Card subtle rotation
  const cardRotateY = interpolate(f, [0, 40], [0, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sphere motion blur simulation (scale stretch)
  const sphereStretch = interpolate(f, [15, 40, 50], [1, 1.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sphere glow pulse
  const sphereGlow = interpolate(
    Math.sin((f / fps) * 4),
    [-1, 1],
    [15, 30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px",
      }}
    >
      {/* Red glossy card */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(-80px, -20px) rotateY(${cardRotateY}deg) scale(${cardEntrance})`,
          opacity: objectsOpacity * cardEntrance,
          width: 160,
          height: 160,
          borderRadius: 16,
          background:
            "linear-gradient(135deg, #ff2d2d 0%, #cc0000 60%, #990000 100%)",
          boxShadow: `
            0 20px 60px rgba(255,0,0,0.3),
            0 0 40px rgba(255,0,0,0.15),
            inset 0 2px 0 rgba(255,255,255,0.4),
            inset 0 -2px 0 rgba(0,0,0,0.2)
          `,
        }}
      >
        {/* Highlight reflection */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "45%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)",
            borderRadius: "16px 16px 50% 50%",
          }}
        />
      </div>

      {/* White glowing sphere */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${sphereX}px, ${sphereY}px) scaleX(${sphereStretch}) scale(${sphereEntrance})`,
          opacity: objectsOpacity * sphereEntrance,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 35%, white, rgba(200,220,255,0.8) 50%, rgba(150,180,255,0.3) 100%)",
          boxShadow: `0 0 ${sphereGlow}px ${sphereGlow / 2}px rgba(255,255,255,0.8), 0 0 ${sphereGlow * 2}px rgba(255,255,255,0.3)`,
          filter: "blur(1px)",
        }}
      />

      {/* Red card bottom glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) translate(-80px, 80px)",
          width: 200,
          height: 60,
          background:
            "radial-gradient(ellipse, rgba(255,0,0,0.15) 0%, transparent 70%)",
          opacity: objectsOpacity * cardEntrance,
          filter: "blur(10px)",
        }}
      />
    </div>
  );
};

export default ObjectsScene;
