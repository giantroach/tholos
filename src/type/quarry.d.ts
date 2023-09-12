interface QuarryCarryDialogDef {
  text: string;
}

interface QuarryData {
  stones: number[];
  selected: boolean[];
  carry: number;
  carryMax: number;
  active: boolean;
}

export { QuarryCarryDialogDef, QuarryData };
