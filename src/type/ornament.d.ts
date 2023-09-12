type OrnamentType = 'standard' | 'o1' | 'o2' | 'o3' | 'o4' | 'o5' | 'o6' | 'o7';

interface OrnamentHintDef {
  image: string | null;
  text: string;
  width: string;
  height: string;
  imgWidth: string;
  imgHeight: string;
  imgTop?: number;
  imgLeft?: number;
}

interface OrnamentDef {
  image: string | null;
  width: string;
  height: string;
  imgTop?: number;
  imgLeft?: number;
  hint?: OrnamentHintDef;
}

export { OrnamentType, OrnamentDef, OrnamentHintDef };
