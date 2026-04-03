import React from "react";
import {
  useCurrentFrame,
  interpolate,
} from "remotion";

/**
 * Scene 1: Sequential word reveal with gradient fade.
 * "Global payments" → "are" → "a pain"
 * Each word fades in with a left-to-right gradient mask effect.
 */
export const TextRevealScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;

  if (f < 0) return null;

  // Timeline (in frames at 30fps):
  // 0-24: "Global payments" fades in (0-800ms)
  // 12-30: "are" appears below/replaces (400-1000ms)
  // 24-42: "are a" → "a pain" sequence (800-1400ms)
  // 42-54: "a pain" holds with subtle gradient (1400-1800ms)

  // Words and their timing
  const words = [
    { text: "Global payments", start: 0, end: 20, fadeIn: 8, fadeOut: 4 },
    { text: "are", start: 16, end: 32, fadeIn: 6, fadeOut: 4 },
    { text: "a pain", start: 28, end: 60, fadeIn: 8, fadeOut: 0 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {words.map((word, index) => {
        if (f < word.start || f > word.end + 10) return null;

        // Fade in progress
        const fadeInProgress = interpolate(
          f,
          [word.start, word.start + word.fadeIn],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Fade out progress
        const fadeOutProgress =
          word.fadeOut > 0
            ? interpolate(f, [word.end - word.fadeOut, word.end], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        const opacity = fadeInProgress * fadeOutProgress;

        // Gradient mask for text reveal (left to right)
        const gradientProgress = interpolate(
          f,
          [word.start, word.start + word.fadeIn + 4],
          [0, 100],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const maskGradient = `linear-gradient(to right, white ${gradientProgress - 10}%, transparent ${gradientProgress + 30}%)`;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              opacity,
              WebkitMaskImage: gradientProgress < 100 ? maskGradient : "none",
              maskImage: gradientProgress < 100 ? maskGradient : "none",
            }}
          >
            <span
              style={{
                fontSize: 90,
                fontWeight: 600,
                color: "white",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {word.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TextRevealScene;
