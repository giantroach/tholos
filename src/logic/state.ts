import { watch } from 'vue';
import { throttle } from '../util/util';

import type { Ref } from 'vue';
import { BoardData } from '../type/board.d';
import { QuarryData } from '../type/quarry.d';
import { CtrlButtonData } from '../type/ctrlButton.d';
import { PlayerData } from './type/player.d';

type CurrentState =
  | 'init'
  | 'playerTurn:init'
  | 'playerTurn:beforeStoneSelect'
  | 'playerTurn:submit'
  | 'waitingForOtherPlayer'
  | 'otherPlayerTurn';

type SubState =
  | 'init'
  | 'submit'
  | 'afterAnim'
  | 'afterSubmit'
  | 'beforeStoneSelect';

//
// State handles data changes / local state changes
//

class State {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private request: any,
    private playerData: Ref<PlayerData>,
    private mainBoardData: Ref<BoardData>,
    private wsWBoardData: Ref<BoardData>,
    private wsBBoardData: Ref<BoardData>,
    private quarryData: Ref<QuarryData>,
    private ctrlButtonData: Ref<CtrlButtonData>
  ) {
    this.throttledRefresh = throttle(this.refresh, 100, this);
    watch(
      [
        this.mainBoardData,
        this.wsWBoardData,
        this.wsBBoardData,
        this.quarryData,
        this.ctrlButtonData,
      ],
      () => {
        this.throttledRefresh();
      },
      { deep: true }
    );
  }

  public current: CurrentState = 'waitingForOtherPlayer';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public throttledRefresh: any;

  public refresh() {
    switch (this.current) {
      case 'waitingForOtherPlayer':
        this.reset();
        break;

      case 'playerTurn:init':
        // FIXME: reset selection etc here
        this.reset();
        this.setSubState('beforeStoneSelect');
        break;

      case 'playerTurn:beforeStoneSelect':
        this.setQuarryWsSelectable();
        break;

      case 'playerTurn:submit':
        this.request('moveStone', {
          color: 'black',
          from: null,
          to: null,
        });
        this.setSubState('afterSubmit');
        break;
    }
  }

  public setState(state: CurrentState): void {
    this.current = state;
    this.throttledRefresh();
  }

  public setSubState(subState: SubState): void {
    this.current = this.current.replace(/:.+/, `:${subState}`) as CurrentState;
    this.throttledRefresh();
  }

  public cancelState(): void {
    if (/^playerTurn/.test(this.current)) {
      this.current = 'playerTurn:init';
      this.throttledRefresh();
    }
  }

  public submitState(mode?: string): void {
    console.log('mode', mode);
    if (/^playerTurn/.test(this.current)) {
      this.current = 'playerTurn:submit';
      this.throttledRefresh();
    }
  }

  public reset() {
    this.wsWBoardData.value.active = false;
    this.wsBBoardData.value.active = false;
    this.quarryData.value.active = false;
  }

  public setQuarryWsSelectable(): void {
    // workshop
    if (this.playerData.value.playerSide === 'white') {
      this.assign(this.wsWBoardData.value, 'active', true);
      const ps = this.wsWBoardData.value.pillars;
      ps.forEach((p) => {
        this.assign(p, 'selectable', [!!p.stones[0]]);
      });
    } else {
      this.assign(this.wsBBoardData.value, 'active', true);
      const ps = this.wsBBoardData.value.pillars;
      ps.forEach((p) => {
        this.assign(p, 'selectable', [!!p.stones[0]]);
      });
    }

    // quarry (quarry component has embed logic for selectable)
    this.assign(this.quarryData.value, 'active', true);
  }

  public setTargetSelectable() {
    // mainboard
    this.assign(this.mainBoardData.value, 'active', true);
    const ps = this.mainBoardData.value.pillars;
    ps.forEach((p) => {
      const pl = p.stones.length;
      if (pl >= 5) {
        return;
      }
      const s = p.stones.map((s, idx) => {
        if (pl === idx + 1) {
          return true;
        }
        return false;
      });
      this.assign(p, 'selectable', s);
    });
  }

  // avoid unnecessary update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private assign(obj: any, key: string, val: any): void {
    const v1 = JSON.stringify(obj[key]);
    const v2 = JSON.stringify(val);
    if (v1 !== v2) {
      obj[key] = val;
    }
  }
}

export { State };
export type { CurrentState };
