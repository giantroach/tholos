<script setup lang="ts">
import { inject, ref } from 'vue';
import { stoneDefs } from '../def/stone';
import type { StoneType } from '../type/stone.d';
import type { Ref } from 'vue';

export interface Props {
  type: StoneType;
  selectable?: boolean;
  selected?: boolean;
  ghost?: boolean;
  selectIdx?: number;
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false,
  ghost: false,
  selectIdx: 1,
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
    class="wrapper"
    :class="{
      selectable0: !props.selected && props.selectable && props.selectIdx === 0,
      selectable1: !props.selected && props.selectable && props.selectIdx === 1,
      selectable2: !props.selected && props.selectable && props.selectIdx === 2,
      selected0: props.selected && props.selectIdx === 0,
      selected1: props.selected && props.selectIdx === 1,
      selected2: props.selected && props.selectIdx === 2,
      ghost: ghost,
    }"
  >
    <div
      v-if="image"
      :class="{
        ghost: ghost,
      }"
      v-bind:style="{
        width: width,
        height: height,
        backgroundImage: 'url(\'' + urlBase + image + '\')',
        backgroundPosition: bgPos,
      }"
      @click="selectStone()"
    ></div>
    <div
      class="none"
      v-if="!image"
      v-bind:style="{
        width: width,
        height: height,
      }"
      @click="selectStone()"
    ></div>
  </div>
</template>

<style scoped>
.selectable0 > div {
  filter: drop-shadow(0 0 3px #00e9eb) drop-shadow(0 0 3px #00e9eb)
    drop-shadow(0 0 3px #00e9eb);
  cursor: pointer;
}
.selectable1 > div {
  filter: drop-shadow(0 0 3px #00eb7a) drop-shadow(0 0 3px #00eb7a)
    drop-shadow(0 0 3px #00eb7a);
  cursor: pointer;
}
.selectable2 > div {
  filter: drop-shadow(0 0 3px #a1eb00) drop-shadow(0 0 3px #a1eb00)
  drop-shadow(0 0 3px #a1eb00);
  cursor: pointer;
}
.selected0 > div {
  filter: drop-shadow(0 0 3px #ffb644) drop-shadow(0 0 3px #ffb644)
    drop-shadow(0 0 3px #ffb644);
  cursor: pointer;
}
.selected1 > div {
  filter: drop-shadow(0 0 3px #fffc00) drop-shadow(0 0 3px #fffc00)
    drop-shadow(0 0 3px #fffc00);
  cursor: pointer;
}
.selected2 > div {
  filter: drop-shadow(0 0 3px #ff6f00) drop-shadow(0 0 3px #ff6f00)
  drop-shadow(0 0 3px #ff6f00);
  cursor: pointer;
}

.none {
  border-radius: 50px;
  background-color: white;
  margin-top: 8px;
}

.ghost {
  opacity: 0.9;
}

/* aura effects */
.wrapper {
  position: relative;
}

.wrapper.selectable:before,
.wrapper.selected:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: transparent;
  animation: aura 3s linear infinite;
  background-color: white;
  border-radius: 50px;
  filter: blur(4px);
  opacity: 0.8;
}

@keyframes aura {
  0% {
    transform: rotate(0deg) translate(5px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translate(5px) rotate(-360deg);
  }
}
</style>
