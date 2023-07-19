import { BarType, CtrlBarData, CtrlBarDef } from '../type/ctrlBar.d';

const ctrlBarDefs: { [barType in BarType]: CtrlBarDef } = {
  '': {
    message: '',
    buttonTypes: [],
  },
  cancelable: {
    message: '',
    buttonTypes: ['cancel'],
  },
  choosePillar: {
    message: 'Choose a column to place your stone.',
    buttonTypes: ['cancel'],
  },
  takeActionConfirm: {
    message: 'Do you like to perform Bonus Action?',
    buttonTypes: ['takeAction', 'noAction'],
  },
  noValidTarget: {
    message: 'No valid target.',
    buttonTypes: ['noValidTarget'],
  },
  chooseTarget1a: {
    message: 'Choose a stone to move from.',
    buttonTypes: ['cancel'],
  },
  chooseTarget1d: {
    message: 'Choose a stone to take.',
    buttonTypes: ['cancel'],
  },
  chooseTarget2a: {
    message: 'Choose a column to move to.',
    buttonTypes: ['cancel'],
  },
  submitActionConfirm: {
    message: "Press 'Submit' to confirm",
    buttonTypes: ['submit', 'cancel'],
  },
};

const defaultCtrlBarData: CtrlBarData = {
  type: '',
};

export { ctrlBarDefs, defaultCtrlBarData };
