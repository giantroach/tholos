import type { StoneType } from "./stone.d";

type PillarType = 'standard';

interface PillarDef {
  stoneGap: number;
}

type PillarData = {
  stones: StoneType[];
  selectable: boolean[];
  selected: boolean[];
  active: boolean;
}

export { PillarType, PillarDef, PillarData };
