import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

/**
 * Scene 5: Cyan glowing cylinder/disc that morphs and zooms.
 * The final scene where objects have merged into a glowing cyan form.
 */
export const CyanCylinderScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 70) return null;

  // Entrance
  const entrance = spring({
    frame: f,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Morph from disc to cylinder (aspect ratio changes)
  const morphProgress = interpolate(f, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const cylinderWidth = interpolate(morphProgress, [0, 1], [180, 120]);
  const cylinderHeight = interpolate(morphProgress, [0, 1], [50, 200]);
  const borderRadius = interpolate(morphProgress, [0, 1], [50, 30]);

  // Subtle rotation
  const rotateY = interpolate(f, [0, 60], [0, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final zoom in
  const finalScale = interpolate(f, [35, 60], [1, 3.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });

  // Final fade
  const finalOpacity = interpolate(f, [50, 65], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin((f / fps) * 3),
    [-1, 1],
    [0.5, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Self-illumination
  const brightness = interpolate(f, [0, 20, 55], [0.8, 1.1, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        opacity: finalOpacity,
      }}
    >
      <div
        style={{
          transform: `rotateY(${rotateY}deg) scale(${entrance * finalScale})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main cylinder body */}
        <div
          style={{
            width: cylinderWidth,
            height: cylinderHeight,
            borderRadius: borderRadius,
            background: `linear-gradient(135deg, #00e5ff 0%, #0097a7 40%, #006978 100%)`,
            boxShadow: `
              0 0 ${40 * glowIntensity}px rgba(0,229,255,0.4),
              0 0 ${80 * glowIntensity}px rgba(0,229,255,0.2),
              0 20px 60px rgba(0,0,0,0.3),
              inset 0 2px 0 rgba(255,255,255,0.5),
              inset 0 -4px 8px rgba(0,0,0,0.3)
            `,
            filter: `brightness(${brightness})`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top highlight */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)",
              borderRadius: `${borderRadius}px ${borderRadius}px 50% 50%`,
            }}
          />

          {/* Horizontal light band */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "-10%",
              right: "-10%",
              height: "15%",
              background:
                "linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)",
              filter: "blur(2px)",
            }}
          />
        </div>

        {/* Floor glow */}
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: "50%",
            transform: "translateX(-50%)",
            width: cylinderWidth * 1.5,
            height: 40,
            background:
              "radial-gradient(ellipse, rgba(0,229,255,0.3) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />
      </div>
    </div>
  );
};

export default CyanCylinderScene;
