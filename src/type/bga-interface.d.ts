import { Card, Score, Center } from './gamedata';
import { Player } from './framework.d';
import { StoneType } from './stone.d';

type BgaNotifyName =
  | 'takeStone'
  | 'placeStone'
  | 'moveStone'
  | 'removeStone'
  | 'stealStone'
  | 'placeFromQuarry';

interface BgaRequest {
  name: string;
  args: any;
}

interface BgaNotification {
  name: BgaNotifyName;
  args:
    | BgaTakeStoneNotif
    | BgaPlaceStoneNotif
    | BgaMoveStoneNotif
    | BgaRemoveStoneNotif
    | BgaStealStoneNotif
    | BgaPlaceFromQuarryNotif;
}

interface BgaTakeStoneNotif {
  player_side: 'black' | 'white';
  player_name: string;
  color: string;
  rawColor: StoneType;
  count: string; // num string
}

interface BgaPlaceStoneNotif {
  player_side: 'black' | 'white';
  player_name: string;
  color: string;
  rawColor: StoneType;
  target: string; // num string
  locationName: string;
  bonusAction: boolean;
}

interface BgaMoveStoneNotif {
  player_side: 'black' | 'white';
  player_name: string;
  from: string; // num string
  from_name: string;
  to: string;
  to_name: string; // num string
}

interface BgaRemoveStoneNotif {
  player_side: 'black' | 'white';
  player_name: string;
  from: string; // num string
  from_name: string;
}

interface BgaStealStoneNotif {
  player_side: 'black' | 'white';
  player_name: string;
  color: string;
  rawColor: StoneType;
}

interface BgaPlaceFromQuarryNotif {
  player_name: string;
  target: string; // num string
  locationName: string;
  // though it is always gray
  color: string;
  rawColor: StoneType;
}

export {
  BgaRequest,
  BgaConfirm,
  BgaNotification,
  BgaTakeStoneNotif,
  BgaPlaceStoneNotif,
  BgaMoveStoneNotif,
  BgaRemoveStoneNotif,
  BgaStealStoneNotif,
  BgaPlaceFromQuarryNotif,
};
