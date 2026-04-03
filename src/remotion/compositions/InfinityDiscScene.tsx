import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

/**
 * Scene 6: Zoomed cyan cylinder with floating infinity disc.
 * Reference frames 33-35: zoomed-in cyan column + metallic disc with ∞ symbol.
 */
export const InfinityDiscScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 20) return null;

  const entrance = spring({
    frame: f,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const floatY = Math.sin((f / fps) * 3) * 8;
  const floatRotate = Math.sin((f / fps) * 2) * 3;
  const glowPulse = 0.7 + Math.sin((f / fps) * 5) * 0.3;

  // Fade-out crossfades with BrandRevealScene entrance
  const opacity = interpolate(f, [0, 2, 10, 18], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoom = interpolate(f, [0, 18], [2.6, 3.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "800px",
        opacity,
      }}
    >
      {/* Zoomed cyan bg blur */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 500,
          borderRadius: 60,
          background: "linear-gradient(170deg, #5af0f0 0%, #00ccd4 25%, #009aa8 55%, #005060 100%)",
          filter: "blur(20px) brightness(0.8)",
          transform: `scale(${zoom * 0.9})`,
          opacity: 0.5,
        }}
      />

      {/* Cylinder body */}
      <div
        style={{
          width: 130,
          height: 220,
          borderRadius: 28,
          background: "linear-gradient(160deg, #4de8e8 0%, #00bcd4 30%, #008fa3 60%, #006070 100%)",
          boxShadow: `0 0 ${40 * glowPulse}px rgba(0,229,255,0.3), 0 0 ${80 * glowPulse}px rgba(0,229,255,0.12), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.3)`,
          transform: `scale(${entrance * zoom}) rotateY(8deg)`,
          transformStyle: "preserve-3d",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)",
            borderRadius: "28px 28px 50% 50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: 0,
            right: 0,
            height: 3,
            background: "rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* Floating infinity disc */}
      <div
        style={{
          position: "absolute",
          transform: `translateY(${floatY - 20}px) rotateZ(${floatRotate}deg) scale(${entrance})`,
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 30%, #a0a0a8 60%, #808088 100%)",
            boxShadow: `0 0 ${25 * glowPulse}px rgba(200,220,255,0.3), 0 4px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 6px rgba(0,0,0,0.2)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 300,
              color: "#1a1a2e",
              textShadow: "0 1px 2px rgba(255,255,255,0.3)",
              lineHeight: 1,
              marginTop: -4,
            }}
          >
            ∞
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: -10,
            left: -10,
            right: -10,
            bottom: -10,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,220,255,0.15) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default InfinityDiscScene;
