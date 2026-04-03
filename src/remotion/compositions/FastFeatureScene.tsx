import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

/**
 * Scene 8: "Fast" feature - purple lightning theme.
 *
 * Reference: "Fast" bold italic at top-center (~35% from top).
 * Horizontal purple light streak across middle with a glowing lightning-bolt
 * icon head that travels from left to right. Purple grid + crosshair bg.
 * Strong purple outer glow on text.
 */
export const FastFeatureScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 34) return null;

  // Text entrance
  const textEntrance = spring({
    frame: f,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  // Lightning icon travels left→right across the streak
  const iconX = interpolate(f, [0, 22], [-100, 1750], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const glowPulse = 0.6 + Math.sin((f / fps) * 6) * 0.4;

  // Scene opacity
  const opacity = interpolate(f, [0, 2, 26, 34], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity, overflow: "hidden" }}>
      {/* Purple grid background with crosshairs */}
      <PurpleGrid />

      {/* Ambient purple wash - right side */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-5%",
          width: 700,
          height: 600,
          background: "radial-gradient(ellipse, rgba(120,50,200,0.12) 0%, transparent 65%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* === HORIZONTAL LIGHT STREAK (middle of frame ~52% from top) === */}
      {/* Trail behind icon */}
      <div
        style={{
          position: "absolute",
          top: 556,
          left: 0,
          width: Math.max(0, iconX),
          height: 6,
          background: `linear-gradient(90deg, transparent 0%, rgba(49,27,146,0.3) 20%, rgba(100,50,180,0.6) 60%, rgba(126,87,194,0.9) 90%, white 100%)`,
          filter: "blur(1px)",
        }}
      />
      {/* Trail bloom/glow */}
      <div
        style={{
          position: "absolute",
          top: 536,
          left: 0,
          width: Math.max(0, iconX + 50),
          height: 46,
          background: `linear-gradient(90deg, transparent 0%, rgba(80,30,160,0.05) 30%, rgba(120,60,200,0.12) 70%, rgba(160,100,240,0.25) 100%)`,
          filter: "blur(18px)",
        }}
      />

      {/* === LIGHTNING ICON HEAD (glowing orb traveling right) === */}
      <div
        style={{
          position: "absolute",
          left: iconX,
          top: 530,
          width: 60,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* White glowing core */}
        <div
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(200,170,255,0.6) 40%, transparent 70%)",
            filter: "blur(3px)",
          }}
        />
        {/* Outer purple glow */}
        <div
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            left: -20,
            top: -20,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(179,157,219,${0.35 * glowPulse}) 0%, rgba(120,60,200,${0.15 * glowPulse}) 40%, transparent 70%)`,
            filter: "blur(12px)",
          }}
        />
        {/* Lightning bolt silhouette */}
        <svg width="24" height="28" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 2 }}>
          <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" fill="rgba(80,30,140,0.9)" />
        </svg>
      </div>

      {/* === "Fast" TEXT at top-center (~35% from top) === */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${(1 - textEntrance) * 20}px)`,
          opacity: textEntrance,
        }}
      >
        <span
          style={{
            fontSize: 130,
            fontWeight: 700,
            fontStyle: "italic",
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textShadow: `
              0 0 40px rgba(209,196,233,0.6),
              0 0 80px rgba(160,100,240,0.3),
              0 0 120px rgba(120,60,200,0.15)
            `,
          }}
        >
          Fast
        </span>
      </div>
    </div>
  );
};

/**
 * Purple grid with crosshair markers matching reference.
 */
const PurpleGrid: React.FC = () => {
  const cellSize = 90;
  const gridColor = "rgba(100,60,160,0.06)";
  const crossColor = "rgba(180,150,220,0.1)";
  const crossSize = 5;
  const majorEvery = 3;
  const majorSize = cellSize * majorEvery;

  const gridSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cellSize}" height="${cellSize}"><line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${gridColor}" stroke-width="0.5"/><line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${gridColor}" stroke-width="0.5"/></svg>`;
  const gridUrl = `url("data:image/svg+xml,${encodeURIComponent(gridSvg)}")`;

  const crossSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${majorSize}" height="${majorSize}"><line x1="${majorSize / 2 - crossSize}" y1="${majorSize / 2}" x2="${majorSize / 2 + crossSize}" y2="${majorSize / 2}" stroke="${crossColor}" stroke-width="1"/><line x1="${majorSize / 2}" y1="${majorSize / 2 - crossSize}" x2="${majorSize / 2}" y2="${majorSize / 2 + crossSize}" stroke="${crossColor}" stroke-width="1"/></svg>`;
  const crossUrl = `url("data:image/svg+xml,${encodeURIComponent(crossSvg)}")`;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.5 }}>
      <div style={{ position: "absolute", inset: "-100px", backgroundImage: gridUrl, backgroundSize: `${cellSize}px ${cellSize}px` }} />
      <div style={{ position: "absolute", inset: "-100px", backgroundImage: crossUrl, backgroundSize: `${majorSize}px ${majorSize}px` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, black 80%)" }} />
    </div>
  );
};

export default FastFeatureScene;
