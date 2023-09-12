import { StoneType, StoneDef } from '../type/stone.d';
import stoneImgUrl from '../assets/stones.png'

const stoneDefs: { [stoneType in StoneType]: StoneDef } = {
  white: {
    image: stoneImgUrl,
    width: '58px',
    height: '66px',
    imgLeft: 58,
  },
  gray: {
    image: stoneImgUrl,
    width: '58px',
    height: '66px',
    imgLeft: 116,
  },
  black: {
    image: stoneImgUrl,
    width: '58px',
    height: '66px',
  },
  none: {
    image: null,
    width: '58px',
    height: '58px',
    imgLeft: 116,
  }
};

export { stoneDefs };
