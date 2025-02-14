import { watch } from 'vue';
import { throttle } from '../util/util';

import type { Ref } from 'vue';
import { BoardData } from '../type/board.d';
import { QuarryData } from '../type/quarry.d';
import { CtrlBarData } from '../type/ctrlBar.d';
import { PlayerData } from '../type/player.d';
import { StoneType } from '../type/stone.d';
import { BarType } from '../type/ctrlBar.d';
import { OrnamentType } from '../type/ornament.d';

type CurrentState =
  | 'init'
  | 'playerTurn:init'
  | 'playerTurn:beforeStoneSelect'
  | 'playerTurn:beforeQuarryCntSelect'
  | 'playerTurn:beforePillarSelect'
  | 'playerTurn:takeActionConfirmation'
  | 'playerTurn:takeOrnamentAction'
  | 'playerTurn:beforeTargetSelect1'
  | 'playerTurn:beforeTargetSelect2'
  | 'playerTurn:beforeTargetSelect3'
  | 'playerTurn:beforeSubmit'
  | 'playerTurn:beforeSubmitTake'
  | 'playerTurn:beforeSubmitPlace'
  | 'playerTurn:submitTake'
  | 'playerTurn:submitPlace'
  | 'playerTurn:afterSubmit'
  | 'waitingForOtherPlayer'
  | 'otherPlayerTurn';

