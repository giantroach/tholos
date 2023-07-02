import { QuarryData, QuarryCarryDialogDef } from '../type/quarry.d';

const quarryCarryDialogDef: QuarryCarryDialogDef = {
  text: 'How many stones?',
};

const defaultQuarryData: QuarryData = {
  stones: [13, 10, 13],
  selected: [false, false, false],
  carry: 0,
  carryMax: 0,
  active: false,
};

export { quarryCarryDialogDef, defaultQuarryData };
