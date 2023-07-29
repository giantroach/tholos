import { Card, Score, Center } from './gamedata';
import { Player } from './framework.d';
import { StoneType } from './stone.d';

type BgaNotifyName = 'takeStone' | 'placeStone';

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: BgaNotifyName;
  args: BgaTakeStoneNotif;
}

interface BgaTakeStoneNotif {
  player_side: 'black' | 'white';
  player_name: string;
  color: StoneType;
  count: string; // number string
}

export { BgaRequest, BgaConfirm, BgaNotification, BgaTakeStoneNotif };
