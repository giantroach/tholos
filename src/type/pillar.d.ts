import type { StoneType } from './stone.d';

type PillarType = 'standard' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';

interface PillarHintDef {
  image: string | null;
  text: string;
  width: string;
  height: string;
  imgWidth: string;
  imgHeight: string;
  imgTop?: number;
  imgLeft?: number;
}

interface PillarDef {
  stoneGap: number;
  hint?: PillarHintDef;
}

type PillarData = {
  type?: PillarType;
  stones: StoneType[];
  ghosts: StoneType[];
  selectable: boolean[];
  selected: boolean[];
  active: boolean;
};

export { PillarType, PillarDef, PillarHintDef, PillarData };
