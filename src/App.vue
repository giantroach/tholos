<script setup lang="ts">
import { watch, onMounted, provide, ref } from 'vue';
import type { Ref } from 'vue';
import Board from './components/Board.vue';
import Quarry from './components/Quarry.vue';
import CtrlBar from './components/CtrlBar.vue';

import { State, CurrentState } from './logic/state';
import { Sub } from './logic/sub';

import { Gamedata } from './type/gamedata.d';
import {
  BgaRequest,
  BgaNotification,
  BgaPlaceStoneNotif,
} from './type/bga-interface.d';
import { BoardData } from './type/board.d';
import { QuarryData } from './type/quarry.d';
import { CtrlBarData } from './type/ctrlBar.d';
import { PlayerData } from './type/player.d';
import { objToArray } from './util/util';

import {
  defaultMainboardData,
  defaultWsWBoardData,
  defaultWsBBoardData,
} from './def/board';
import { defaultQuarryData } from './def/quarry';
import { defaultCtrlBarData } from './def/ctrlBar';

let bgaRequest: Ref<BgaRequest> = ref({
  name: '',
  args: {},
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bgaRequestPromise: Promise<any> = Promise.resolve();
const bgaNotifications: Ref<BgaNotification[]> = ref([]);
const bgaStates: Ref<CurrentState[]> = ref([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bgaNotifQueue: Promise<any> = Promise.resolve();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bgaStateQueue: Promise<any> = Promise.resolve();

let gamedata: Ref<Gamedata> = ref({
  current_player_id: '',
  decision: { decision_type: '' },
  gameMode: 'standard',
  game_result_neutralized: '',
  gamestate: null,
  gamestates: {},
  neutralized_player_id: '',
  notifications: { last_packet_id: '', move_nbr: '' },
  playerorder: [],
  players: {},
  tablespeed: '',
  mainBoard: {},
  workshop: {},
  quarry: {},
  ornament: {},
  playerSide: 'white',
});

let playerID = ref(-1);
let sub: null | Sub = null;

const mainBoardData: Ref<BoardData> = ref(
  structuredClone(defaultMainboardData)
);

const wsWBoardData: Ref<BoardData> = ref(structuredClone(defaultWsWBoardData));

const wsBBoardData: Ref<BoardData> = ref(structuredClone(defaultWsBBoardData));

const quarryData: Ref<QuarryData> = ref(structuredClone(defaultQuarryData));

const ctrlBarData: Ref<CtrlBarData> = ref(structuredClone(defaultCtrlBarData));

const playerData: Ref<PlayerData> = ref({ playerSide: 'black' });

const urlBase = ref('');
provide('urlBase', urlBase);

const ready: Ref<boolean> = ref(false);

onMounted(() => {
  // this must be done after the mount
  setTimeout(() => {
    initBgaNotification();
    initBgaState();
  });

  const unwatch = watch(gamedata, () => {
    unwatch();
    ready.value = true;
    setTimeout(() => {
      restore();
    }, 100);
  });
});

const request = (name: string, args: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    // this is where magic happens
    // @ts-ignore
    window.vue.bgaRequest = {
      name: name,
      args: args,
    };
    setTimeout(() => {
      bgaRequestPromise
        .then((reply) => {
          resolve(reply);
        })
        .catch((e) => {
          reject(e);
        });
    });
  });
};

const state: State = new State(
  request,
  playerData,
  mainBoardData,
  wsWBoardData,
  wsBBoardData,
  quarryData,
  ctrlBarData
);

const restore = () => {
  // restore all the data based on gamedata

  // player side
  playerData.value.playerSide = gamedata.value.playerSide;

  // restore quarry
  const q = gamedata.value.quarry;
  quarryData.value.stones[0] = Number(q.white.count);
  quarryData.value.stones[1] = Number(q.gray.count);
  quarryData.value.stones[2] = Number(q.black.count);

  // restore workshop
  const wsa = objToArray(gamedata.value.workshop);
  wsa
    .filter((w) => w.ws === 'white')
    .forEach((w, idx) => {
      wsWBoardData.value.pillars[idx].stones.push(w.color);
    });
  wsa
    .filter((w) => w.ws === 'black')
    .forEach((w, idx) => {
      wsBBoardData.value.pillars[idx].stones.push(w.color);
    });

  // restore mainboard
  const mb = mainBoardData.value;
  const mba = objToArray(gamedata.value.mainBoard);
  mba.forEach((m) => {
    mb.pillars[m.location].stones.push(m.color);
  });

  // restore ornaments (if any)
  const ora = objToArray(gamedata.value.ornament || {});
  ora.forEach((o) => {
    mb.ornaments ||= [];
    mb.ornaments[o.location] = o.type;
  });

  state.refresh();
  sub = new Sub(mainBoardData, wsWBoardData, wsBBoardData, quarryData);
};

const initBgaNotification = (): void => {
  // this is where magic happens
  watch(
    // @ts-ignore
    vue.bgaNotifications,
    (notifs: BgaNotification[]) => {
      // TODO: make this suspendable
      const notif = notifs.shift();
      if (!notif) {
        return;
      }

      bgaNotifQueue = bgaNotifQueue.then(() => {
        return new Promise<void>((resolve) => {
          switch (notif.name) {
            case 'placeStone':
              sub?.handle(notif);
              const args = notif.args as BgaPlaceStoneNotif;
              if (args.bonusAction) {
                // go without delay
                resolve();
              } else {
                setTimeout(() => {
                  // secure the least time gap
                  resolve();
                }, 1000);
              }
              break;
            default:
              sub?.handle(notif);
              setTimeout(() => {
                // secure the least time gap
                resolve();
              }, 1000);
              break;
          }
        });
      });
    },
    { immediate: true }
  );
};

const initBgaState = (): void => {
  watch(
    // @ts-ignore
    vue.bgaStates,
    (states: CurrentState[]) => {
      const s = states.shift();
      if (!s) {
        return;
      }
      bgaStateQueue = bgaStateQueue.then(() => {
        return new Promise<void>((resolve) => {
          switch (s) {
            default:
              state?.setState(s);
              setTimeout(() => {
                // secure the least time gap
                resolve();
              }, 1000);
              break;
          }
        });
      });
    },
    { immediate: true }
  );
};

const cancelState = () => {
  state?.cancelState();
};

const submitState = () => {
  state?.submitState();
};

const takeAction = () => {
  state?.setSubState('beforeTargetSelect1');
};

const takeActionOrnament = () => {
  state?.setSubState('takeOrnamentAction');
};

const noAction = () => {
  state?.setSubState('beforeSubmitPlace');
};

const noValidTarget = () => {
  state?.setSubState('beforeSubmitPlace');
};

defineExpose({
  playerID,
  bgaStates,
  bgaNotifications,
  bgaRequest,
  bgaRequestPromise,
  urlBase,
  gamedata,
  state,
  // init method
  restore,
  // game data
  mainBoardData,
  wsWBoardData,
  wsBBoardData,
  quarryData,
  ctrlBarData,
  ready,
});
</script>

<template>
  <div class="layout" v-if="ready">
    <div class="top">
      <div class="left">
        <Board
          :type="gamedata.gameMode === 'advanced' ? 'main2' : 'main'"
          :data="mainBoardData"
        />
      </div>

      <div class="right">
        <Quarry :data="quarryData" />
      </div>
    </div>

    <div class="center">
      <CtrlBar
        :type="ctrlBarData.type"
        @cancel="cancelState()"
        @submit="submitState()"
        @takeAction="takeAction()"
        @takeActionColumn="takeAction()"
        @takeActionOrnament="takeActionOrnament()"
        @noAction="noAction()"
        @noValidTarget="noValidTarget()"
      >
      </CtrlBar>
    </div>

    <div class="bottom">
      <div>
        <Board type="workshopW" :data="wsWBoardData" />
      </div>
      <div>
        <Board type="workshopB" :data="wsBBoardData" />
      </div>
    </div>
  </div>
  <div id="modals"></div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.top {
  display: flex;

  > div.left {
    flex: 1 1 auto;
  }

  > div.right {
    flex: 0 0 150px;
  }
}

.center {
  height: 72px;
  margin-top: -72px;
  width: 100%;
}

.bottom {
  display: flex;

  > div {
    flex: 0 0 auto;
    padding: 20px;
  }
}
</style>
