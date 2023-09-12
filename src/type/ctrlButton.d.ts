type ButtonType =
  | 'cancel'
  | 'submit'
  | 'takeAction'
  | 'noAction'
  | 'noValidTarget'
  | 'takeActionColumn'
  | 'takeActionOrnament';

interface ButtonSizeDef {
  width: string;
  height: string;
  radius: string;
}

interface CtrlButtonDef {
  size: ButtonSizeDef;
  label: string;
  textColor: string;
  background: string;
  border: string;
}

interface CtrlButtonData {
  [buttonType: string]: {
    active?: boolean;
    display?: boolean;
  };
}

export { ButtonType, ButtonSizeDef, CtrlButtonDef, CtrlButtonData };
