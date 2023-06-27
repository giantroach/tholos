import { watch } from 'vue';
import { throttle } from '../util/util';

import type { Ref } from 'vue';
import { BoardData } from '../type/board.d';
import { QuarryData } from '../type/quarry.d';
import { CtrlButtonData } from '../type/ctrlButton.d';

type CurrentState =
  | 'init'
  | 'playerTurn:init'
  | 'playerTurn:submit'
  | 'waitingForOtherPlayer'
  | 'otherPlayerTurn';

type SubState = 'init' | 'submit' | 'afterAnim' | 'afterSubmit';

//
// State handles data changes / local state changes
//

class State {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private request: any,
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
        break;

      case 'playerTurn:init':
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

  // avoid unnecessary update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // private assign(obj: any, key: string, val: any): void {
  //   if (obj[key] !== val) {
  //     obj[key] = val;
  //   }
  // }
}

export { State };
export type { CurrentState };
