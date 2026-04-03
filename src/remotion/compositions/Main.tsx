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
 * Timeline (at 30fps, ~8 seconds total = 240 frames):
 *
 * Scene 1 (0-60):    Text reveal - "Global payments" → "are" → "a pain"
 * Scene 2 (48-105):  "a pain" with 3D perspective rotation + camera fly-through
 * Scene 3 (90-115):  Light streak transition
 * Scene 4 (105-175): Red card + white sphere on perspective grid
 * Scene 5 (160-230): Cyan cylinder morphing + zoom finale
 * Buffer (230-240):  Hold on black
 */
export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  // Scene timing managed by frame offsets

  // Grid visibility - flat grid for text scenes, perspective grid for 3D scenes
  const flatGridOpacity = interpolate(frame, [0, 5, 85, 100], [0, 0.25, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const perspectiveGridOpacity = interpolate(
    frame,
    [95, 110, 210, 225],
    [0, 0.3, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom glow visibility
  const bottomGlowOpacity = interpolate(
    frame,
    [0, 10, 85, 95, 110, 120, 210, 225],
    [0, 0.4, 0.4, 0, 0, 0.3, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Thumbnail artifact */}
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
        {/* Flat grid background (text scenes) */}
        <div style={{ opacity: flatGridOpacity }}>
          <FlatGrid opacity={1} />
        </div>

        {/* Perspective grid (3D object scenes) */}
        <div style={{ opacity: perspectiveGridOpacity }}>
          <PerspectiveGridAnimated startFrame={95} />
        </div>

        {/* Bottom glow */}
        <BottomGlow opacity={bottomGlowOpacity} />

        {/* Scene 1: Text reveal sequence */}
        <TextRevealScene startFrame={0} />

        {/* Scene 2: Perspective text + camera fly-through */}
        <PerspectiveTextScene startFrame={48} />

        {/* Scene 3: Light streak transition */}
        <LightStreakTransition startFrame={90} />

        {/* Scene 4: Red card + white sphere */}
        <ObjectsScene startFrame={105} />

        {/* Scene 5: Cyan cylinder morphing finale */}
        <CyanCylinderScene startFrame={160} />

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
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: (i * 247 + 100) % 1920,
      y: (i * 389 + 200) % 1080,
      size: 2 + (i % 3) * 1.5,
      speedX: (i % 2 === 0 ? 1 : -1) * (0.3 + (i * 0.1)),
      speedY: (i % 3 === 0 ? 1 : -1) * (0.2 + (i * 0.08)),
      phase: i * 0.7,
    }));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.3,
      }}
    >
      {particles.map((p) => {
        const x = p.x + Math.sin(time * p.speedX + p.phase) * 40;
        const y = p.y + Math.cos(time * p.speedY + p.phase) * 30;
        const particleOpacity =
          0.3 + Math.sin(time * 1.5 + p.phase) * 0.3;

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
              background: "rgba(255,255,255,0.6)",
              filter: `blur(${p.size > 3 ? 1 : 0}px)`,
              opacity: particleOpacity,
            }}
          />
        );
      })}
    </div>
  );
};
