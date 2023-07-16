import { CtrlButtonData, ButtonType } from './ctrlButton.d';

type BarType = '' | 'cancelable' | 'takeActionConfirm' | 'submitActionConfirm';

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
