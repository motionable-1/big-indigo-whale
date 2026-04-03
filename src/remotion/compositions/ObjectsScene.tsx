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
 * The sphere has a long motion trail and slowly approaches the red card.
 *
 * Reference timing (these are absolute composition frames):
 * Frame 57 (ref 20, 3800ms): Red card appears upper-left area, white sphere with trail at right
 * Frame 60-81 (ref 21-28): Sphere slowly approaches card with motion trail
 *   - Sphere has LONG stretched motion blur trail
 *   - Card is glossy red with white specular highlight
 *   - Both float above the perspective grid
 *   - Sphere moves from bottom-right toward card at upper-left
 * Frame 84 (ref 29, 5600ms): Objects gone, cyan disc appears
 */
export const ObjectsScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 30) return null;

  // Card entrance - quick spring
  const cardEntrance = spring({
    frame: f,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // Sphere entrance
  const sphereEntrance = spring({
    frame: Math.max(0, f - 2),
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Sphere position - starts far bottom-right, moves toward card at upper-left
  // Movement is slow and steady over frames 0-27 (ref frames 20-28)
  const sphereX = interpolate(f, [2, 27], [380, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const sphereY = interpolate(f, [2, 27], [250, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Phase: merge begins - both objects fade
  const mergeProgress = interpolate(f, [25, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const objectsOpacity = 1 - mergeProgress;

  // Motion trail length - longer when sphere is moving fast
  const sphereSpeed = Math.abs(
    interpolate(f, [2, 15, 27], [8, 12, 3], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const trailLength = sphereSpeed * 18;

  // Trail angle - follows motion direction
  const trailAngle = interpolate(f, [2, 27], [-35, -25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card subtle float
  const cardFloat =
    Math.sin((f / fps) * 2) * 4;

  // Sphere glow pulse
  const sphereGlow = 15 + Math.sin((f / fps) * 5) * 8;

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
      {/* Red glossy card - positioned upper-left of center */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(-120px, ${-60 + cardFloat}px) scale(${cardEntrance})`,
          opacity: objectsOpacity * cardEntrance,
          width: 130,
          height: 130,
          borderRadius: 14,
          background:
            "linear-gradient(145deg, #ff3333 0%, #dd1111 45%, #aa0000 100%)",
          boxShadow: `
            0 15px 50px rgba(255,0,0,0.25),
            0 0 30px rgba(255,0,0,0.1),
            inset 0 2px 0 rgba(255,255,255,0.45),
            inset 0 -2px 0 rgba(0,0,0,0.25)
          `,
        }}
      >
        {/* Specular highlight - white band across top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "42%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)",
            borderRadius: "14px 14px 60% 60%",
          }}
        />
        {/* Edge highlight */}
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        />
      </div>

      {/* White glowing sphere with motion trail */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translate(${sphereX}px, ${sphereY}px) scale(${sphereEntrance})`,
          opacity: objectsOpacity * sphereEntrance,
        }}
      >
        {/* Motion trail - stretched ellipse behind sphere */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: trailLength,
            height: 12,
            transform: `translate(10px, -6px) rotate(${trailAngle}deg)`,
            transformOrigin: "left center",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.8) 100%)",
            filter: "blur(4px)",
            borderRadius: "50%",
          }}
        />

        {/* Sphere core */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 35%, white, rgba(210,230,255,0.9) 40%, rgba(150,190,255,0.4) 100%)",
            boxShadow: `0 0 ${sphereGlow}px ${sphereGlow / 2}px rgba(255,255,255,0.7), 0 0 ${sphereGlow * 2.5}px rgba(255,255,255,0.2)`,
            position: "relative",
            zIndex: 2,
          }}
        />
      </div>

      {/* Card floor reflection glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) translate(-120px, 80px)",
          width: 180,
          height: 40,
          background:
            "radial-gradient(ellipse, rgba(255,30,30,0.12) 0%, transparent 70%)",
          opacity: objectsOpacity * cardEntrance,
          filter: "blur(12px)",
        }}
      />
    </div>
  );
};

export default ObjectsScene;
