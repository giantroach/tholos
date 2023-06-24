type StoneType = 'stoneB' | 'stoneW' | 'stoneG' | 'none';

interface StoneDef {
  image: string | null;
  width: string;
  height: string;
  imgTop?: number;
  imgLeft?: number;
}

export { StoneType, StoneDef };
