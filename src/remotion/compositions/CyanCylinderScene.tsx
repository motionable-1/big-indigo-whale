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
 *
 * Reference timing:
 * Frame 84 (ref 29, 5600ms): Cyan disc appears flat on grid, glowing base
 * Frame 87 (ref 30, 5800ms): Disc morphing upward into cylinder shape
 * Frame 90 (ref 31, 6000ms): Cylinder with metallic cyan finish, lid detail, white base glow
 * Frame 93 (ref 32, 6200ms): Close-up zoomed on cylinder, shows curled/folded detail, vertical orientation
 */
export const CyanCylinderScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 30) return null;

  // Entrance - quick pop
  const entrance = spring({
    frame: f,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Morph from flat disc to tall cylinder
  const morphProgress = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const shapeWidth = interpolate(morphProgress, [0, 1], [200, 100]);
  const shapeHeight = interpolate(morphProgress, [0, 1], [40, 180]);
  const borderRadius = interpolate(morphProgress, [0, 1], [20, 24]);

  // Zoom in for final close-up (ref frames 31-32)
  const finalZoom = interpolate(f, [12, 25], [1, 2.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Slight rotation
  const rotateY = interpolate(f, [0, 25], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowPulse = 0.6 + Math.sin((f / fps) * 4) * 0.4;

  // Brightness ramp
  const brightness = interpolate(f, [0, 8, 20], [0.9, 1.1, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final hold/fade
  const opacity = interpolate(f, [0, 2, 24, 30], [0, 1, 1, 0.7], {
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
        opacity,
      }}
    >
      <div
        style={{
          transform: `rotateY(${rotateY}deg) scale(${entrance * finalZoom})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main cylinder body */}
        <div
          style={{
            width: shapeWidth,
            height: shapeHeight,
            borderRadius,
            background: `linear-gradient(160deg, #4de8e8 0%, #00bcd4 30%, #008fa3 60%, #006070 100%)`,
            boxShadow: `
              0 0 ${35 * glowPulse}px rgba(0,229,255,0.35),
              0 0 ${70 * glowPulse}px rgba(0,229,255,0.15),
              0 15px 50px rgba(0,0,0,0.4),
              inset 0 2px 0 rgba(255,255,255,0.5),
              inset 0 -3px 6px rgba(0,0,0,0.3)
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
              height: "35%",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              borderRadius: `${borderRadius}px ${borderRadius}px 50% 50%`,
            }}
          />

          {/* Mid-section horizontal light band (lid detail from ref frame 31) */}
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "-5%",
              right: "-5%",
              height: "3px",
              background: "rgba(0,0,0,0.25)",
              opacity: morphProgress,
            }}
          />

          {/* Secondary light reflection */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "15%",
              background:
                "linear-gradient(180deg, transparent, rgba(255,255,255,0.15), transparent)",
              filter: "blur(2px)",
              opacity: morphProgress,
            }}
          />

          {/* Curved fold detail (ref frame 32 - curled incision look) */}
          {morphProgress > 0.7 && (
            <div
              style={{
                position: "absolute",
                bottom: "25%",
                left: "10%",
                right: "10%",
                height: "20%",
                borderRadius: "0 0 40% 40%",
                background:
                  "linear-gradient(180deg, rgba(0,50,60,0.4) 0%, rgba(0,200,220,0.2) 100%)",
                opacity: interpolate(morphProgress, [0.7, 1], [0, 0.8], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          )}
        </div>

        {/* Base glow on grid */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: "50%",
            transform: "translateX(-50%)",
            width: shapeWidth * 1.8,
            height: 50,
            background:
              "radial-gradient(ellipse, rgba(0,229,255,0.35) 0%, rgba(0,229,255,0.1) 40%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />
      </div>
    </div>
  );
};

export default CyanCylinderScene;
