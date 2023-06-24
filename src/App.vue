<script setup lang="ts">
import { watch, onMounted, provide, ref } from 'vue';
import type { Ref } from 'vue';
import Board from './components/Board.vue';
import Quarry from './components/Quarry.vue';

import { BgaRequest, BgaNotification } from './type/bga-interface.d';
import { Gamedata } from './type/gamedata.d';
import { State, CurrentState } from './logic/state';
import { Sub } from './logic/sub';
import { BoardData } from './type/board.d';
import { QuarryData } from './type/quarry.d';
import {
  defaultMainboardData,
  defaultWsWBoardData,
  defaultWsBBoardData,
} from './def/board';
import { defaultQuarryData } from './def/quarry';

let bgaRequest: Ref<BgaRequest> = ref({
  name: '',
  args: {},
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bgaRequestPromise: Promise<any> = Promise.resolve();
const bgaNotifications: Ref<BgaNotification[]> = ref([]);
const bgaStates: CurrentState[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bgaNotifQueue: Promise<any> = Promise.resolve();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bgaStateQueue: Promise<any> = Promise.resolve();

let gamedata: Gamedata = {
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
};

let playerID = -1;
let state: null | State = null;
let sub: null | Sub = null;

const mainBoardData: Ref<BoardData> = ref(
  structuredClone(defaultMainboardData)
);

const wsWBoardData: Ref<BoardData> = ref(structuredClone(defaultWsWBoardData));

const wsBBoardData: Ref<BoardData> = ref(structuredClone(defaultWsBBoardData));

const quarryData: Ref<QuarryData> = ref(structuredClone(defaultQuarryData));

const urlBase = ref('');
provide('urlBase', urlBase);

onMounted(() => {
  // this must be done after the mount
  setTimeout(() => {
    initBgaNotification();
  });
  initBgaState();
  const unwatch = watch(gamedata, () => {
    restore();
    unwatch();
  });
});

const restore = () => {
  // restore all the data based on gamedata
  state = new State(request);
  state.refresh();
  sub = new Sub(playerID);
};

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
    }
  );
};

const initBgaState = (): void => {
  watch(bgaStates, (states: CurrentState[]) => {
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
  });
};

defineExpose({
  playerID,
  bgaStates,
  bgaNotifications,
  bgaRequest,
  bgaRequestPromise,
  urlBase,
  gamedata,
  // game data
  mainBoardData,
  wsWBoardData,
  wsBBoardData,
  quarryData,
});
</script>

<template>
  <div class="layout">
    <div class="top">
      <div class="left">
        <Board type="main" :data="mainBoardData" />
      </div>

      <div class="right">
        <Quarry :data="quarryData" />
      </div>
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

.bottom {
  display: flex;

  > div {
    flex: 0 0 auto;
    padding: 20px;
  }
}
</style>
