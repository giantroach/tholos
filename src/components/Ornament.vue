<script setup lang="ts">
import { inject, ref } from 'vue';
import { ornamentDefs } from '../def/ornament';
import type { OrnamentType, OrnamentDef } from '../type/ornament.d';
import type { Ref } from 'vue';

const urlBase: Ref<string> = inject('urlBase') || ref('');

export interface Props {
  type?: OrnamentType;
  rotate?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'standard',
});

const def: OrnamentDef = ornamentDefs[props.type];
const bgPos = (() => {
  let x = def.imgLeft || 0;
  let y = def.imgTop || 0;
  return `-${x}px -${y}px`;
})();
</script>

<template>
  <div class="wrapper">
    <div
      v-if="def.image"
      v-bind:style="{
        width: def.width,
        height: def.height,
        backgroundImage: 'url(\'' + urlBase + def.image + '\')',
        backgroundPosition: bgPos,
        transform: `rotate(${props.rotate || 0}deg)`,
      }"
    ></div>
  </div>
</template>

<style scoped></style>
