<script setup lang="ts">
import { ref } from 'vue';
import { pillarDefs } from '../def/pillar';
import Stone from './Stone.vue';
import type { PillarType, PillarDef, PillarData } from '../type/pillar.d';
import type { Ref } from 'vue';

export interface Props {
  data: PillarData;
  type?: PillarType;
  active: boolean;
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
        :selectable="active && data.selectable[idx]"
        :selected="data.selected[idx]"
        @selectStone="data.selected[idx] = !data.selected[idx]"
      />
    </li>

    <li
      v-for="(stoneType, idx) in data.ghosts"
      :key="idx"
      class=""
      v-bind:style="{
        top: `${(data.stones.length + idx) * def.stoneGap}px`,
      }"
    >
      <Stone
        :type="stoneType"
        :selectable="active && data.selectable[data.stones.length + idx]"
        :selected="data.selected[data.stones.length + idx]"
        :ghost="true"
        @selectStone="
          data.selected[data.stones.length + idx] =
            !data.selected[data.stones.length + idx]
        "
      />
    </li>

    <!-- <li v-if="data.selectable[0] && !data.stones[0]">
         <Stone
         type="none"
         :selectable="(props.active && data.selectable[0]) || false"
         :selected="data.selected[0] || false"
         @selectStone="data.selected[0] = !data.selected[0]"
         />
         </li> -->
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
