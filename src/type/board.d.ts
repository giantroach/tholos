import type { PillarData } from "./pillar.d";
import type { OrnamentType } from "./ornament.d";

type BoardType = 'main' | 'main2' | 'workshopW' | 'workshopB';

interface StonePos {
  x: string;
  y: string;
  zIndex?: number;
}

interface OrnamentPos {
  x: string;
  y: string;
  zIndex?: number;
  rotate: number;
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
  ornamentPos?: OrnamentPos[];
}

interface BoardData {
  pillars: PillarData[];
  ornaments?: OrnamentType[];
  active: boolean;
}

export { BoardType, BoardDef, StonePos, BoardData };
