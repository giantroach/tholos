type ButtonType = "cancel" | "submit";

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
  [cardType: string]: {
    active?: boolean;
    display?: boolean;
  };
}

export { ButtonType, ButtonSizeDef, CtrlButtonDef, CtrlButtonData };
