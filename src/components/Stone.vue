<script setup lang="ts">
import { inject, ref } from 'vue';
import { stoneDefs } from '../def/stone';
import type { StoneType } from '../type/stone.d';
import type { Ref } from 'vue';

export interface Props {
  type: StoneType;
  selectable: boolean;
  selected: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false,
});

const emit = defineEmits(['selectStone']);

const urlBase: Ref<string> = inject('urlBase') || ref('');

const def = stoneDefs[props.type as StoneType];
const width = def.width;
const height = def.height;
const image = def.image;
const bgPos = (() => {
  let x = def.imgLeft || 0;
  let y = def.imgTop || 0;
  return `-${x}px -${y}px`;
})();

const selectStone = () => {
  if (!props.selectable) {
    return;
  }
  emit('selectStone');
};
</script>

<template>
  <div
    :class="{
      selectable: !props.selected && props.selectable,
      selected: props.selected,
    }"
    v-bind:style="{
      width: width,
      height: height,
      backgroundImage: 'url(\'' + urlBase + image + '\')',
      backgroundPosition: bgPos,
    }"
    @click="selectStone()"
  ></div>
</template>

<style scoped>
.selectable {
  filter: drop-shadow(0 0 3px #000) drop-shadow(0 0 3px #000)
    drop-shadow(0 0 5px #00e9eb) drop-shadow(0 0 5px #00e9eb);
  cursor: pointer;
}
.selected {
  filter: drop-shadow(0 0 3px #fff) drop-shadow(0 0 3px #fff)
    drop-shadow(0 0 5px #ffb644) drop-shadow(0 0 5px #ffb644);
  cursor: pointer;
}
</style>
