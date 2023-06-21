<script setup lang="ts">
import { inject, ref } from 'vue';
import { stoneDefs } from '../def/stone';
import type { StoneType } from '../type/stone.d';
import type { Ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prop = defineProps<{
  type: {
    type: StoneType;
    required: true;
  };
}>() as any;
const urlBase: Ref<string> = inject('urlBase') || ref('');

const def = stoneDefs[prop.type as StoneType];
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
  ></div>
</template>

<style scoped></style>
