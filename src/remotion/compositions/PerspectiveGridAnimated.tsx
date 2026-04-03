import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Animated perspective grid that scrolls slowly for the 3D object scenes.
 * Creates a floor-like perspective grid with crosshair markers.
 */
export const PerspectiveGridAnimated: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  const time = f / fps;

  const cellSize = 80;
  const gridColor = "rgba(255,255,255,0.07)";
  const crossColor = "rgba(255,255,255,0.15)";
  const crossSize = 7;
  const majorEvery = 3;
  const majorSize = cellSize * majorEvery;

  // Slow scroll animation
  const scrollOffset = time * 15;

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
      }}
    >
      {/* Perspective container */}
      <div
        style={{
          position: "absolute",
          width: "250%",
          height: "250%",
          left: "-75%",
          top: "-20%",
          transform: `perspective(600px) rotateX(55deg)`,
          transformOrigin: "center 60%",
        }}
      >
        {/* Base grid with scroll */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: gridUrl,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundPosition: `0px ${scrollOffset}px`,
          }}
        />
        {/* Crosshairs with scroll */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: crossUrl,
            backgroundSize: `${majorSize}px ${majorSize}px`,
            backgroundPosition: `0px ${scrollOffset}px`,
          }}
        />
      </div>

      {/* Fade mask - vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center 60%, transparent 15%, rgba(0,0,0,0.6) 45%, black 70%)",
        }}
      />
    </div>
  );
};

export default PerspectiveGridAnimated;
