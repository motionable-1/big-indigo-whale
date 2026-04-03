import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Scene 2: "a pain" text with 3D perspective rotation + camera fly-through.
 *
 * Reference timing:
 * Frame 27 (ref frame 9, 1600ms): "a pain" holding flat with vertical gradient
 * Frame 30 (ref frame 10, 1800ms): slight 3D tilt starting, vertical gradient (white top, gray bottom)
 * Frame 33 (ref frame 11, 2000ms): moderate 3D rotation backward (rotateX)
 * Frame 36 (ref frame 12, 2200ms): heavy rotateY ~35-45deg, camera zooming in close
 * Frame 39 (ref frame 13, 2400ms): extreme close-up on "pain", camera past text
 * Frame 42 (ref frame 14-15, 2600-2800ms): still zoomed on "pain" as 3D object on grid
 * Frame 45 (ref frame 16, 3000ms): text dissolved, just grid + white glow
 */
export const PerspectiveTextScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;

  if (f < 0 || f > 22) return null;

  // Text opacity - fades out as we zoom way past it
  const textOpacity = interpolate(f, [0, 2, 16, 20], [1, 1, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // rotateX - text tilts backward (like looking up at text laying on ground)
  const rotateX = interpolate(f, [0, 4, 12], [0, 15, 45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // rotateY - text rotates on Y axis (strong by frame 12 ref = f=9)
  const rotateY = interpolate(f, [0, 4, 12], [0, -8, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Camera zoom - extreme zoom through the text
  const scale = interpolate(f, [0, 6, 18], [1, 2, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });

  // Camera pan
  const translateX = interpolate(f, [0, 6, 18], [0, -60, -600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });

  const translateY = interpolate(f, [0, 6, 18], [0, 30, 250], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });

  // Vertical gradient on text (white top → gray bottom) matching reference
  const textGradient =
    "linear-gradient(180deg, #ffffff 0%, #ffffff 30%, #999999 70%, #555555 100%)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "800px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformStyle: "preserve-3d",
          opacity: textOpacity,
        }}
      >
        <span
          style={{
            fontSize: 88,
            fontWeight: 500,
            color: "transparent",
            letterSpacing: "-0.025em",
            whiteSpace: "nowrap",
            backgroundImage: textGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          a pain
        </span>
      </div>
    </div>
  );
};

export default PerspectiveTextScene;
