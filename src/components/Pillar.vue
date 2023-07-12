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

const isSelectable = (idx: number): boolean => {
  if (!props.active) {
    return false;
  }
  return data.value.selectable.some((s) => {
    return s[idx];
  });
};

const isSelected = (idx: number): boolean => {
  return data.value.selected.some((s) => {
    return s[idx];
  });
};

const getSelectedLayer = (idx: number): number => {
  for (let i = 0; 0 <= i; i -= 1) {
    if (data.value.selected[i]?.[idx]) {
      return i;
    }
  }
  return -1;
};

// get the highest selectable layer
const getSelectableLayer = (idx: number): number => {
  for (let i = 0; 0 <= i; i -= 1) {
    if (data.value.selectable[i]?.[idx]) {
      return i;
    }
  }
  return -1;
};
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
        :selectable="isSelectable(idx)"
        :selected="isSelected(idx)"
        :selectIdx="getSelectableLayer(idx)"
        @selectStone="
        data.selected[getSelectableLayer(idx)][idx] =
        !data.selected[getSelectableLayer(idx)][idx]
        "
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
        :selectable="isSelectable(data.stones.length + idx)"
        :selected="isSelected(data.stones.length + idx)"
        :selectIdx="getSelectableLayer(data.stones.length + idx)"
        :ghost="true"
        @selectStone="
        data.selected[getSelectableLayer(data.stones.length + idx)][
          data.stones.length + idx
        ] =
        !data.selected[getSelectableLayer(data.stones.length + idx)][
          data.stones.length + idx
        ]
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
