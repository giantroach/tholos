<script setup lang="ts">
import { watch, onMounted, provide, ref } from 'vue';
import type { Ref } from 'vue';
import Board from './components/Board.vue';
import Quarry from './components/Quarry.vue';
import CtrlBar from './components/CtrlBar.vue';

import { State, CurrentState } from './logic/state';
import { Sub } from './logic/sub';

import { Gamedata } from './type/gamedata.d';
import { BgaRequest, BgaNotification } from './type/bga-interface.d';
import { BoardData } from './type/board.d';
import { QuarryData } from './type/quarry.d';
import { CtrlBarData } from './type/ctrlBar.d';
import { PlayerData } from './type/player.d';

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
  game_result_neutralized: '',
  gamestate: null,
  gamestates: {},
  neutralized_player_id: '',
  notifications: { last_packet_id: '', move_nbr: '' },
  playerorder: [],
  players: {},
  tablespeed: '',
});

let playerID = -1;
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
    restore();
    unwatch();
    ready.value = true;
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
  restorePlayerSide();
  state.refresh();
  sub = new Sub(playerID);
};

const restorePlayerSide = () => {
  if (String(gamedata.value.playerorder[0]) === String(playerID)) {
    playerData.value.playerSide = 'white';
  } else {
    playerData.value.playerSide = 'black';
  }
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

const submitState = (mode?: string) => {
  state?.submitState(mode);
};

const takeAction = () => {
  state?.setSubState('beforeTargetSelect1');
};

const noAction = () => {
  state?.setSubState('beforeSubmit');
};

const noValidTarget = () => {
  state?.setSubState('beforeSubmit');
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
        <Board type="main" :data="mainBoardData" />
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
