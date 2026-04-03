import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { NetworkDiagram } from "./NetworkDiagram";

/**
 * Scene 10: "Affordable" feature - warm orange/yellow/gold network tree.
 *
 * Reference: Same vertical tree layout as Global but:
 * - Dashed lines instead of solid
 * - Orange→yellow→gold gradient colors on lines and node borders
 * - "Affordable" text bottom-right with warm golden glow
 * - Lines "cradle" the text - top line forms ceiling, bottom forms floor
 * - Dark textured node interiors, no labels
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
      {/* Subtle dark background grid */}
      <SubtleWarmGrid />

      {/* Warm atmosphere glow - near text area */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 500,
          height: 400,
          background: "radial-gradient(ellipse, rgba(255,180,50,0.06) 0%, transparent 60%)",
          opacity: glowPulse + 0.3,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Network tree diagram - warm colors, dashed */}
      <NetworkDiagram
        startFrame={startFrame}
        lineColor="rgba(255,180,80,0.55)"
        nodeColor="rgba(30,18,10,0.9)"
        glowColor="rgba(255,160,40,1)"
        dashed
        litNodes={false}
      />

      {/* "Affordable" text - bottom right, cradled by the network lines */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          right: 140,
          transform: `translateX(${(1 - textEntrance) * 30}px)`,
          opacity: textEntrance,
        }}
      >
        <span
          style={{
            fontSize: 90,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textShadow: `
              0 0 40px rgba(255,200,80,${0.4 * glowPulse}),
              0 0 80px rgba(255,160,40,${0.15 * glowPulse}),
              0 0 120px rgba(200,100,20,${0.08 * glowPulse})
            `,
          }}
        >
          Affordable
        </span>
      </div>
    </div>
  );
};

const SubtleWarmGrid: React.FC = () => {
  const cellSize = 80;
  const gridColor = "rgba(255,200,150,0.025)";
  const crossColor = "rgba(255,180,100,0.04)";
  const crossSize = 4;
  const majorSize = cellSize * 4;

  const gridSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cellSize}" height="${cellSize}"><line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${gridColor}" stroke-width="0.5"/><line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${gridColor}" stroke-width="0.5"/></svg>`;
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

export default AffordableFeatureScene;
