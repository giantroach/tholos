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
  turnInit: {
    message:
      'Choose and take stones from query or choose and place a stone from your workshop.',
    buttonTypes: [],
  },
  choosePillar: {
    message: 'Choose a column to place your stone.',
    buttonTypes: ['cancel'],
  },
  takeActionConfirm: {
    message: 'Do you like to perform Bonus Action?',
    buttonTypes: ['takeAction', 'noAction'],
  },
  takeOrnamentActionConfirm: {
    message: 'Do you like to perform Bonus Action?',
    buttonTypes: ['takeActionColumn', 'takeActionOrnament', 'noAction'],
  },
  noValidTarget: {
    message: 'No valid target.',
    buttonTypes: ['noValidTarget'],
  },
  chooseTarget1a: {
    message: 'Choose a gray stone to move from.',
    buttonTypes: ['cancel'],
  },
  chooseTarget1b: {
    message: 'Choose a white stone to move from.',
    buttonTypes: ['cancel'],
  },
  chooseTarget1c: {
    message: 'Choose a stone to take away from the board.',
    buttonTypes: ['cancel'],
  },
  chooseTarget1d: {
    message: 'Choose a stone to take from the quarry.',
    buttonTypes: ['cancel'],
  },
  chooseTarget1e: {
    message: "Choose a stone to take from the opponent's workshop.",
    buttonTypes: ['cancel'],
  },
  chooseTarget1f: {
    message: 'Choose another stone in your workshop to place.',
    buttonTypes: ['cancel'],
  },
  chooseTarget1g: {
    message: 'Choose a black stone to move from.',
    buttonTypes: ['cancel'],
  },
  chooseTarget2a: {
    message: 'Choose a column to move to.',
    buttonTypes: ['cancel'],
  },
  chooseTarget2b: {
    message: 'Choose a column to move to.',
    buttonTypes: ['cancel'],
  },
  chooseTarget2f: {
    message: 'Choose a column to move to.',
    buttonTypes: ['cancel'],
  },
  chooseTarget2g: {
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
