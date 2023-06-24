import type { PillarData } from "./pillar.d";

type BoardType = 'main' | 'workshopW' | 'workshopB';

interface StonePos {
  x: string;
  y: string;
}

interface BoardDef {
  image: string;
  width: string;
  height: string;
  imgTop?: number;
  imgLeft?: number;

  // Tholos exclusive
  stonePos: StonePos[];
}

interface BoardData {
  pillars: PillarData[];
  active: boolean;
}

export { BoardType, BoardDef, StonePos, BoardData };
