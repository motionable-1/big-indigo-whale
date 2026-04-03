import { Main } from "./compositions/Main";

// Single composition configuration
// Text scenes now have 300ms breathing room per phrase
// Total: ~160 frames at 30fps ≈ 5.3 seconds
export const composition = {
  id: "Main",
  component: Main,
  durationInFrames: 165,
  fps: 30,
  width: 1920,
  height: 1080,
};
