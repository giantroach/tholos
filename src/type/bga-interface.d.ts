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
  args: BgaTakeStoneNotif | BgaPlaceStoneNotif;
}

interface BgaTakeStoneNotif {
  player_side: 'black' | 'white';
  player_name: string;
  color: StoneType;
  count: string; // num string
}

interface BgaPlaceStoneNotif {
  player_side: 'black' | 'white';
  player_name: string;
  color: StoneType;
  target: string; // num string
  locationName: string;
}

export {
  BgaRequest,
  BgaConfirm,
  BgaNotification,
  BgaTakeStoneNotif,
  BgaPlaceStoneNotif,
};
