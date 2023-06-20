import type { StoneType } from "./stone.d";

type PillarType = 'standard';

interface PillarDef {
  stoneGap: number;
}

type PillarData = StoneType[];

export { PillarType, PillarDef };
