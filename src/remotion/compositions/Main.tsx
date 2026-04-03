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
import { InfinityDiscScene } from "./InfinityDiscScene";
import { BrandRevealScene } from "./BrandRevealScene";
import { FastFeatureScene } from "./FastFeatureScene";
import { GlobalFeatureScene } from "./GlobalFeatureScene";
import { AffordableFeatureScene } from "./AffordableFeatureScene";
import { PerspectiveGridAnimated } from "./PerspectiveGridAnimated";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

/**
 * Main composition - "Global payments are a pain" → Infinite brand reveal.
 *
 * === TIMELINE (30fps) ===
 *
 * PART 1 - Intro (F0-165) [existing scenes]:
 *   Scene 1 (F0-64):     Text reveals ("Global payments" → "are" → "are a" → "a pain")
 *   Scene 2 (F56-78):    "a pain" 3D perspective zoom-through
 *   Scene 3 (F78-94):    Light streak transition
 *   Scene 4 (F90-126):   Red card + white sphere approach & merge
 *   Scene 5 (F122-152):  Cyan cylinder morph + zoom
 *
 * PART 2 - Brand reveal + Features (F148-345) [new scenes]:
 *   Scene 6 (F148-168):  Infinity disc floating on zoomed cyan cylinder
 *   Scene 7 (F164-234):  "Meet ∞" → "∞ Infinite" brand reveal
 *   Scene 8 (F230-264):  "Fast." purple lightning feature
 *   Scene 9 (F260-306):  "Global." blue network diagram feature
 *   Scene 10 (F302-350): "Affordable." orange network diagram feature
 *   Buffer (F350-360):   Hold to black
 */
export const Main: React.FC = () => {
  const frame = useCurrentFrame();

  // === BACKGROUND LAYERS ===

  // Flat grid (text scenes: frames 0-78)
  const flatGridOpacity = interpolate(
    frame,
    [0, 2, 72, 80],
    [0.2, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Perspective grid (3D scenes: frames 76-168)
  const perspGridOpacity = interpolate(
    frame,
    [76, 82, 155, 168],
    [0, 0.45, 0.45, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom glow - phase 1 (text + objects)
  const bottomGlowOpacity1 = interpolate(
    frame,
    [0, 3, 72, 80, 84, 90, 155, 168],
    [0.3, 0.4, 0.4, 0, 0, 0.25, 0.25, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Bottom glow - phase 2 (brand reveal scenes)
  const bottomGlowOpacity2 = interpolate(
    frame,
    [158, 168, 340, 355],
    [0, 0.15, 0.15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const bottomGlowOpacity = Math.max(bottomGlowOpacity1, bottomGlowOpacity2);

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
            <PerspectiveGridAnimated startFrame={76} />
          </div>
        )}

        {/* Bottom glow */}
        <BottomGlow opacity={bottomGlowOpacity} />

        {/* ===== PART 1: INTRO ===== */}

        {/* Scene 1: Text reveal with breathing room */}
        <TextRevealScene startFrame={0} />

        {/* Scene 2: "a pain" 3D perspective zoom-through */}
        <PerspectiveTextScene startFrame={56} />

        {/* Scene 3: Light streak transition */}
        <LightStreakTransition startFrame={78} />

        {/* Scene 4: Red card + white sphere */}
        <ObjectsScene startFrame={90} />

        {/* Scene 5: Cyan cylinder morphing */}
        <CyanCylinderScene startFrame={122} />

        {/* ===== PART 2: BRAND REVEAL + FEATURES ===== */}

        {/* Scene 6: Infinity disc on zoomed cylinder */}
        <InfinityDiscScene startFrame={148} />

        {/* Scene 7: "Meet ∞" → "∞ Infinite" brand reveal (starts earlier for smooth crossfade) */}
        <BrandRevealScene startFrame={158} />

        {/* Scene 8: "Fast." purple lightning feature */}
        <FastFeatureScene startFrame={230} />

        {/* Scene 9: "Global." blue network diagram */}
        <GlobalFeatureScene startFrame={260} />

        {/* Scene 10: "Affordable." orange network diagram */}
        <AffordableFeatureScene startFrame={302} />

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
