import {
  ButtonType,
  CtrlButtonDef,
  CtrlButtonData,
} from '../type/ctrlButton.d';

const ctrlButtonDefs: { [buttonType in ButtonType]: CtrlButtonDef } = {
  cancel: {
    label: 'Cancel',
    size: { width: '138px', height: '30px', radius: '15px' },
    textColor: 'white',
    background: '#3d50ff',
    border: '2px solid #adc1ff',
  },
  submit: {
    label: 'Submit',
    size: { width: '138px', height: '30px', radius: '15px' },
    textColor: 'white',
    background: '#ff621f',
    border: '2px solid #ffb571',
  },
  takeAction: {
    label: 'Take Action',
    size: { width: '138px', height: '30px', radius: '15px' },
    textColor: 'white',
    background: '#ff621f',
    border: '2px solid #ffb571',
  },
  noAction: {
    label: 'No Action',
    size: { width: '138px', height: '30px', radius: '15px' },
    textColor: 'white',
    background: '#3d50ff',
    border: '2px solid #adc1ff',
  },
  noValidTarget: {
    label: 'OK',
    size: { width: '138px', height: '30px', radius: '15px' },
    textColor: 'white',
    background: '#ff621f',
    border: '2px solid #ffb571',
  },
  takeActionColumn: {
    label: 'Take Action (Column)',
    size: { width: '200px', height: '30px', radius: '15px' },
    textColor: 'white',
    background: '#ff621f',
    border: '2px solid #ffb571',
  },
  takeActionOrnament: {
    label: 'Take Action (Ornament)',
    size: { width: '200px', height: '30px', radius: '15px' },
    textColor: 'white',
    background: '#ff621f',
    border: '2px solid #ffb571',
  },
};

const defaultCtrlButtonData: CtrlButtonData = {
  submit: {
    active: true,
    display: false,
  },
  cancel: {
    active: true,
    display: false,
  },
};

export { ctrlButtonDefs, defaultCtrlButtonData };
