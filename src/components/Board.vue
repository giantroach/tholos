<script setup lang="ts">
import { inject, ref } from 'vue';
import { boardDefs } from '../def/board';
import Pillar from './Pillar.vue';
import type { BoardType, BoardData } from '../type/board.d';
import type { Ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const props = defineProps<{
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
const data: BoardData = ref(props.data);

const def = boardDefs[props.type as BoardType];
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
        v-for="(pillar, idx) in data.pillars"
        :key="idx"
        class=""
        v-bind:style="{
          left: def.stonePos[idx].x,
          top: def.stonePos[idx].y,
        }"
      >
        <Pillar :data="pillar" />
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
