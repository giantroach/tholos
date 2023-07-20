import { BoardType, BoardDef, BoardData } from '../type/board.d';
import mainBoard1ImgUrl from '../assets/main-board1.jpg';
// import mainBoard2ImgUrl from '../assets/main-board2.jpg';
import workshopImgUrl from '../assets/workshops.png';

const boardDefs: { [boardType in BoardType]: BoardDef } = {
  main: {
    image: mainBoard1ImgUrl,
    width: '472px',
    height: '544px',
    stonePos: [
      { x: '208px', y: '80px' },
      { x: '300px', y: '120px' },
      { x: '330px', y: '225px' },
      { x: '260px', y: '310px' },
      { x: '155px', y: '310px' },
      { x: '90px', y: '225px' },
      { x: '110px', y: '120px' },
    ],
  },
  workshopW: {
    image: workshopImgUrl,
    width: '229px',
    height: '129px',
    imgTop: 0,
    stonePos: [
      { x: '22px', y: '42px' },
      { x: '86px', y: '42px' },
      { x: '150px', y: '42px' },
    ],
  },
  workshopB: {
    image: workshopImgUrl,
    width: '229px',
    height: '129px',
    imgTop: 129,
    stonePos: [
      { x: '22px', y: '42px' },
      { x: '86px', y: '42px' },
      { x: '150px', y: '42px' },
    ],
  },
};

const defaultMainboardData: BoardData = {
  pillars: [
    {
      type: 'p1',
      stones: ['stoneB'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p2',
      stones: ['stoneW', 'stoneG'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p3',
      stones: ['stoneW', 'stoneG', 'stoneG', 'stoneB', 'stoneW'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p4',
      stones: ['stoneW'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p5',
      stones: ['stoneB'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p6',
      stones: ['stoneG'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p7',
      stones: ['stoneG', 'stoneG'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
  ],
  active: false,
};

const defaultWsWBoardData: BoardData = {
  pillars: [
    {
      stones: ['stoneW'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      stones: ['stoneW'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
  ],
  active: false,
};

const defaultWsBBoardData: BoardData = {
  pillars: [
    {
      stones: ['stoneG'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      stones: ['stoneB'],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
  ],
  active: false,
};

export {
  boardDefs,
  defaultMainboardData,
  defaultWsWBoardData,
  defaultWsBBoardData,
};
