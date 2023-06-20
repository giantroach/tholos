<script setup lang="ts">
import { inject, ref } from 'vue';
import { boardDefs } from '../def/board.ts';
import Pillar from './Pillar.vue';
import type { BoardType, BoardData } from '../type/board.d.ts';
import type { Ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prop = defineProps<{
  type: {
    type: BoardType;
    required: true;
  };
  data: {
    type: BoardData;
    required: false;
  };
}>() as any;
const urlBase: Ref<string> = inject('urlBase') || ref('');
const data: BoardData = ref(prop.data);

const def = boardDefs[prop.type as BoardType];
const width = def.width;
const height = def.height;
const image = def.image;
const bgPos = (() => {
  let x = def.imgLeft || 0;
  let y = def.imgTop || 0;
  return `-${x}px -${y}px`;
})();
</script>

<template>
  <div
    v-bind:style="{
      width: width,
      height: height,
      backgroundImage: 'url(\'' + urlBase + image + '\')',
      backgroundPosition: bgPos,
    }"
  >
    <ul class="stones">
      <li
        v-for="(stoneCol, idx) in data.stones"
        :key="idx"
        class=""
        v-bind:style="{
          left: def.stonePos[idx].x,
          top: def.stonePos[idx].y,
        }"
      >
        <Pillar :stones="stoneCol" />
        <!-- <div>{{ def.stonePos[idx].x }}</div>
             <div>{{ def.stonePos[idx].y }}</div> -->
      </li>
    </ul>
  </div>
</template>

<style scoped>
.stones {
  position: relative;
  margin: 0;
  list-style: none;
}

.stones > li {
  position: absolute;
}
</style>
