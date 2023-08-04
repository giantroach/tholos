import { Card, Score, Center } from './gamedata';
import { Player } from './framework.d';
import { StoneType } from './stone.d';

type BgaNotifyName =
  | 'takeStone'
  | 'placeStone'
  | 'moveStone'
  | 'removeStone'
  | 'stealStone';

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
    | BgaStealStoneNotif;
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
  color: StoneType;
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
};
