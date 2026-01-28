export interface LensMemorySetting {
  aspectRatio: number;
  memorySlot: number;
  name: string;
}

const MAX_RATIO_DIFF = 0.05;

const LENS_MEMORY_SETTINGS: LensMemorySetting[] = [
  { aspectRatio: 1.78, memorySlot: 1, name: '16:9' },     // HD/HDTV standard
  { aspectRatio: 2.39, memorySlot: 2, name: '2.39:1' },   // Modern cinema widescreen
  //{ aspectRatio: 1.85, memorySlot: 3, name: '1.85:1' },   // US theatrical widescreen
  //{ aspectRatio: 1.33, memorySlot: 4, name: '4:3' },      // Classic TV/Academy ratio
];

export function GetClosestLensMemorySetting(aspectRatio: number): LensMemorySetting {
  const ordered = LENS_MEMORY_SETTINGS.slice().sort((a,b) => a.aspectRatio - b.aspectRatio);
  let res = ordered[ordered.length - 1];

  for (let i=ordered.length - 2; i>=0; i--) {
    const setting = ordered[i];

    const cmp = aspectRatio - MAX_RATIO_DIFF;
    console.log(`Comparing aspect ratios: input=${aspectRatio.toFixed(2)} cmp=${cmp.toFixed(2)} setting=${setting.aspectRatio.toFixed(2)}`,{setting});

    if (setting.aspectRatio < cmp) {
      break;
    }
    res = setting;
  }

  return res;
}