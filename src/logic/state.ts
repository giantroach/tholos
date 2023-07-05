import { watch } from 'vue';
import { throttle } from '../util/util';

import type { Ref } from 'vue';
import { BoardData } from '../type/board.d';
import { QuarryData } from '../type/quarry.d';
import { CtrlButtonData } from '../type/ctrlButton.d';
import { PlayerData } from '../type/player.d';

type CurrentState =
  | 'init'
  | 'playerTurn:init'
  | 'playerTurn:beforeStoneSelect'
  | 'playerTurn:beforeQuarryCntSelect'
  | 'playerTurn:beforePillarSelect'
  | 'playerTurn:beforeTargetSelect1'
  | 'playerTurn:beforeTargetSelect2'
  | 'playerTurn:beforeTargetSelect3'
  | 'playerTurn:beforeSubmit'
  | 'playerTurn:submit'
  | 'playerTurn:afterSubmit'
  | 'waitingForOtherPlayer'
  | 'otherPlayerTurn';

type SubState =
  | 'init'
  | 'beforeQuarryCntSelect'
  | 'beforePillarSelect'
  | 'beforeTargetSelect1'
  | 'beforeTargetSelect2'
  | 'beforeTargetSelect3'
  | 'beforeSubmit'
  | 'submit'
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
        if (this.isQuarrySelected()) {
          this.setSubState('beforeQuarryCntSelect');
        }
        if (this.isWsSelected()) {
          this.setSubState('beforePillarSelect');
        }
        this.setQuarryWsSelectable();
        break;

      case 'playerTurn:beforeQuarryCntSelect':
        if (!this.isQuarrySelected()) {
          this.assign(this.quarryData.value, 'carryMax', 0);
          this.setSubState('beforeStoneSelect');
          break;
        }
        if (this.isQuarryCarrySelected()) {
          this.setSubState('beforeSubmit');
        }
        this.setQuarryCarryMax();
        break;

      case 'playerTurn:beforePillarSelect':
        this.assign(this.quarryData.value, 'active', false);
        this.assign(this.ctrlButtonData.value.cancel, 'display', true);
        break;

      case 'playerTurn:beforeSubmit':
        this.assign(this.ctrlButtonData.value.submit, 'display', true);
        this.assign(this.ctrlButtonData.value.cancel, 'display', true);
        this.everythingNotSelectable();
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
    this.assign(this.ctrlButtonData.value.submit, 'display', false);
    this.assign(this.ctrlButtonData.value.cancel, 'display', false);

    [this.wsWBoardData, this.wsBBoardData].forEach((b) => {
      this.assign(b.value, 'active', false);
      b.value.pillars.forEach((p) => {
        this.assign(p, 'selected', []);
      });
    });

    this.assign(this.quarryData.value, 'active', false);
    this.assign(this.quarryData.value, 'selected', []);
    this.assign(this.quarryData.value, 'carryMax', 0);
  }

  public everythingNotSelectable() {
    [this.wsWBoardData, this.wsBBoardData].forEach((b) => {
      this.assign(b.value, 'active', false);
      b.value.pillars.forEach((p) => {
        this.assign(p, 'selectable', []);
      });
    });
    this.assign(this.quarryData.value, 'active', false);
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
    // do not make it selectable when there is no space left
    let ws = this.wsWBoardData.value
    if (this.playerData.value.playerSide === 'black') {
      ws = this.wsBBoardData.value;
    }
    if (this.getWsStoneCount(ws) < 3) {
      this.assign(this.quarryData.value, 'active', true);
    }
  }

  public isQuarrySelected(): boolean {
    return this.quarryData.value.selected.includes(true);
  }

  public isQuarryCarrySelected(): boolean {
    return this.quarryData.value.carry > 0;
  }

  public isWsSelected(): boolean {
    let target = this.wsWBoardData.value;

    if (this.playerData.value.playerSide === 'black') {
      target = this.wsBBoardData.value;
    }

    return target.pillars.some((p) => {
      return p.selected.includes(true);
    });
  }

  public setQuarryCarryMax() {
    const idx = this.quarryData.value.selected.findIndex((s) => s === true);
    const color = ['white', 'gray', 'black'].reduce((acc, cur, i) => {
      if (idx === i) {
        return cur;
      }
      return acc;
    });
    const playerSide = this.playerData.value.playerSide;

    let max = 1;
    if (color === playerSide) {
      max = 3;
    }
    if (color === 'gray') {
      max = 2;
    }

    // depending on the remaining space, we must reduce the max
    let ws = this.wsWBoardData.value;
    if (playerSide === 'black') {
      ws = this.wsBBoardData.value;
    }
    const wsRemainingSpace = 3 - this.getWsStoneCount(ws);
    if (max > wsRemainingSpace) {
      max = wsRemainingSpace;
    }

    this.assign(this.quarryData.value, 'carryMax', max);
    this.assign(this.quarryData.value, 'carry', max);
  }

  public getWsStoneCount(ws: BoardData) {
    return ws.pillars.reduce((acc, cur) => {
      if (cur.stones[0]) {
        return acc + 1;
      }
      return acc;
    }, 0);
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
      const s = p.stones.map((_s, idx) => {
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
