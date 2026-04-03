import React from "react";
import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FlatGrid, BottomGlow } from "./PerspectiveGrid";
import { TextRevealScene } from "./TextRevealScene";
import { PerspectiveTextScene } from "./PerspectiveTextScene";
import { LightStreakTransition } from "./LightStreakTransition";
import { ObjectsScene } from "./ObjectsScene";
import { CyanCylinderScene } from "./CyanCylinderScene";
import { PerspectiveGridAnimated } from "./PerspectiveGridAnimated";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

/**
 * Main composition - "Global payments are a pain" animation.
 *
 * Matched to reference frames at 200ms intervals (30fps):
 *
 * Ref 1-4   (0-600ms)    F0-9:    "Global payments" gradient reveal + fade
 * Ref 5     (800ms)       F10-14:  "are" appears
 * Ref 6     (1000ms)      F13-17:  "are a" sequence
 * Ref 7-9   (1200-1600ms) F17-24:  "a pain" reveals and holds
 * Ref 10-12 (1800-2200ms) F27-36:  3D perspective rotation + camera zoom
 * Ref 13-15 (2400-2800ms) F36-42:  Extreme zoom through "pain" text
 * Ref 16    (3000ms)      F45:     Text gone, grid + white glow point
 * Ref 17-19 (3200-3600ms) F48-54:  Light streak across grid
 * Ref 20    (3800ms)      F57:     Red card + white sphere appear
 * Ref 21-28 (4000-5400ms) F60-81:  Sphere approaches card slowly
 * Ref 29    (5600ms)      F84:     Cyan disc appears (merge)
 * Ref 30-31 (5800-6000ms) F87-90:  Cylinder morph
 * Ref 32    (6200ms)      F93:     Final close-up zoom
 * Buffer                  F93-120: Hold + gentle fade
 */
export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  // timing managed via startFrame offsets per scene

  // === BACKGROUND LAYERS ===

  // Flat grid (text scenes: frames 0-45)
  const flatGridOpacity = interpolate(frame, [0, 2, 40, 48], [0.2, 0.25, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Perspective grid (3D scenes: frames 45-115)
  const perspGridOpacity = interpolate(
    frame,
    [42, 48, 105, 115],
    [0, 0.45, 0.45, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom glow
  const bottomGlowOpacity = interpolate(
    frame,
    [0, 3, 40, 48, 50, 55, 105, 115],
    [0.3, 0.4, 0.4, 0, 0, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      <AbsoluteFill
        style={{
          backgroundColor: "#000000",
          fontFamily,
          overflow: "hidden",
        }}
      >
        {/* Flat grid (text scenes) */}
        {flatGridOpacity > 0.01 && (
          <div style={{ opacity: flatGridOpacity }}>
            <FlatGrid opacity={1} />
          </div>
        )}

        {/* Perspective grid (3D object scenes) */}
        {perspGridOpacity > 0.01 && (
          <div style={{ opacity: perspGridOpacity }}>
            <PerspectiveGridAnimated startFrame={42} />
          </div>
        )}

        {/* Bottom glow */}
        <BottomGlow opacity={bottomGlowOpacity} />

        {/* Scene 1: Text reveal — "Global payments" → "are" → "a pain" */}
        {/* Frames 0-28 */}
        <TextRevealScene startFrame={0} />

        {/* Scene 2: "a pain" 3D perspective zoom-through */}
        {/* Starts at frame 24 (overlaps end of text scene), ends ~46 */}
        <PerspectiveTextScene startFrame={24} />

        {/* Scene 3: Light streak transition */}
        {/* Frames 44-60 */}
        <LightStreakTransition startFrame={44} />

        {/* Scene 4: Red card + white sphere */}
        {/* Frames 55-85 */}
        <ObjectsScene startFrame={55} />

        {/* Scene 5: Cyan cylinder morphing finale */}
        {/* Frames 82-112 */}
        <CyanCylinderScene startFrame={82} />

        {/* Ambient floating particles */}
        <FloatingParticles />
      </AbsoluteFill>
    </>
  );
};

/**
 * Subtle ambient floating particles for visual depth.
 */
const FloatingParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const particles = React.useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: (i * 317 + 200) % 1920,
      y: (i * 439 + 150) % 1080,
      size: 1.5 + (i % 3) * 1,
      speedX: (i % 2 === 0 ? 1 : -1) * (0.4 + i * 0.08),
      speedY: (i % 3 === 0 ? 1 : -1) * (0.25 + i * 0.06),
      phase: i * 0.9,
    }));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.2,
      }}
    >
      {particles.map((p) => {
        const x = p.x + Math.sin(time * p.speedX + p.phase) * 35;
        const y = p.y + Math.cos(time * p.speedY + p.phase) * 25;
        const particleOpacity = 0.3 + Math.sin(time * 1.5 + p.phase) * 0.25;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
              opacity: particleOpacity,
            }}
          />
        );
      })}
    </div>
  );
};
