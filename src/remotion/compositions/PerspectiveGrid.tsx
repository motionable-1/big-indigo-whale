import React from "react";

/**
 * Dark perspective grid with crosshair markers.
 * Matches the reference video's dark grid with faint lines and + markers.
 */
export const PerspectiveGrid: React.FC<{
  opacity?: number;
  perspectiveAmount?: number;
  rotateX?: number;
  translateZ?: number;
}> = ({
  opacity = 0.25,
  perspectiveAmount = 800,
  rotateX = 55,
  translateZ = 0,
}) => {
  const cellSize = 80;
  const gridColor = "rgba(255,255,255,0.08)";
  const crossColor = "rgba(255,255,255,0.18)";
  const crossSize = 8;
  const majorEvery = 3;

  // Build SVG for the grid pattern
  const gridSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${cellSize}" height="${cellSize}">
      <line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${gridColor}" stroke-width="0.5" />
      <line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${gridColor}" stroke-width="0.5" />
    </svg>
  `;
  const gridUrl = `url("data:image/svg+xml,${encodeURIComponent(gridSvg)}")`;

  // Major grid with crosshairs
  const majorSize = cellSize * majorEvery;
  const crossSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${majorSize}" height="${majorSize}">
      <line x1="${majorSize / 2 - crossSize}" y1="${majorSize / 2}" x2="${majorSize / 2 + crossSize}" y2="${majorSize / 2}" stroke="${crossColor}" stroke-width="1" />
      <line x1="${majorSize / 2}" y1="${majorSize / 2 - crossSize}" x2="${majorSize / 2}" y2="${majorSize / 2 + crossSize}" stroke="${crossColor}" stroke-width="1" />
    </svg>
  `;
  const crossUrl = `url("data:image/svg+xml,${encodeURIComponent(crossSvg)}")`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          left: "-50%",
          top: "-50%",
          transform: `perspective(${perspectiveAmount}px) rotateX(${rotateX}deg) translateZ(${translateZ}px)`,
          transformOrigin: "center center",
        }}
      >
        {/* Base grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: gridUrl,
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />
        {/* Crosshair markers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: crossUrl,
            backgroundSize: `${majorSize}px ${majorSize}px`,
          }}
        />
      </div>
      {/* Radial fade mask */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 20%, black 75%)",
        }}
      />
    </div>
  );
};

/**
 * Flat centered grid (no perspective) matching frames 1-9.
 */
export const FlatGrid: React.FC<{ opacity?: number }> = ({
  opacity = 0.2,
}) => {
  const cellSize = 80;
  const gridColor = "rgba(255,255,255,0.06)";
  const crossColor = "rgba(255,255,255,0.15)";
  const crossSize = 6;
  const majorEvery = 3;
  const majorSize = cellSize * majorEvery;

  const gridSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${cellSize}" height="${cellSize}">
      <line x1="0" y1="0" x2="${cellSize}" y2="0" stroke="${gridColor}" stroke-width="0.5" />
      <line x1="0" y1="0" x2="0" y2="${cellSize}" stroke="${gridColor}" stroke-width="0.5" />
    </svg>
  `;
  const gridUrl = `url("data:image/svg+xml,${encodeURIComponent(gridSvg)}")`;

  const crossSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${majorSize}" height="${majorSize}">
      <line x1="${majorSize / 2 - crossSize}" y1="${majorSize / 2}" x2="${majorSize / 2 + crossSize}" y2="${majorSize / 2}" stroke="${crossColor}" stroke-width="1" />
      <line x1="${majorSize / 2}" y1="${majorSize / 2 - crossSize}" x2="${majorSize / 2}" y2="${majorSize / 2 + crossSize}" stroke="${crossColor}" stroke-width="1" />
    </svg>
  `;
  const crossUrl = `url("data:image/svg+xml,${encodeURIComponent(crossSvg)}")`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-100px",
          backgroundImage: gridUrl,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "-100px",
          backgroundImage: crossUrl,
          backgroundSize: `${majorSize}px ${majorSize}px`,
        }}
      />
      {/* Radial fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 25%, black 70%)",
        }}
      />
    </div>
  );
};

/**
 * Bottom glow effect matching the reference video.
 */
export const BottomGlow: React.FC<{
  opacity?: number;
  color?: string;
}> = ({ opacity = 0.4, color = "rgba(255,255,255,0.15)" }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: -50,
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        height: 300,
        background: `radial-gradient(ellipse at center bottom, ${color} 0%, transparent 70%)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export default PerspectiveGrid;
