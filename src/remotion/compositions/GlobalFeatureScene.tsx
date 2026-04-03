import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { NetworkDiagram } from "./NetworkDiagram";

/**
 * Scene 9: "Global" feature showcase with blue/cyan network diagram.
 *
 * Reference frames 51-57:
 * - "Global" text upper-left with cyan/blue glow
 * - 5-node network diagram with connecting white/blue lines
 * - Light streak entering from left
 * - Blue-tinted atmosphere
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

  const opacity = interpolate(f, [0, 2, 36, 46], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowPulse = 0.5 + Math.sin((f / fps) * 4) * 0.3;

  return (
    <div style={{ position: "absolute", inset: 0, opacity, overflow: "hidden" }}>
      {/* Subtle crosshair grid bg */}
      <CrosshairGrid />

      {/* Blue atmosphere glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 500,
          height: 400,
          background: "radial-gradient(ellipse, rgba(0,150,220,0.1) 0%, transparent 60%)",
          opacity: glowPulse,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Network diagram */}
      <NetworkDiagram
        startFrame={startFrame}
        lineColor="rgba(150,200,255,0.6)"
        nodeColor="rgba(20,40,80,0.8)"
        glowColor="rgba(80,180,255,1)"
        textColor="rgba(200,230,255,0.9)"
      />

      {/* "Global" text - upper left */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 160,
          transform: `translateX(${(1 - textEntrance) * -40}px)`,
          opacity: textEntrance,
        }}
      >
        <span
          style={{
            fontSize: 88,
            fontWeight: 600,
            color: "white",
            letterSpacing: "-0.03em",
            textShadow: `0 0 40px rgba(80,180,255,${0.3 * glowPulse}), 0 0 80px rgba(40,120,220,${0.12 * glowPulse})`,
            lineHeight: 1,
          }}
        >
          Global.
        </span>
      </div>
    </div>
  );
};

const CrosshairGrid: React.FC = () => {
  const cellSize = 100;
  const gridColor = "rgba(255,255,255,0.03)";
  const crossColor = "rgba(100,180,255,0.08)";
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

export default GlobalFeatureScene;
