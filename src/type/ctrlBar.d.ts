import { CtrlButtonData, ButtonType } from './ctrlButton.d';

type BarType =
  | ''
  | 'cancelable'
  | 'choosePillar'
  | 'takeActionConfirm'
  | 'noValidTarget'
  | 'chooseTarget1a'
  | 'chooseTarget1d'
  | 'chooseTarget2a'
  | 'submitActionConfirm';

interface CtrlBarDef {
  message: string;
  buttonTypes: ButtonType[];
}

interface CtrlBarDefs {
  [BarType: string]: CtrlBarDef;
}

interface CtrlBarData {
  type: BarType;
}

export { BarType, CtrlBarDef, CtrlBarDefs, CtrlBarData };
