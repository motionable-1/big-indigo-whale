import { Main } from "./compositions/Main";

// Single composition configuration
// Total: ~120 frames at 30fps = 4 seconds
// Reference video is 6.4s (32 frames × 200ms), mapped to 93 frames + buffer
export const composition = {
  id: "Main",
  component: Main,
  durationInFrames: 120,
  fps: 30,
  width: 1920,
  height: 1080,
};
