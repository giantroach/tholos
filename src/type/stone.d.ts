type StoneType = 'stoneB' | 'stoneW' | 'stoneG';

interface StoneDef {
  image: string;
  width: string;
  height: string;
  imgTop?: number;
  imgLeft?: number;
}

export { StoneType, StoneDef };
