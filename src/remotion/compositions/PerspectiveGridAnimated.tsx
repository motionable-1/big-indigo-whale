import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Animated perspective grid floor for 3D object scenes.
 * Creates receding grid lines that match the reference video.
 */
export const PerspectiveGridAnimated: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = frame - startFrame;
  const time = f / fps;

  // Slow scroll animation for depth movement
  const scrollY = time * 20;

  // Generate horizontal lines that get closer together toward horizon
  const horizonY = height * 0.42; // horizon line position
  const lineCount = 20;

  const hLines = React.useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const t = (i + 1) / lineCount;
      // Exponential spacing - lines get closer near horizon
      const screenY = horizonY + (height - horizonY) * Math.pow(t, 1.6);
      const opacity = 0.06 + t * 0.12;
      return { y: screenY, opacity };
    });
  }, [horizonY, height]);

  // Vertical lines that converge toward vanishing point
  const vanishX = width / 2;
  const vLineCount = 16;

  const vLines = React.useMemo(() => {
    return Array.from({ length: vLineCount }, (_, i) => {
      const spread = (i - vLineCount / 2 + 0.5) / (vLineCount / 2);
      return {
        topX: vanishX + spread * 50, // narrow at horizon
        bottomX: vanishX + spread * (width * 0.7), // wide at bottom
        opacity: 0.04 + Math.abs(spread) * 0.06,
      };
    });
  }, [vanishX, width]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Horizontal grid lines */}
        {hLines.map((line, i) => {
          // Animate vertical scroll
          const animatedY =
            line.y + ((scrollY * (1 + i * 0.1)) % 40) - 20;
          if (animatedY < horizonY || animatedY > height) return null;
          return (
            <line
              key={`h-${i}`}
              x1={0}
              y1={animatedY}
              x2={width}
              y2={animatedY}
              stroke="white"
              strokeWidth={0.5}
              opacity={line.opacity}
            />
          );
        })}

        {/* Vertical converging lines */}
        {vLines.map((line, i) => (
          <line
            key={`v-${i}`}
            x1={line.topX}
            y1={horizonY}
            x2={line.bottomX}
            y2={height + 50}
            stroke="white"
            strokeWidth={0.5}
            opacity={line.opacity}
          />
        ))}

        {/* Crosshair markers at intersections */}
        {hLines
          .filter((_, i) => i % 3 === 0)
          .map((hLine, hi) => {
            const animatedY =
              hLine.y + ((scrollY * (1 + hi * 3 * 0.1)) % 40) - 20;
            if (animatedY < horizonY || animatedY > height) return null;

            return vLines
              .filter((_, vi) => vi % 2 === 0)
              .map((vLine, vi) => {
                // Interpolate X position along the vertical line at this Y
                const t =
                  (animatedY - horizonY) / (height + 50 - horizonY);
                const crossX =
                  vLine.topX + (vLine.bottomX - vLine.topX) * t;
                const crossSize = 4 + t * 4;

                return (
                  <g key={`cross-${hi}-${vi}`} opacity={0.2 + t * 0.15}>
                    <line
                      x1={crossX - crossSize}
                      y1={animatedY}
                      x2={crossX + crossSize}
                      y2={animatedY}
                      stroke="white"
                      strokeWidth={0.8}
                    />
                    <line
                      x1={crossX}
                      y1={animatedY - crossSize}
                      x2={crossX}
                      y2={animatedY + crossSize}
                      stroke="white"
                      strokeWidth={0.8}
                    />
                  </g>
                );
              });
          })}
      </svg>

      {/* Horizon glow */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: horizonY - 60,
          height: 120,
          background:
            "linear-gradient(180deg, transparent, rgba(255,255,255,0.02), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Edge fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center 55%, transparent 30%, rgba(0,0,0,0.7) 65%, black 85%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default PerspectiveGridAnimated;
