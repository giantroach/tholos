<script setup lang="ts">
import { ref } from 'vue';
import { pillarDefs } from '../def/pillar';
import Stone from './Stone.vue';
import type { PillarType, PillarDef, PillarData } from '../type/pillar.d';
import type { Ref } from 'vue';

export interface Props {
  data: PillarData;
  type?: PillarType;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'standard',
});

const data: Ref<PillarData> = ref(props.data);
const def: PillarDef = pillarDefs[props.type];
</script>

<template>
  <ul class="stones">
    <li
      v-for="(stoneType, idx) in data.stones"
      :key="idx"
      class=""
      v-bind:style="{
        top: `${idx * def.stoneGap}px`,
      }"
    >
      <Stone
        :type="stoneType"
        :selectable="data.selectable[idx]"
        :selected="data.selected[idx]"
        @selectStone="data.selected[idx] = !data.selected[idx]"
      />
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
