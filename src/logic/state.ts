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
          this.removeGhostExcept(this.mainBoardData.value, [idx]);
          this.setSubState('beforeTargetSelect1');
          break;
        }
        this.assign(this.quarryData.value, 'active', false);
        this.assign(this.ctrlButtonData.value.cancel, 'display', true);
        this.setPillarTopSelectable();
        break;
      }

      case 'playerTurn:beforeTargetSelect1': {
        if (!this.isOwnStonePlacing()) {
          this.setSubState('beforeSubmit');
          break;
        }
        const idx = this.getMainBoardSelectedIdx(1);
        if (idx !== -1) {
          this.setSubState('beforeTargetSelect2');
          break;
        }
        if (!this.setTarget1Selectable()) {
          this.setSubState('beforeSubmit');
          break;
        }
        break;
      }

      case 'playerTurn:beforeTargetSelect2':
        const idx0 = this.getMainBoardSelectedIdx(0);
        const idx2 = this.getMainBoardSelectedIdx(2);
        if (idx2 !== -1) {
          this.removeGhostExcept(this.mainBoardData.value, [idx0, idx2]);
          this.setSubState('beforeSubmit');
          break;
        }
        if (!this.setTarget2Selectable()) {
          this.setSubState('beforeSubmit');
          break;
        }
        console.log('FIXME');
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
        this.assign(p, 'selected', [[]]);
      });
    });

    this.assign(this.quarryData.value, 'active', false);
    this.assign(this.quarryData.value, 'selected', []);
    this.assign(this.quarryData.value, 'carryMax', 0);

    this.mainBoardData.value.pillars.forEach((p) => {
      this.assign(p, 'ghosts', []);
      this.assign(p, 'selected', [[], [], []]);
      this.assign(p, 'selectable', [[], [], []]);
    });
  }

  public everythingNotSelectable() {
    [this.wsWBoardData, this.wsBBoardData].forEach((b) => {
      this.assign(b.value, 'active', false);
      b.value.pillars.forEach((p) => {
        this.assign(p, 'selectable', [[], [], []]);
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
        this.assign(p, 'selectable', [[!!p.stones[0]]]);
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
      return p.selected[0]?.includes(true);
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

  // only layer 0
  public setPillarTopSelectable() {
    const mb = this.mainBoardData.value;
    this.assign(mb, 'active', true);
    mb.pillars.forEach((p) => {
      const s: boolean[][] = [new Array(p.stones.length).fill(false)];
      const g = [];
      if (s[0].length < 5) {
        const stone = this.getWsSelectedStone();
        s[0][s[0].length] = true;
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
      const idx = ws.pillars[i].selected[0].indexOf(true);
      if (idx >= 0) {
        return ws.pillars[i].stones[idx];
      }
    }
    return 'none';
  }

  // we need multi layer in select
  public getMainBoardSelectedIdx(idx: number = 0): number {
    return this.mainBoardData.value.pillars.reduce((acc, cur, i) => {
      if (cur.selected[idx]?.includes(true)) {
        return i;
      }
      return acc;
    }, -1);
  }

  public getStoneOnTopOfPillar(type: StoneType): number[] {
    const mb = this.mainBoardData.value;
    // this.assign(mb, 'active', true);
    return mb.pillars.reduce((acc, p, idx) => {
      if (p.stones[p.stones.length - 1] === type) {
        acc.push(idx);
      }
      return acc;
    }, []);
  }

  public setTarget1Selectable(): boolean {
    const srcIdx = this.getMainBoardSelectedIdx();

    switch (srcIdx) {
      case 0: {
        const mb = this.mainBoardData.value;
        const pIdxs = this.getStoneOnTopOfPillar('stoneG');
        if (!pIdxs.length) {
          return false;
        }
        pIdxs.forEach((idx) => {
          if (srcIdx === idx) {
            return;
          }
          const p = mb.pillars[idx];
          const s = [[], [], []];
          s[1][p.stones.length - 1] = true;
          this.assign(p, 'selectable', s);
        });
        return true;
      }
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

    return false;
  }

  public setTarget2Selectable(): boolean {
    const srcIdx0 = this.getMainBoardSelectedIdx(0);
    const srcIdx1 = this.getMainBoardSelectedIdx(1);

    switch (srcIdx0) {
      case 0: {
        const mb = this.mainBoardData.value;
        let targetAvailable = false;
        const srcStone =
          mb.pillars[srcIdx1].stones[mb.pillars[srcIdx1].stones.length - 1];
        mb.pillars.forEach((p, idx) => {
          if (idx === srcIdx0 || idx === srcIdx1) {
            return;
          }
          if (p.stones.length < 5) {
            const s = [[], [], []];
            const g = [srcStone];
            s[2][p.stones.length] = true;
            this.assign(p, 'ghosts', g);
            this.assign(p, 'selectable', s);
            targetAvailable = true;
          }
        });
        return targetAvailable;
      }
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

    return false;
  }

  removeGhostExcept(board: BoardData, exceptIdx: number[] = []) {
    board.pillars.forEach((p, idx) => {
      if (exceptIdx.some((i) => i === idx)) {
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
