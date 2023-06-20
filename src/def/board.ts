import { BoardType, BoardDef } from '../type/board.d';
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

export { boardDefs };
