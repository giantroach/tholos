import { StoneType, StoneDef } from '../type/stone.d';
import stoneImgUrl from '../assets/stones.png'

const stoneDefs: { [stoneType in StoneType]: StoneDef } = {
  stoneB: {
    image: stoneImgUrl,
    width: '58px',
    height: '66px',
  },
  stoneW: {
    image: stoneImgUrl,
    width: '58px',
    height: '66px',
    imgLeft: 58,
  },
  stoneG: {
    image: stoneImgUrl,
    width: '58px',
    height: '66px',
    imgLeft: 116,
  },
  none: {
    image: null,
    width: '58px',
    height: '58px',
    imgLeft: 116,
  }
};

export { stoneDefs };
