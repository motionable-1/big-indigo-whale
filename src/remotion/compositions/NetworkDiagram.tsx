import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

/**
 * Shared network diagram component used by Global and Affordable scenes.
 * 5 rounded-square nodes connected by thin lines.
 * Color scheme is parameterized.
 */

interface Node {
  x: number;
  y: number;
  label: string;
}

const NODES: Node[] = [
  { x: 960, y: 400, label: "HQ" },      // center
  { x: 620, y: 280, label: "EU" },      // top-left
  { x: 1300, y: 280, label: "US" },     // top-right
  { x: 650, y: 580, label: "APAC" },    // bottom-left
  { x: 1280, y: 580, label: "LATAM" },  // bottom-right
];

// Connections between nodes (index pairs)
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 2], [3, 4], [1, 3], [2, 4],
];

interface NetworkDiagramProps {
  startFrame: number;
  lineColor: string;
  nodeColor: string;
  glowColor: string;
  textColor: string;
  dashed?: boolean;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  startFrame,
  lineColor,
  nodeColor,
  glowColor,
  textColor,
  dashed = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  // Node entrance stagger
  const nodeScales = NODES.map((_, i) =>
    spring({
      frame: Math.max(0, f - i * 3),
      fps,
      config: { damping: 14, stiffness: 120 },
    })
  );

  // Edge draw progress
  const edgeProgress = interpolate(f, [4, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Light streak entering from left
  const lightX = interpolate(f, [0, 12], [-300, 2100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const lightOpacity = interpolate(f, [0, 4, 10, 14], [0, 0.5, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Horizontal light streak */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: lightX - 200,
          width: 350,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
          opacity: lightOpacity,
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: lightX - 250,
          width: 400,
          height: 20,
          background: `linear-gradient(90deg, transparent, ${glowColor}33, transparent)`,
          opacity: lightOpacity,
          filter: "blur(10px)",
        }}
      />

      {/* SVG for edges */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {EDGES.map(([a, b], i) => {
          const from = NODES[a];
          const to = NODES[b];
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const endX = from.x + dx * edgeProgress;
          const endY = from.y + dy * edgeProgress;

          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={endX}
              y2={endY}
              stroke={lineColor}
              strokeWidth={1.2}
              strokeDasharray={dashed ? "6 4" : "none"}
              opacity={0.5 + edgeProgress * 0.3}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const scale = nodeScales[i];
        const nodeGlow = 0.5 + Math.sin((f / fps) * 3 + i) * 0.3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: node.x - 28,
              top: node.y - 28,
              width: 56,
              height: 56,
              borderRadius: 14,
              background: nodeColor,
              border: `1.5px solid ${lineColor}`,
              boxShadow: `0 0 ${18 * nodeGlow}px ${glowColor}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
              transform: `scale(${scale})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: textColor,
                letterSpacing: "0.05em",
                opacity: scale,
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Center node glow */}
      <div
        style={{
          position: "absolute",
          left: NODES[0].x - 60,
          top: NODES[0].y - 60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${glowColor}20 0%, transparent 70%)`,
          filter: "blur(15px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default NetworkDiagram;
