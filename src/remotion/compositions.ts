import { Main } from "./compositions/Main";

// Full composition: intro + brand reveal + features
// Part 1 (F0-165): text reveals, 3D perspective, objects, cylinder
// Part 2 (F148-360): infinity disc, brand reveal, Fast/Global/Affordable features
// Total: 360 frames at 30fps = 12 seconds
export const composition = {
  id: "Main",
  component: Main,
  durationInFrames: 360,
  fps: 30,
  width: 1920,
  height: 1080,
};
