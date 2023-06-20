import { PillarType, PillarDef } from '../type/pillar.d';

const pillarDefs: { [pillarType in PillarType]: PillarDef } = {
  standard: {
    stoneGap: -16,
  },
};

export { pillarDefs };