type SubState =
  | 'init'
  | 'beforeQuarryCntSelect'
  | 'beforePillarSelect'
  | 'takeActionConfirmation'
  | 'takeOrnamentAction'
  | 'beforeTargetSelect1'
  | 'beforeTargetSelect2'
  | 'beforeTargetSelect3'
  | 'beforeSubmitTake'
  | 'beforeSubmitPlace'
  | 'submitPlace'
  | 'submitTake'
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
    private ctrlBarData: Ref<CtrlBarData>
  ) {
    this.throttledRefresh = throttle(this.refresh, 100, this);
    watch(
      [
        this.mainBoardData,
        this.wsWBoardData,
        this.wsBBoardData,
        this.quarryData,
        this.ctrlBarData,
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

  public useAction: boolean = false;
  public useOrnamentAction: boolean = false;

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
        this.assign(this.ctrlBarData.value, 'type', 'turnInit');
        break;

      case 'playerTurn:beforeQuarryCntSelect':
        if (!this.isQuarrySelected()) {
          this.assign(this.quarryData.value, 'carryMax', 0);
          this.setSubState('beforeStoneSelect');
          break;
        }
        if (this.isQuarryCarrySelected()) {
          this.setSubState('beforeSubmitTake');
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
          this.setSubState('takeActionConfirmation');
          break;
        }
        this.assign(this.quarryData.value, 'active', false);
        this.assign(this.ctrlBarData.value, 'type', 'choosePillar');
        this.setPillarTopSelectable();
        break;
      }

      case 'playerTurn:takeActionConfirmation':
        if (!this.isOwnStonePlacing()) {
          this.setSubState('beforeSubmitPlace');
          break;
        }
        if (this.isColumnWithOrnament(this.getMainBoardSelectedIdx(), 'o6')) {
          this.assign(
            this.ctrlBarData.value,
            'type',
            'takeOrnamentActionConfirm'
          );
        } else {
          this.assign(this.ctrlBarData.value, 'type', 'takeActionConfirm');
        }
        this.resetSelectable();
        this.assign(this.getOwnWs(), 'active', false);
        break;

      case 'playerTurn:takeOrnamentAction':
        this.useOrnamentAction = true;
        this.setSubState('beforeTargetSelect1');
        break;

      case 'playerTurn:beforeTargetSelect1': {
        if (!this.isOwnStonePlacing()) {
          this.setSubState('beforeSubmitPlace');
          break;
        }
        if (!this.setTarget1Selectable()) {
          this.assign(this.ctrlBarData.value, 'type', 'noValidTarget');
          this.useAction = false;
          this.useOrnamentAction = false;
          break;
        }
        this.useAction = true;
        break;
      }

      case 'playerTurn:beforeTargetSelect2':
        if (!this.setTarget2Selectable()) {
          this.useAction = false;
          this.useOrnamentAction = false;
          this.assign(this.ctrlBarData.value, 'type', 'noValidTarget');
          break;
        }
        break;

      case 'playerTurn:beforeSubmitTake':
        this.assign(this.ctrlBarData.value, 'type', 'submitActionConfirm');
        this.everythingNotSelectable();
        break;

      case 'playerTurn:beforeSubmitPlace':
        this.assign(this.ctrlBarData.value, 'type', 'submitActionConfirm');
        this.everythingNotSelectable();
        break;

      case 'playerTurn:submitTake':
        this.request('takeStone', {
          color: this.getQuarrySelected(),
          count: this.quarryData.value.carry,
        });
        this.setSubState('afterSubmit');
        break;

      case 'playerTurn:submitPlace':
        this.request('placeStone', {
          color: this.getWsSelectedStone(),
          bonusAction: this.useAction,
          ornamentAction: this.useOrnamentAction,
          target0: this.getMainBoardSelectedIdx(),
          target1: this.getTarget1(),
          target2: this.getTarget2(),
        });
        this.setSubState('afterSubmit');
        break;

      case 'playerTurn:afterSubmit':
        this.everythingNotSelectable();
        this.assign(this.ctrlBarData.value, 'type', '');
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

  public submitState(): void {
    if (/^playerTurn/.test(this.current)) {
      if (/beforeSubmitTake$/.test(this.current)) {
        this.current = 'playerTurn:submitTake';
        this.throttledRefresh();
      }
      if (/beforeSubmitPlace$/.test(this.current)) {
        this.current = 'playerTurn:submitPlace';
        this.throttledRefresh();
      }
    }
  }

  public resetSelectable(): void {
    [this.wsWBoardData, this.wsBBoardData, this.mainBoardData].forEach((b) => {
      b.value.pillars.forEach((p) => {
        this.assign(p, 'selectable', [[], [], []]);
      });
    });
  }

  public reset() {
    this.resetSelectable();

    this.assign(this.ctrlBarData.value, 'type', '');

    [this.wsWBoardData, this.wsBBoardData].forEach((b) => {
      this.assign(b.value, 'active', false);
      b.value.pillars.forEach((p) => {
        this.assign(p, 'selected', [[], [], []]);
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

    this.useAction = false;
    this.useOrnamentAction = false;
  }

  public everythingNotSelectable() {
    [this.wsWBoardData, this.wsBBoardData].forEach((b) => {
      this.assign(b.value, 'active', false);
    });
    this.assign(this.quarryData.value, 'active', false);
    this.assign(this.mainBoardData.value, 'active', false);
  }

  public setQuarryWsSelectable(): void {
    // workshop
    const ws = this.getOwnWs();
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

  public isWsSelected(own = true, idx = 0): boolean {
    const ws = own ? this.getOwnWs() : this.getOppoWs();
    return ws.pillars.some((p) => {
      return p.selected[idx]?.includes(true);
    });
  }

  public isOwnStonePlacing(): boolean {
    const s = this.getWsSelectedStone();
    const playerSide = this.playerData.value.playerSide;
    if (s === 'gray') {
      if (this.isColumnWithOrnament(this.getMainBoardSelectedIdx(), 'o5')) {
        return true;
      }
      return false;
    }
    if (playerSide === 'white') {
      return s === 'white';
    }
    return s === 'black';
  }

  public isColumnWithOrnament(idx: number, oType: OrnamentType): boolean {
    const mb = this.mainBoardData.value;
    if (!mb.ornaments || !mb.ornaments[idx]) {
      return false;
    }
    if (mb.ornaments[idx] === oType) {
      return true;
    }
    return false;
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
    const ws = this.getOwnWs();
    const wsRemainingSpace = 3 - this.getWsStoneCount(ws);
    if (max > wsRemainingSpace) {
      max = wsRemainingSpace;
    }

    this.assign(this.quarryData.value, 'carryMax', max);
    // this.assign(this.quarryData.value, 'carry', max);
  }

  public setPillarTopSelectable(
    layer = 0,
    stoneType: StoneType | null = null,
    exceptIdx: number | null = null
  ) {
    const mb = this.mainBoardData.value;
    this.assign(mb, 'active', true);
    mb.pillars.forEach((p, idx) => {
      if (idx === exceptIdx) {
        return;
      }
      const filled = new Array(p.stones.length).fill(false);
      const s: boolean[][] = [];
      s[layer] = filled;
      const g = [];
      const max = this.isColumnWithOrnament(idx, 'o7') ? 7 : 5;
      if (s[layer].length < max) {
        const stone = stoneType || this.getWsSelectedStone();
        s[layer][s[layer].length] = true;
        g[0] = stone;
      }
      this.assign(p, 'ghosts', g);
      this.assign(p, 'selectable', s);
    });
  }

  public getQuarrySelected(): StoneType {
    const s = this.quarryData.value.selected;
    if (s[0]) {
      return 'white';
    }
    if (s[1]) {
      return 'gray';
    }
    if (s[2]) {
      return 'black';
    }
    return 'none';
  }

  public getOwnWs(): BoardData {
    return this.playerData.value.playerSide === 'black'
      ? this.wsBBoardData.value
      : this.wsWBoardData.value;
  }

  public getOppoWs(): BoardData {
    return this.playerData.value.playerSide === 'white'
      ? this.wsBBoardData.value
      : this.wsWBoardData.value;
  }

  public getWsStoneCount(ws: BoardData) {
    return ws.pillars.reduce((acc, cur) => {
      if (cur.stones[0]) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  public getWsSelectedStone(idx = 0, own = true): StoneType {
    let ws = this.getOwnWs();
    if (!own) {
      ws = this.getOppoWs();
    }
    for (let i = 0; i < ws.pillars.length; i += 1) {
      const idx2 = ws.pillars[i].selected[idx].indexOf(true);
      if (idx2 >= 0) {
        return ws.pillars[i].stones[idx2];
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

  public getPillarIdxWithStone(
    topStoneType: StoneType | null = null,
    exceptIdx: number | null = null
  ): number[] {
    const mb = this.mainBoardData.value;
    return mb.pillars.reduce((acc, p, idx) => {
      if (exceptIdx !== null && exceptIdx === idx) {
        return acc;
      }
      const s = p.stones[p.stones.length - 1];
      if (topStoneType === null) {
        if (s) {
          acc.push(idx);
        }
      } else if (s === topStoneType) {
        acc.push(idx);
      }

      return acc;
    }, [] as number[]);
  }

  public setTarget1Selectable(): boolean {
    const srcIdx = this.getMainBoardSelectedIdx();
    let targetStone: StoneType = 'none';
    let nextBar: BarType = '';

    // FIXME:
    if (this.useOrnamentAction) {
      const idx = this.getMainBoardSelectedIdx(1);
      if (idx !== -1) {
        this.setSubState('beforeTargetSelect2');
        return true;
      }
      if (this.quarryData.value.stones[1] <= 0) {
        return false;
      }
      this.setPillarTopSelectable(1, 'gray', srcIdx);
      this.assign(this.ctrlBarData.value, 'type', 'chooseTarget1o6');
      return true;
    }

    this.resetSelectable();

    switch (true) {
      case srcIdx === 0 || srcIdx === 1 || srcIdx === 6: {
        if (srcIdx === 0) {
          targetStone = 'gray';
          nextBar = 'chooseTarget1a';
        }
        if (srcIdx === 1) {
          targetStone = 'white';
          nextBar = 'chooseTarget1b';
        }
        if (srcIdx === 6) {
          targetStone = 'black';
          nextBar = 'chooseTarget1g';
        }

        const idx1 = this.getMainBoardSelectedIdx(1);
        if (idx1 !== -1) {
          this.setSubState('beforeTargetSelect2');
          return true;
        }
        const mb = this.mainBoardData.value;
        const pIdxs = this.getPillarIdxWithStone(targetStone, srcIdx);
        if (!pIdxs.length) {
          return false;
        }
        pIdxs.forEach((idx) => {
          const p = mb.pillars[idx];
          const s: boolean[][] = [[], [], []];
          s[1][p.stones.length - 1] = true;
          this.assign(p, 'selectable', s);
        });
        this.assign(this.ctrlBarData.value, 'type', nextBar);
        return true;
      }

      case srcIdx === 2: {
        const idx1 = this.getMainBoardSelectedIdx(1);
        if (idx1 !== -1) {
          this.setSubState('beforeTargetSelect2');
          return true;
        }
        const mb = this.mainBoardData.value;
        const pIdxs = this.getPillarIdxWithStone(null, srcIdx);
        if (!pIdxs.length) {
          return false;
        }
        pIdxs.forEach((idx) => {
          const p = mb.pillars[idx];
          const s: boolean[][] = [[], [], []];
          s[1][p.stones.length - 1] = true;
          this.assign(p, 'selectable', s);
        });
        this.assign(this.ctrlBarData.value, 'type', 'chooseTarget1c');
        return true;
      }

      case srcIdx === 3: {
        if (this.quarryData.value.selected.includes(true)) {
          this.setSubState('beforeTargetSelect2');
          return true;
        }
        if (
          !this.quarryData.value.stones.some((n) => {
            return n > 0;
          })
        ) {
          return false;
        }
        this.assign(this.quarryData.value, 'active', true);
        this.assign(this.ctrlBarData.value, 'type', 'chooseTarget1d');
        return true;
      }

      case srcIdx === 4: {
        // check if opponents workshop has selected stone
        if (this.isWsSelected(false, 1)) {
          this.setSubState('beforeTargetSelect2');
          return true;
        }

        // check if opponents have stone in their workshop
        const ws = this.getOppoWs();
        if (!ws.pillars.some((p) => p.stones.length)) {
          return false;
        }

        // make opponent workshop selectable
        this.assign(ws, 'active', true);
        ws.pillars.forEach((p) => {
          this.assign(p, 'selectable', [false, [!!p.stones[0]]]);
        });
        this.assign(this.ctrlBarData.value, 'type', 'chooseTarget1e');
        return true;
      }

      case srcIdx === 5: {
        const ws = this.getOwnWs();
        // check if you already have selected another stone
        if (this.isWsSelected(true, 1)) {
          this.setSubState('beforeTargetSelect2');
          return true;
        }

        // check if you have another stone to place
        if (
          !ws.pillars.some((p) => {
            return p.stones[0] && !p.selected[0][0];
          })
        ) {
          return false;
        }

        // check if there is another place to place
        const mb = this.mainBoardData.value;
        if (
          !mb.pillars.some((p, idx) => {
            const max = this.isColumnWithOrnament(idx, 'o7') ? 7 : 5;
            return p.stones.length < max;
          })
        ) {
          return false;
        }

        // make ws layer 1 selectable
        this.assign(ws, 'active', true);
        ws.pillars.forEach((p) => {
          this.assign(p, 'selectable', [
            false,
            [!!p.stones[0] && !p.selected[0][0]],
          ]);
        });
        this.assign(this.ctrlBarData.value, 'type', 'chooseTarget1f');
        return true;
      }
    }

    return false;
  }

  public setTarget2Selectable(): boolean {
    const srcIdx0 = this.getMainBoardSelectedIdx(0);
    const srcIdx1 = this.getMainBoardSelectedIdx(1);
    const srcIdx2 = this.getMainBoardSelectedIdx(2);
    let targetStone: StoneType = 'none';
    let nextBar: BarType = '';

    this.resetSelectable();

    if (this.useOrnamentAction) {
      this.setSubState('beforeSubmitPlace');
      return true;
    }

    switch (true) {
      case srcIdx0 === 0 || srcIdx0 === 1 || srcIdx0 === 6: {
        if (srcIdx0 === 0) {
          targetStone = 'gray';
          nextBar = 'chooseTarget2a';
        }
        if (srcIdx0 === 1) {
          targetStone = 'white';
          nextBar = 'chooseTarget2b';
        }
        if (srcIdx0 === 6) {
          targetStone = 'black';
          nextBar = 'chooseTarget2g';
        }

        if (srcIdx2 !== -1) {
          this.removeGhostExcept(this.mainBoardData.value, [srcIdx0, srcIdx2]);
          this.setSubState('beforeSubmitPlace');
          return true;
        }
        const mb = this.mainBoardData.value;
        let targetAvailable = false;
        mb.pillars.forEach((p, idx) => {
          if (idx === srcIdx0 || idx === srcIdx1) {
            const s: boolean[][] = [[], [], []];
            this.assign(p, 'selectable', s);
            return;
          }
          const max = this.isColumnWithOrnament(idx, 'o7') ? 7 : 5;
          if (p.stones.length < max) {
            const s: boolean[][] = [[], [], []];
            const g = [targetStone];
            s[2][p.stones.length] = true;
            this.assign(p, 'ghosts', g);
            this.assign(p, 'selectable', s);
            targetAvailable = true;
          }
        });
        this.assign(this.ctrlBarData.value, 'type', nextBar);
        return targetAvailable;
      }

      case srcIdx0 === 2:
        this.setSubState('beforeSubmitPlace');
        return true;
      case srcIdx0 === 3:
        this.setSubState('beforeSubmitPlace');
        return true;
      case srcIdx0 === 4:
        this.setSubState('beforeSubmitPlace');
        return true;

      case srcIdx0 === 5: {
        // check if board layer 1 is selected
        if (srcIdx2 !== -1) {
          this.removeGhostExcept(this.mainBoardData.value, [srcIdx0, srcIdx2]);
          this.setSubState('beforeSubmitPlace');
          return true;
        }

        // check if valid target available & make it selectable
        const mb = this.mainBoardData.value;
        let targetAvailable = false;

        // const srcStone =
        //   mb.pillars[srcIdx1].stones[mb.pillars[srcIdx1].stones.length - 1];
        const srcStone = this.getWsSelectedStone(1);
        mb.pillars.forEach((p, idx) => {
          if (idx === srcIdx0) {
            return;
          }
          const max = this.isColumnWithOrnament(idx, 'o7') ? 7 : 5;
          if (p.stones.length < max) {
            const s: boolean[][] = [[], [], []];
            const g = [srcStone];
            s[2][p.stones.length] = true;
            this.assign(p, 'ghosts', g);
            this.assign(p, 'selectable', s);
            targetAvailable = true;
          }
        });
        this.assign(this.ctrlBarData.value, 'type', 'chooseTarget2f');
        return targetAvailable;
      }
    }

    return false;
  }

  public getTarget1(): null | StoneType | number {
    const srcIdx = this.getMainBoardSelectedIdx();

    if (!this.useAction) {
      return null;
    }

    if (this.useOrnamentAction) {
      const idx = this.getMainBoardSelectedIdx(1);
      if (idx === -1) {
        return null;
      }
      return idx;
    }

    switch (true) {
      case srcIdx === 0 || srcIdx === 2 || srcIdx === 1 || srcIdx === 6: {
        // index of main board
        return this.getMainBoardSelectedIdx(1);
      }
      case srcIdx === 3: {
        // index of quarry
        const idx = this.quarryData.value.selected.findIndex((s) => s);
        switch (idx) {
          case 0:
            return 'white';
          case 1:
            return 'gray';
          case 2:
            return 'black';
        }
        // invalid state
        return null;
      }
      case srcIdx === 4: {
        // stone type (as backend does not stone pos)
        return this.getWsSelectedStone(1, false);
      }
      case srcIdx === 5: {
        // stone type (as backend does not stone pos)
        return this.getWsSelectedStone(1, true);
      }
    }

    return null;
  }

  public getTarget2(): null | StoneType | number {
    const srcIdx = this.getMainBoardSelectedIdx();

    if (!this.useAction) {
      return null;
    }

    if (this.useOrnamentAction) {
      return null;
    }

    switch (true) {
      case srcIdx === 0 || srcIdx === 1 || srcIdx === 5 || srcIdx === 6: {
        // index of main board
        return this.getMainBoardSelectedIdx(2);
      }
      case srcIdx === 2 || srcIdx === 3 || srcIdx === 4: {
        return null;
      }
    }

    return null;
  }

  public removeGhostExcept(board: BoardData, exceptIdx: number[] = []) {
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
      // console.log(key, v1, v2);
      obj[key] = val;
    }
  }
}

export { State };
export type { CurrentState };
