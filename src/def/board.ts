import { BoardType, BoardDef, BoardData } from '../type/board.d';
import mainBoard1ImgUrl from '../assets/main-board1.jpg';
import mainBoard2ImgUrl from '../assets/main-board2.jpg';
// import mainBoard2ImgUrl from '../assets/main-board2.jpg';
import workshopImgUrl from '../assets/workshops.png';

const boardDefs: { [boardType in BoardType]: BoardDef } = {
  main: {
    image: mainBoard1ImgUrl,
    width: '472px',
    height: '544px',
    stonePos: [
      { x: '208px', y: '80px', zIndex: 100 },
      { x: '300px', y: '120px', zIndex: 200 },
      { x: '330px', y: '225px', zIndex: 300 },
      { x: '260px', y: '310px', zIndex: 400 },
      { x: '155px', y: '310px', zIndex: 300 },
      { x: '90px', y: '225px', zIndex: 200 },
      { x: '110px', y: '120px', zIndex: 100 },
    ],
  },
  main2: {
    image: mainBoard2ImgUrl,
    width: '472px',
    height: '544px',
    marginTop: '80px',
    stonePos: [
      { x: '208px', y: '20px', zIndex: 100 },
      { x: '348px', y: '88px', zIndex: 200 },
      { x: '384px', y: '240px', zIndex: 300 },
      { x: '284px', y: '364px', zIndex: 400 },
      { x: '130px', y: '364px', zIndex: 300 },
      { x: '30px', y: '240px', zIndex: 200 },
      { x: '66px', y: '88px', zIndex: 100 },
    ],
    ornamentPos: [
      { x: '189px', y: '106px', zIndex: 100, rotate: 0 },
      { x: '244px', y: '132px', zIndex: 200, rotate: 51 },
      { x: '259px', y: '195px', zIndex: 300, rotate: 102 },
      { x: '220px', y: '244px', zIndex: 400, rotate: 153 },
      { x: '163px', y: '249px', zIndex: 300, rotate: -153 },
      { x: '114px', y: '192px', zIndex: 200, rotate: -102 },
      { x: '128px', y: '128px', zIndex: 100, rotate: -51 },
    ]
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
      // stones: ['stoneG'],
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p2',
      // stones: ['stoneW', 'stoneG'],
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p3',
      // stones: ['stoneW', 'stoneG', 'stoneG', 'stoneB', 'stoneW'],
      // stones: ['stoneW', 'stoneG', 'stoneG', 'stoneB'],
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p4',
      // stones: ['stoneW'],
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p5',
      // stones: ['stoneB'],
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p6',
      // stones: ['stoneG'],
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
    {
      type: 'p7',
      // stones: ['stoneG', 'stoneG'],
      stones: [],
      selectable: [[], [], []],
      selected: [[], [], []],
      ghosts: [],
      active: false,
    },
  ],
  ornaments: [],
  active: false,
};

const defaultWsWBoardData: BoardData = {
  pillars: [
    {
      stones: [],
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
      stones: [],
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
