import { MediaSizes } from '../typings/media';

export const sizes = [
  { min_width: 1441, type: 'large' },
  { min_width: 961, type: 'main' },
  { min_width: 640, type: 'medium' },
  { min_width: 440, type: 'small' },
  { min_width: 0, type: 'verysmall' },
] as Array<{ min_width: number; type: MediaSizes }>;

export const orientations = {
  '-1': { rotate: 0, scale: 1 },
  '1': { rotate: 0, scale: 1 },
  '2': { rotate: 0, scale: -1 },
  '3': { rotate: 180, scale: 1 },
  '4': { rotate: 180, scale: -1 },
  '5': { rotate: 90, scale: -1 },
  '6': { rotate: 90, scale: 1 },
  '7': { rotate: -90, scale: -1 },
  '8': { rotate: -90, scale: 1 },
} as Record<string, { rotate: number; scale: number }>;
