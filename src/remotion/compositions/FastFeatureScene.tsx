import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";

/**
 * Scene 8: "Fast." feature showcase with purple lightning theme.
 *
 * Reference frames 47-50:
 * - "Fast." in bold italic white text with purple glow
 * - Lightning bolt icon, purple energy streak
 * - Purple scanline/grid background
 */
export const FastFeatureScene: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  if (f < 0 || f > 34) return null;

  const textEntrance = spring({
    frame: f,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const boltEntrance = spring({
    frame: Math.max(0, f - 3),
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const streakX = interpolate(f, [2, 14], [-200, 2200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const glowPulse = 0.6 + Math.sin((f / fps) * 6) * 0.4;

  const opacity = interpolate(f, [0, 2, 26, 34], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const streakOpacity = interpolate(f, [2, 6, 12, 16], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity, overflow: "hidden" }}>
      {/* Purple scanlines bg */}
      <PurpleScanlines frame={f} />

      {/* Center purple glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(130,50,220,0.2) 0%, rgba(90,20,180,0.08) 40%, transparent 70%)",
          opacity: glowPulse,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Speed streak beam */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: streakX - 300,
          width: 400,
          height: 3,
          background: "linear-gradient(90deg, transparent, rgba(160,80,255,0.6), rgba(200,130,255,0.9), rgba(160,80,255,0.6), transparent)",
          filter: "blur(2px)",
          opacity: streakOpacity,
        }}
      />

      {/* Streak glow halo */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: streakX - 400,
          width: 500,
          height: 30,
          background: "linear-gradient(90deg, transparent, rgba(140,60,240,0.15), transparent)",
          filter: "blur(15px)",
          opacity: streakOpacity,
        }}
      />

      {/* "Fast." text + bolt */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            transform: `translateX(${(1 - textEntrance) * -50}px)`,
          }}
        >
          {/* Lightning bolt icon */}
          <div
            style={{
              transform: `scale(${boltEntrance}) rotate(${(1 - boltEntrance) * -20}deg)`,
              filter: `drop-shadow(0 0 ${15 * glowPulse}px rgba(160,80,255,0.6))`,
            }}
          >
            <svg width="52" height="62" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
              <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" fill="url(#boltGrad)" stroke="rgba(200,150,255,0.4)" strokeWidth={0.5} />
              <defs>
                <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e0b0ff" />
                  <stop offset="50%" stopColor="#b060ff" />
                  <stop offset="100%" stopColor="#8020e0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <span
            style={{
              fontSize: 110,
              fontWeight: 700,
              fontStyle: "italic",
              color: "white",
              letterSpacing: "-0.03em",
              textShadow: `0 0 30px rgba(160,80,255,${0.3 * glowPulse}), 0 0 60px rgba(130,40,220,${0.15 * glowPulse})`,
              lineHeight: 1,
            }}
          >
            Fast.
          </span>
        </div>
      </div>

      {/* Energy particles */}
      <EnergyParticles frame={f} fps={fps} />
    </div>
  );
};

const PurpleScanlines: React.FC<{ frame: number }> = ({ frame }) => {
  const offset = (frame * 3) % 8;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.06 }}>
      {Array.from({ length: 135 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: i * 8 + offset,
            height: 1,
            background: i % 4 === 0 ? "rgba(140,60,240,0.8)" : "rgba(255,255,255,0.3)",
          }}
        />
      ))}
    </div>
  );
};

const EnergyParticles: React.FC<{ frame: number; fps: number }> = ({ frame: f, fps }) => {
  const time = f / fps;
  const particles = React.useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 400 + ((i * 210) % 1100),
        y: 250 + ((i * 170) % 580),
        speedX: (i % 2 === 0 ? 1 : -1) * (2 + i * 0.5),
        speedY: (i % 3 === 0 ? 1 : -1) * (1.5 + i * 0.3),
        phase: i * 0.8,
        size: 2 + (i % 3),
      })),
    []
  );

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.3 }}>
      {particles.map((p) => {
        const x = p.x + Math.sin(time * p.speedX + p.phase) * 40;
        const y = p.y + Math.cos(time * p.speedY + p.phase) * 30;
        const pOp = 0.3 + Math.sin(time * 3 + p.phase) * 0.3;
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "rgba(180,120,255,0.8)",
              boxShadow: "0 0 6px rgba(160,80,255,0.5)",
              opacity: pOp,
            }}
          />
        );
      })}
    </div>
  );
};

export default FastFeatureScene;
