import { PillarType, PillarDef } from '../type/pillar.d';
import pillarHintImgUrl from '../assets/bonus.png';

const pillarDefs: { [pillarType in PillarType]: PillarDef } = {
  standard: {
    stoneGap: -16,
  },
  p1: {
    stoneGap: -16,
    hint: {
      image: pillarHintImgUrl,
      text: 'Locations α: The player who places a stone of their color in this locations may move the top Gray color stone of the column at a different temple location to a third different —and valid— temple location.',
      width: '240px',
      height: '220px',
      imgWidth: '80px',
      imgHeight: '60px',
      imgTop: 0,
      imgLeft: 0,
    },
  },
  p2: {
    stoneGap: -16,
    hint: {
      image: pillarHintImgUrl,
      text: 'Locations β: The player who places a stone of their color in this locations may move the top White color stone of the column at a different temple location to a third different —and valid— temple location.',
      width: '240px',
      height: '220px',
      imgWidth: '80px',
      imgHeight: '60px',
      imgTop: 0,
      imgLeft: 80,
    },
  },
  p3: {
    stoneGap: -16,
    hint: {
      image: pillarHintImgUrl,
      text: 'Location γ: The player who places a stone of their color in this location may return the top stone (of any color) of the column at a different temple location back to the quarry.',
      width: '240px',
      height: '220px',
      imgWidth: '80px',
      imgHeight: '60px',
      imgTop: 0,
      imgLeft: 160,
    },
  },
  p4: {
    stoneGap: -16,
    hint: {
      image: pillarHintImgUrl,
      text: 'Location δ: The player who places a stone of their color in this location may move a stone (of any color) from the quarry to their workshop; the player must have room for it in their workshop.',
      width: '240px',
      height: '220px',
      imgWidth: '80px',
      imgHeight: '60px',
      imgTop: 61,
      imgLeft: 0,
    },
  },
  p5: {
    stoneGap: -16,
    hint: {
      image: pillarHintImgUrl,
      text: "Location π: The player who places a stone of their color in this location may move a stone (of any color) from their rival's workshop to their own workshop; the player must have room for it in their workshop.",
      width: '240px',
      height: '220px',
      imgWidth: '80px',
      imgHeight: '60px',
      imgTop: 61,
      imgLeft: 80,
    },
  },
  p6: {
    stoneGap: -16,
    hint: {
      image: pillarHintImgUrl,
      text: 'Location Σ: The player who places a stone of their color in this location may place a stone (of any color) from their workshop in another valid temple location.',
      width: '240px',
      height: '220px',
      imgWidth: '80px',
      imgHeight: '60px',
      imgTop: 61,
      imgLeft: 160,
    },
  },
  p7: {
    stoneGap: -16,
    hint: {
      image: pillarHintImgUrl,
      text: 'Locations Ω: The player who places a stone of their color in this locations may move the top Black color stone of the column at a different temple location to a third different —and valid— temple location.',
      width: '240px',
      height: '220px',
      imgWidth: '80px',
      imgHeight: '60px',
      imgTop: 122,
      imgLeft: 0,
    },
  },
};

export { pillarDefs };
