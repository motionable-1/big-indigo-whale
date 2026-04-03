import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { NetworkDiagram } from "./NetworkDiagram";

/**
 * Scene 10: "Affordable" feature with orange/yellow/purple network diagram.
 *
 * Reference frames 58-64:
 * - "Affordable" text lower-right with yellow/white glow
 * - Same 5-node network but recolored: orange→yellow→purple gradient
 * - Dashed connection lines
 * - Warm atmosphere
 */
export const AffordableFeatureScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 48) return null;

  const textEntrance = spring({
    frame: f,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const opacity = interpolate(f, [0, 2, 38, 48], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = 0.5 + Math.sin((f / fps) * 3.5) * 0.3;

  return (
    <div style={{ position: "absolute", inset: 0, opacity, overflow: "hidden" }}>
      {/* Subtle crosshair grid bg */}
      <WarmGrid />

      {/* Warm atmosphere glow - bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 500,
          height: 400,
          background: "radial-gradient(ellipse, rgba(255,180,50,0.1) 0%, transparent 60%)",
          opacity: glowPulse,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Secondary purple glow - top left */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "15%",
          width: 400,
          height: 350,
          background: "radial-gradient(ellipse, rgba(160,60,220,0.06) 0%, transparent 60%)",
          opacity: glowPulse,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Network diagram - warm colors, dashed */}
      <NetworkDiagram
        startFrame={startFrame}
        lineColor="rgba(255,180,80,0.5)"
        nodeColor="rgba(60,30,15,0.8)"
        glowColor="rgba(255,160,40,1)"
        textColor="rgba(255,220,180,0.9)"
        dashed
      />

      {/* Color gradient overlay on network lines area */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "25%",
          width: "50%",
          height: "60%",
          background: "linear-gradient(135deg, rgba(255,120,30,0.04) 0%, rgba(200,80,220,0.04) 50%, rgba(255,200,50,0.04) 100%)",
          borderRadius: 40,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* "Affordable" text - lower right */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          right: 160,
          transform: `translateX(${(1 - textEntrance) * 40}px)`,
          opacity: textEntrance,
        }}
      >
        <span
          style={{
            fontSize: 82,
            fontWeight: 600,
            color: "white",
            letterSpacing: "-0.03em",
            textShadow: `0 0 40px rgba(255,180,50,${0.25 * glowPulse}), 0 0 80px rgba(255,140,20,${0.1 * glowPulse})`,
            lineHeight: 1,
          }}
        >
          Affordable.
        </span>
      </div>
    </div>
  );
};

const WarmGrid: React.FC = () => {
  const cellSize = 100;
  const gridColor = "rgba(255,255,255,0.025)";
  const crossColor = "rgba(255,180,80,0.06)";
  const crossSize = 5;
  const majorSize = cellSize * 3;

  const gridSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cellSize}" height="${cellSize}"><line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${gridColor}" stroke-width="0.5"/><line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${gridColor}" stroke-width="0.5"/></svg>`;
  const gridUrl = `url("data:image/svg+xml,${encodeURIComponent(gridSvg)}")`;

  const crossSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${majorSize}" height="${majorSize}"><line x1="${majorSize / 2 - crossSize}" y1="${majorSize / 2}" x2="${majorSize / 2 + crossSize}" y2="${majorSize / 2}" stroke="${crossColor}" stroke-width="1"/><line x1="${majorSize / 2}" y1="${majorSize / 2 - crossSize}" x2="${majorSize / 2}" y2="${majorSize / 2 + crossSize}" stroke="${crossColor}" stroke-width="1"/></svg>`;
  const crossUrl = `url("data:image/svg+xml,${encodeURIComponent(crossSvg)}")`;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.3 }}>
      <div style={{ position: "absolute", inset: "-100px", backgroundImage: gridUrl, backgroundSize: `${cellSize}px ${cellSize}px` }} />
      <div style={{ position: "absolute", inset: "-100px", backgroundImage: crossUrl, backgroundSize: `${majorSize}px ${majorSize}px` }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, black 75%)" }} />
    </div>
  );
};

export default AffordableFeatureScene;
