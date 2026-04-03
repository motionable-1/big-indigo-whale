import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

/**
 * Vertical tree network diagram with 90-degree elbow connectors.
 * 5 rounded-square nodes, NO labels. Dark textured interiors, thin borders.
 * Used by Global (blue/cyan, solid) and Affordable (orange/yellow, dashed).
 *
 * Layout (vertical tree):
 *   [N0] top-center
 *     |
 *   [N1] mid-center  <-- light streak enters here from left
 *     |
 *   [N2] bottom-center
 *    / \
 *  [N3] [N4]  (branched left, stacked)
 *
 * Lines exit right from N0 and N2 with 90-degree elbows.
 */

interface TreeNode {
  x: number;
  y: number;
}

// Positions for 1920x1080
const NODES: TreeNode[] = [
  { x: 1020, y: 240 },   // N0: top-center
  { x: 1020, y: 440 },   // N1: mid-center (streak target)
  { x: 1020, y: 640 },   // N2: bottom-center
  { x: 780, y: 720 },    // N3: branch bottom-left upper
  { x: 780, y: 880 },    // N4: branch bottom-left lower
];

const NODE_SIZE = 56;
const NODE_RADIUS = 12;

interface NetworkDiagramProps {
  startFrame: number;
  lineColor: string;
  nodeColor: string;
  glowColor: string;
  dashed?: boolean;
  /** Progress 0-1 for nodes lighting up with glow gradient */
  litNodes?: boolean;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  startFrame,
  lineColor,
  nodeColor,
  glowColor,
  dashed = false,
  litNodes = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  // Node entrance stagger
  const nodeScales = NODES.map((_, i) =>
    spring({
      frame: Math.max(0, f - i * 2),
      fps,
      config: { damping: 14, stiffness: 120 },
    })
  );

  // Edge draw progress
  const edgeProgress = interpolate(f, [3, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Light streak from left entering N1
  const streakX = interpolate(f, [0, 12], [-300, NODES[1].x - NODE_SIZE / 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const streakOpacity = interpolate(f, [0, 3, 10, 16], [0, 0.8, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Streak flare at impact point
  const flareOpacity = interpolate(f, [8, 11, 14, 18], [0, 1, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dashProps = dashed ? { strokeDasharray: "8 5" } : {};
  const lineOpacity = 0.4 + edgeProgress * 0.4;

  // Build elbow paths
  const paths = buildElbowPaths(edgeProgress);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Light streak entering from left to N1 */}
      <div
        style={{
          position: "absolute",
          top: NODES[1].y - 2,
          left: 0,
          width: Math.max(0, streakX + 30),
          height: 4,
          background: `linear-gradient(90deg, transparent, rgba(80,40,160,0.2) 30%, ${glowColor}88 80%, white 100%)`,
          opacity: streakOpacity,
          filter: "blur(1px)",
        }}
      />
      {/* Streak bloom */}
      <div
        style={{
          position: "absolute",
          top: NODES[1].y - 20,
          left: 0,
          width: Math.max(0, streakX + 60),
          height: 44,
          background: `linear-gradient(90deg, transparent, ${glowColor}10 40%, ${glowColor}30 100%)`,
          opacity: streakOpacity,
          filter: "blur(14px)",
        }}
      />
      {/* Impact flare on N1 */}
      <div
        style={{
          position: "absolute",
          left: NODES[1].x - 40,
          top: NODES[1].y - 40,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, white 0%, ${glowColor}60 30%, transparent 70%)`,
          opacity: flareOpacity,
          filter: "blur(8px)",
        }}
      />

      {/* SVG for elbow connector lines */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={lineColor}
            strokeWidth={1.5}
            opacity={lineOpacity}
            {...dashProps}
          />
        ))}
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const scale = nodeScales[i];
        const isLit = litNodes && scale > 0.5;
        const nodeGlow = 0.5 + Math.sin((f / fps) * 3 + i) * 0.3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: node.x - NODE_SIZE / 2,
              top: node.y - NODE_SIZE / 2,
              width: NODE_SIZE,
              height: NODE_SIZE,
              borderRadius: NODE_RADIUS,
              background: isLit
                ? `linear-gradient(135deg, ${glowColor}cc 0%, ${glowColor}88 50%, ${nodeColor} 100%)`
                : nodeColor,
              border: `1.5px solid ${lineColor}`,
              boxShadow: isLit
                ? `0 0 ${20 * nodeGlow}px ${glowColor}50, inset 0 1px 0 rgba(255,255,255,0.2)`
                : "none",
              transform: `scale(${scale})`,
              overflow: "hidden",
            }}
          >
            {/* Fine internal texture (micro-dot grid) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.15,
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 0.5px, transparent 0.5px)`,
                backgroundSize: "6px 6px",
              }}
            />
            {/* Highlight spot if lit */}
            {isLit && (
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(255,255,255,0.7) 0%, ${glowColor}40 50%, transparent 100%)`,
                  filter: "blur(3px)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Build SVG path strings for 90-degree elbow connectors between nodes.
 */
function buildElbowPaths(progress: number): string[] {
  const paths: string[] = [];
  const p = progress;

  // N0→N1 vertical
  const n0 = NODES[0], n1 = NODES[1], n2 = NODES[2], n3 = NODES[3], n4 = NODES[4];
  const hs = NODE_SIZE / 2;

  // Vertical: N0 bottom → N1 top
  const y0b = n0.y + hs;
  const y1t = n1.y - hs;
  const midY01 = y0b + (y1t - y0b) * p;
  paths.push(`M${n0.x},${y0b} L${n0.x},${midY01}`);

  // Vertical: N1 bottom → N2 top
  const y1b = n1.y + hs;
  const y2t = n2.y - hs;
  const midY12 = y1b + (y2t - y1b) * p;
  paths.push(`M${n1.x},${y1b} L${n1.x},${midY12}`);

  // N2 → N3 (elbow: go left then down)
  // From N2 left side → horizontal to N3.x → vertical down to N3
  const x2l = n2.x - hs;
  const targetX = n3.x;
  const elbowX = x2l - (x2l - targetX) * p;
  const y3t = n3.y - hs;
  const elbowY3 = n2.y + (y3t - n2.y) * p;
  paths.push(`M${x2l},${n2.y} L${elbowX},${n2.y} L${elbowX},${elbowY3}`);

  // N3 → N4 vertical
  const y3b = n3.y + hs;
  const y4t = n4.y - hs;
  const midY34 = y3b + (y4t - y3b) * p;
  paths.push(`M${n3.x},${y3b} L${n3.x},${midY34}`);

  // N0 → right exit (elbow: right then down then right off-screen)
  const x0r = n0.x + hs;
  const elbowDownY = n0.y + 80 * p;
  paths.push(`M${x0r},${n0.y} L${x0r + 120 * p},${n0.y} L${x0r + 120 * p},${elbowDownY}`);

  // N2 → right exit (elbow: right then down)
  const x2r = n2.x + hs;
  const elbowDownY2 = n2.y + 100 * p;
  paths.push(`M${x2r},${n2.y} L${x2r + 140 * p},${n2.y} L${x2r + 140 * p},${elbowDownY2}`);

  return paths;
}

export default NetworkDiagram;
