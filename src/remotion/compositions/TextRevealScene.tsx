import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

/**
 * Scene 1: Sequential text replacement with gradient reveal.
 * Only ONE phrase shown at a time, each with gradient left-to-right reveal.
 *
 * Reference timing (at 30fps):
 * Frames 0-9:   "Global payments" gradient reveal then fade
 * Frames 9-14:  "are" appears with gradient reveal then fades
 * Frames 13-18: "are a" appears then fades
 * Frames 17-26: "a pain" reveals and holds (transitions to perspective scene)
 */

interface TextPhase {
  text: string;
  enter: number;     // frame when this text starts appearing
  revealDone: number; // frame when gradient reveal is complete
  exitStart: number;  // frame when fade-out begins
  exitDone: number;   // frame when fully invisible
}

const phases: TextPhase[] = [
  {
    text: "Global payments",
    enter: -3,      // already mid-reveal at frame 0
    revealDone: 5,
    exitStart: 6,
    exitDone: 9,
  },
  {
    text: "are",
    enter: 9,
    revealDone: 12,
    exitStart: 13,
    exitDone: 15,
  },
  {
    text: "are a",
    enter: 14,
    revealDone: 17,
    exitStart: 18,
    exitDone: 20,
  },
  {
    text: "a pain",
    enter: 18,
    revealDone: 22,
    exitStart: 24,  // fades as perspective scene takes over
    exitDone: 27,
  },
];

export const TextRevealScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;

  if (f < 0 || f > 28) return null;

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
      {phases.map((phase, index) => {
        // Skip if not in this phase's active window
        if (f < phase.enter || f > phase.exitDone + 2) return null;

        // Gradient reveal progress (left-to-right mask)
        const revealProgress = interpolate(
          f,
          [phase.enter, phase.revealDone],
          [0, 130],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Fade out opacity
        const fadeOut = interpolate(
          f,
          [phase.exitStart, phase.exitDone],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const maskGradient =
          revealProgress < 130
            ? `linear-gradient(to right, white ${revealProgress - 15}%, transparent ${revealProgress + 20}%)`
            : undefined;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              opacity: fadeOut,
              WebkitMaskImage: maskGradient,
              maskImage: maskGradient,
            }}
          >
            <span
              style={{
                fontSize: 88,
                fontWeight: 500,
                color: "white",
                letterSpacing: "-0.025em",
                whiteSpace: "nowrap",
              }}
            >
              {phase.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TextRevealScene;
