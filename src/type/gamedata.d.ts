/**
 * Tholos interfaces
 */

import { Player, Gamestate } from './framework.d';
import { StoneType } from './stone.d';

interface MainBoardRec {
  id: string;
  location: string;
  color: StoneType;
}

interface WorkshopRec {
  id: string;
  ws: 'black' | 'white';
  color: StoneType;
}

interface QuarryRec {
  color: StoneType;
  count: string;
}

interface Gamedata {
  current_player_id: string;
  decision: { decision_type: string };
  game_result_neutralized: string;
  gamestate: Gamestate;
  gamestates: { [gamestateId: number]: Gamestate };
  neutralized_player_id: string;
  notifications: { last_packet_id: string; move_nbr: string };
  playerorder: (string | number)[];
  players: { [playerId: number]: Player };
  tablespeed: string;

  // Add here variables you set up in getAllDatas
  mainBoard: {
    [idx: string]: MainBoardRec;
  };
  // array alike but not an array
  workshop: {
    [idx: string]: WorkshopRec;
  };
  quarry: {
    [color: string]: QuarryRec;
  };
  playerSide: 'white' | 'black';
}

export { Score, Gamedata };
