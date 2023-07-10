import { watch } from 'vue';
import { throttle } from '../util/util';

import type { Ref } from 'vue';
import { BoardData } from '../type/board.d';
import { QuarryData } from '../type/quarry.d';
import { CtrlButtonData } from '../type/ctrlButton.d';
import { PlayerData } from '../type/player.d';
import { StoneType } from '../type/stone.d';

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
          break;
        }
        if (this.isWsSelected()) {
          this.setSubState('beforePillarSelect');
          break;
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
          break;
        }
        this.setQuarryCarryMax();
        break;

      case 'playerTurn:beforePillarSelect': {
        if (!this.isWsSelected()) {
          this.setSubState('init');
          break;
        }
        const idx = this.getMainBoardSelectedIdx();
        if (idx !== -1) {
          this.removeGhostExcept(this.mainBoardData.value, idx);
          this.setSubState('beforeTargetSelect1');
          break;
        }
        this.assign(this.quarryData.value, 'active', false);
        this.assign(this.ctrlButtonData.value.cancel, 'display', true);
        this.setPillarTopSelectable();
        break;
      }

      case 'playerTurn:beforeTargetSelect1':
        if (!this.isOwnStonePlacing()) {
          this.setSubState('beforeSubmit');
          break;
        }
        if (!this.setTargetSelectable()) {
          this.setSubState('beforeSubmit');
          break;
        }
        console.log('FIXME')
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

    this.mainBoardData.value.pillars.forEach((p) => {
      this.assign(p, 'ghosts', []);
      this.assign(p, 'selected', []);
    });
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
    let ws = this.wsWBoardData.value;
    if (this.playerData.value.playerSide === 'black') {
      ws = this.wsBBoardData.value;
    }
    const wsStoneCnt = this.getWsStoneCount(ws);

    // activate onlye when at least one stone is there
    if (wsStoneCnt > 0) {
      this.assign(ws, 'active', true);
      const ps = ws.pillars;
      ps.forEach((p) => {
        this.assign(p, 'selectable', [!!p.stones[0]]);
      });
    }

    // quarry (quarry component has embed logic for selectable)
    // do not make it selectable when there is no space left
    if (wsStoneCnt < 3) {
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

  public isOwnStonePlacing(): boolean {
    const s = this.getWsSelectedStone();
    const playerSide = this.playerData.value.playerSide;
    if (s === 'stoneG') {
      return false;
    }
    if (playerSide === 'white') {
      return s === 'stoneW';
    }
    return s === 'stoneB';
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

  public setPillarTopSelectable() {
    const mb = this.mainBoardData.value;
    this.assign(mb, 'active', true);
    mb.pillars.forEach((p) => {
      const s = new Array(p.stones.length).fill(false);
      const g = [];
      // s[s.length - 1] = true;
      if (s.length < 5) {
        const stone = this.getWsSelectedStone();
        s[s.length] = true;
        g[0] = stone;
      }
      this.assign(p, 'ghosts', g);
      this.assign(p, 'selectable', s);
    });
  }

  public getWsStoneCount(ws: BoardData) {
    return ws.pillars.reduce((acc, cur) => {
      if (cur.stones[0]) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  public getWsSelectedStone(): StoneType {
    let ws = this.wsWBoardData.value;
    if (this.playerData.value.playerSide === 'black') {
      ws = this.wsBBoardData.value;
    }
    for (let i = 0; i < ws.pillars.length; i += 1) {
      const idx = ws.pillars[i].selected.indexOf(true);
      if (idx >= 0) {
        return ws.pillars[i].stones[idx];
      }
    }
    return 'none';
  }

  // FIXME: we need multi layer in select
  public getMainBoardSelectedIdx(): number {
    return this.mainBoardData.value.pillars.reduce((acc, cur, idx) => {
      if (cur.selected.includes(true)) {
        return idx;
      }
      return acc;
    }, -1);
  }

  public setTargetSelectable(): boolean {
    switch(this.getMainBoardSelectedIdx()) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
    }

    // // mainboard
    // this.assign(this.mainBoardData.value, 'active', true);
    // const ps = this.mainBoardData.value.pillars;
    // ps.forEach((p) => {
    //   const pl = p.stones.length;
    //   if (pl >= 5) {
    //     return;
    //   }
    //   const s = p.stones.map((_s, idx) => {
    //     if (pl === idx + 1) {
    //       return true;
    //     }
    //     return false;
    //   });
    //   this.assign(p, 'selectable', s);
    // });

    return false;
  }

  removeGhostExcept(board: BoardData, exceptIdx: number = -1) {
    board.pillars.forEach((p, idx) => {
      if (idx === exceptIdx) {
        return;
      }
      this.assign(p, 'ghosts', []);
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
