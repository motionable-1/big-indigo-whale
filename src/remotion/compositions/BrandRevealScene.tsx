import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

/**
 * Scene 7: "Meet ∞ Infinite" brand reveal.
 *
 * Reference frames 36-46:
 * F36-37: "Meet ∞" text on dark grid, diamond markers, bottom-right glow
 * F38-42: "∞ Infinite" logo reveal with metallic chrome gradient
 * F43-46: Hold on "∞ Infinite" brand lockup, gradient white→gray
 */
export const BrandRevealScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 70) return null;

  // Phase 1: "Meet ∞" (F0-25)
  const meetEntrance = spring({
    frame: f,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const meetOpacity = interpolate(f, [0, 3, 20, 26], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 2: "∞ Infinite" logo (F22-65)
  const logoDelay = 22;
  const logoEntrance = spring({
    frame: Math.max(0, f - logoDelay),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const logoOpacity = interpolate(f, [logoDelay, logoDelay + 4, 58, 66], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shimmer on logo text - starts bright, sweeps to reveal gradient
  const shimmerX = interpolate(f, [logoDelay, logoDelay + 20], [-50, 250], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene opacity
  const sceneOpacity = interpolate(f, [0, 2, 62, 70], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = 0.5 + Math.sin((f / fps) * 3) * 0.2;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: sceneOpacity,
      }}
    >
      {/* Grid with diamond markers */}
      <GridWithDiamonds frame={f} />

      {/* Bottom-right cyan glow */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -40,
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(0,200,220,0.12) 0%, transparent 65%)",
          opacity: glowPulse,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Phase 1: "Meet ∞" */}
      {meetOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: meetOpacity,
          }}
        >
          <div
            style={{
              transform: `translateY(${(1 - meetEntrance) * 30}px)`,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <span
              style={{
                fontSize: 72,
                fontWeight: 400,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "-0.02em",
              }}
            >
              Meet
            </span>
            <span
              style={{
                fontSize: 82,
                fontWeight: 300,
                color: "white",
                textShadow: "0 0 20px rgba(200,220,255,0.3)",
              }}
            >
              ∞
            </span>
          </div>
        </div>
      )}

      {/* Phase 2: "∞ Infinite" logo lockup */}
      {logoOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: logoOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${0.85 + logoEntrance * 0.15})`,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            {/* Infinity symbol - metallic bright */}
            <span
              style={{
                fontSize: 90,
                fontWeight: 300,
                background: "linear-gradient(135deg, #ffffff 0%, #e8e8f0 40%, #c0c0cc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 15px rgba(200,220,255,0.35))",
                lineHeight: 1,
              }}
            >
              ∞
            </span>

            {/* "Infinite" with shimmer gradient - much brighter base */}
            <span
              style={{
                fontSize: 76,
                fontWeight: 500,
                letterSpacing: "-0.03em",
                background: `linear-gradient(90deg, #ffffff ${shimmerX - 40}%, #f0f0f4 ${shimmerX}%, #c8c8d0 ${shimmerX + 40}%, #a0a0a8 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
              }}
            >
              Infinite
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Dark grid with diamond markers (ref frames 36-37).
 */
const GridWithDiamonds: React.FC<{ frame: number }> = ({ frame }) => {
  const cellSize = 80;
  const gridColor = "rgba(255,255,255,0.04)";
  const diamondColor = "rgba(255,255,255,0.12)";
  const diamondSize = 4;
  const majorEvery = 4;
  const majorSize = cellSize * majorEvery;

  const gridSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cellSize}" height="${cellSize}"><line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${gridColor}" stroke-width="0.5"/><line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${gridColor}" stroke-width="0.5"/></svg>`;
  const gridUrl = `url("data:image/svg+xml,${encodeURIComponent(gridSvg)}")`;

  const diamondSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${majorSize}" height="${majorSize}"><polygon points="${majorSize / 2},${majorSize / 2 - diamondSize} ${majorSize / 2 + diamondSize},${majorSize / 2} ${majorSize / 2},${majorSize / 2 + diamondSize} ${majorSize / 2 - diamondSize},${majorSize / 2}" fill="${diamondColor}"/></svg>`;
  const diamondUrl = `url("data:image/svg+xml,${encodeURIComponent(diamondSvg)}")`;

  const scroll = (frame * 0.3) % cellSize;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.25 }}>
      <div
        style={{
          position: "absolute",
          inset: "-100px",
          backgroundImage: gridUrl,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          transform: `translateY(${scroll}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "-100px",
          backgroundImage: diamondUrl,
          backgroundSize: `${majorSize}px ${majorSize}px`,
          transform: `translateY(${scroll}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 25%, black 70%)",
        }}
      />
    </div>
  );
};

export default BrandRevealScene;
