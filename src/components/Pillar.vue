<script setup lang="ts">
import { ref } from 'vue';
import { pillarDefs } from '../def/pillar';
import Stone from './Stone.vue';
import type { StoneType } from '../type/stone.d';
import type { PillarType, PillarDef } from '../type/pillar.d';
import type { Ref } from 'vue';

export interface Props {
  stones: StoneType[];
  type?: PillarType;
}

const props = withDefaults(defineProps<Props>(), {
  type:  'standard'
})

const stones: Ref<StoneType[]> = ref(props.stones);
const def: PillarDef = pillarDefs[props.type];

</script>

<template>
  <ul class="stones">
    <li
      v-for="(stoneType, idx) in stones"
      :key="idx"
      class=""
      v-bind:style="{
        top: `${idx * def.stoneGap}px`,
      }"
    >
      <Stone :type="stoneType" />
    </li>
  </ul>
</template>

<style scoped>
.stones {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
}

ul.stones > li {
  position: absolute;
}
</style>
