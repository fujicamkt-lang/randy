export interface GameAssets {
  background: string;
  prize: string;
}

export interface BoxState {
  id: number;
  isOpen: boolean;
  isWinner: boolean;
  contentEmoji: string; // Emoji for non-winner items
  contentLabel: string; // Label for non-winner items
  // Visual properties for scattered look
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  rotation: number; // Degrees
  scale: number; // Depth effect
  zIndex: number;
  delay: number; // Animation delay
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING', // Generating assets
  PLAYING = 'PLAYING',
  ERROR = 'ERROR',
}