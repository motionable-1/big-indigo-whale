import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

/**
 * Scene 2: "a pain" text with 3D perspective rotation + camera fly-through.
 * The text gets perspective rotation and the camera zooms through.
 */
export const PerspectiveTextScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;

  if (f < 0 || f > 55) return null;

  // Phase 1: "a pain" with growing 3D perspective (frames 0-25)
  // Phase 2: Camera flies through/past text (frames 25-55)

  // Text opacity - visible then fades during fly-through
  const textOpacity = interpolate(f, [0, 4, 30, 42], [1, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3D perspective rotation - text tilts into perspective
  const rotateX = interpolate(f, [0, 30], [0, 35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const rotateY = interpolate(f, [0, 30], [0, -15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Camera zoom - we zoom way in during fly-through
  const scale = interpolate(f, [0, 15, 45], [1, 1.2, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });

  // Camera pan - move left as we zoom through
  const translateX = interpolate(f, [0, 15, 45], [0, -50, -800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });

  const translateY = interpolate(f, [0, 15, 45], [0, 20, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });

  // Vertical gradient on text (white top, gray bottom)
  const textGradient =
    "linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #888888 100%)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1200px",
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
            fontSize: 90,
            fontWeight: 600,
            color: "transparent",
            letterSpacing: "-0.02em",
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
