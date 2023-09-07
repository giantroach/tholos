import { CtrlButtonData, ButtonType } from './ctrlButton.d';

type BarType =
  | ''
  | 'cancelable'
  | 'turnInit'
  | 'choosePillar'
  | 'takeActionConfirm'
  | 'noValidTarget'
  | 'chooseTarget1a'
  | 'chooseTarget1b'
  | 'chooseTarget1c'
  | 'chooseTarget1d'
  | 'chooseTarget1e'
  | 'chooseTarget1f'
  | 'chooseTarget1g'
  | 'chooseTarget1o6'
  | 'chooseTarget2a'
  | 'chooseTarget2b'
  | 'chooseTarget2f'
  | 'chooseTarget2g'
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
