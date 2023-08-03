import type { Ref } from 'vue';
import { BoardData } from '../type/board.d';
import { QuarryData } from '../type/quarry.d';
import {
  BgaNotification,
  BgaTakeStoneNotif,
  BgaPlaceStoneNotif,
  BgaMoveStoneNotif,
} from '../type/bga-interface.d';

//
// Sub handles BGA notifications and apply data accordingly.
//

export class Sub {
  constructor(
    private mainBoardData: Ref<BoardData>,
    private wsWBoardData: Ref<BoardData>,
    private wsBBoardData: Ref<BoardData>,
    private quarryData: Ref<QuarryData>
  ) {}

  public handle(notif: BgaNotification) {
    console.log('gocha', notif);
    switch (notif.name) {
      case 'takeStone': {
        const args = notif.args as BgaTakeStoneNotif;
        const count = Number(args.count);

        const ws =
          args.player_side === 'white'
            ? this.wsWBoardData.value
            : this.wsBBoardData.value;

        // update workshop
        for (let i = 0; i < count; i += 1) {
          const idx = ws.pillars.findIndex((p) => !p.stones.length);
          if (idx === -1) {
            throw 'unexpected state: no enough space to take stone ';
          }
          ws.pillars[idx].stones.push(args.color);
        }

        // update quarry
        const q = this.quarryData.value;
        switch (args.color) {
          case 'white':
            q.stones[0] -= count;
            break;
          case 'gray':
            q.stones[1] -= count;
            break;
          case 'black':
            q.stones[2] -= count;
            break;
        }

        break;
      }

      case 'placeStone': {
        const args = notif.args as BgaPlaceStoneNotif;

        // update workshop
        const ws =
          args.player_side === 'white'
            ? this.wsWBoardData.value
            : this.wsBBoardData.value;
        const idx = ws.pillars.findLastIndex((p) => p.stones[0] === args.color);
        if (idx === -1) {
          throw 'unexpected state: no corresponding stone found in workshop.';
        }
        ws.pillars[idx].stones.splice(0, 1);

        // update mainBoard
        const mb = this.mainBoardData.value;
        const targetIdx = Number(args.target);
        mb.pillars[targetIdx].stones.push(args.color);

        break;
      }

      case 'moveStone': {
        const args = notif.args as BgaMoveStoneNotif;

        // update mainBoard
        const mb = this.mainBoardData.value;
        const fromIdx = Number(args.from);
        const toIdx = Number(args.to);
        const p = mb.pillars[fromIdx].stones;
        const s = p.splice(p.length -1, 1)[0];
        mb.pillars[toIdx].stones.push(s);

        break;
      }

      default:
        break;
    }
  }
}
