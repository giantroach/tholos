import type { PillarData } from "./pillar.d";

type BoardType = 'main' | 'main2' | 'workshopW' | 'workshopB';

interface StonePos {
  x: string;
  y: string;
  zIndex?: number;
}

interface BoardDef {
  image: string;
  width: string;
  height: string;
  imgTop?: number;
  imgLeft?: number;
  marginTop?: string;

  // Tholos exclusive
  stonePos: StonePos[];
  ornamentPos?: StonePos[];
}

interface BoardData {
  pillars: PillarData[];
  active: boolean;
}

export { BoardType, BoardDef, StonePos, BoardData };
