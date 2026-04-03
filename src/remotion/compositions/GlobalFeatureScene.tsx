import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { NetworkDiagram } from "./NetworkDiagram";

/**
 * Scene 9: "Global" feature - blue/cyan network tree.
 *
 * Reference: "Global" text upper-left, starts as dark/blurred then becomes
 * bright white with cyan glow. Vertical tree diagram with 5 dark nodes
 * connected by solid white/blue 90-degree elbow lines. Light streak enters
 * from left into middle node. Nodes light up with blue/cyan gradient glow.
 * Subtle dark background with faint grid/crosshairs.
 */
export const GlobalFeatureScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 46) return null;

  const textEntrance = spring({
    frame: f,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  // Text starts blurred/dark, becomes sharp white+cyan
  const textBlur = interpolate(f, [0, 10], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textBrightness = interpolate(f, [0, 10], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(f, [0, 2, 36, 46], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Nodes light up after streak arrives (~frame 12)
  const nodesLit = f > 10;

  const glowPulse = 0.5 + Math.sin((f / fps) * 4) * 0.3;

  return (
    <div style={{ position: "absolute", inset: 0, opacity, overflow: "hidden" }}>
      {/* Subtle dark grid background */}
      <SubtleGrid color="rgba(100,180,255,0.04)" crossColor="rgba(150,200,255,0.07)" />

      {/* Blue atmosphere glow - upper left near text */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "5%",
          width: 500,
          height: 400,
          background: "radial-gradient(ellipse, rgba(0,150,220,0.06) 0%, transparent 60%)",
          opacity: glowPulse + 0.3,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Network tree diagram */}
      <NetworkDiagram
        startFrame={startFrame}
        lineColor="rgba(220,235,255,0.6)"
        nodeColor="rgba(15,20,35,0.9)"
        glowColor="rgba(80,180,255,1)"
        litNodes={nodesLit}
      />

      {/* "Global" text - upper left */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 140,
          transform: `translateY(${(1 - textEntrance) * 20}px)`,
          opacity: textEntrance,
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            filter: `blur(${textBlur}px) brightness(${textBrightness})`,
            textShadow: textBlur < 2
              ? `0 0 40px rgba(80,200,255,${0.5 * glowPulse}), 0 0 80px rgba(40,160,240,${0.2 * glowPulse})`
              : "none",
          }}
        >
          Global
        </span>
      </div>
    </div>
  );
};

/**
 * Subtle background grid with very faint lines and tiny crosshairs.
 */
const SubtleGrid: React.FC<{ color: string; crossColor: string }> = ({
  color,
  crossColor,
}) => {
  const cellSize = 80;
  const crossSize = 4;
  const majorSize = cellSize * 4;

  const gridSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cellSize}" height="${cellSize}"><line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${color}" stroke-width="0.5"/><line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${color}" stroke-width="0.5"/></svg>`;
  const gridUrl = `url("data:image/svg+xml,${encodeURIComponent(gridSvg)}")`;

  const crossSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${majorSize}" height="${majorSize}"><line x1="${majorSize / 2 - crossSize}" y1="${majorSize / 2}" x2="${majorSize / 2 + crossSize}" y2="${majorSize / 2}" stroke="${crossColor}" stroke-width="0.8"/><line x1="${majorSize / 2}" y1="${majorSize / 2 - crossSize}" x2="${majorSize / 2}" y2="${majorSize / 2 + crossSize}" stroke="${crossColor}" stroke-width="0.8"/></svg>`;
  const crossUrl = `url("data:image/svg+xml,${encodeURIComponent(crossSvg)}")`;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: "-100px", backgroundImage: gridUrl, backgroundSize: `${cellSize}px ${cellSize}px` }} />
      <div style={{ position: "absolute", inset: "-100px", backgroundImage: crossUrl, backgroundSize: `${majorSize}px ${majorSize}px` }} />
    </div>
  );
};

export default GlobalFeatureScene;
