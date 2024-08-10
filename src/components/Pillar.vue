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

const emit = defineEmits(['selectStone']);

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

// get the highest selectable layer
const getSelectableLayer = (idx: number): number => {
  const max = 2;
  // by priority looks at selectable layer
  for (let i = max; 0 <= i; i -= 1) {
    if (data.value.selectable[i]?.[idx]) {
      return i;
    }
  }
  // If none, return based on selected layer
  // This is necessary when you want to let user to choose layer 1+
  // while layer 0 is kept selected state.
  for (let i = max; 0 <= i; i -= 1) {
    if (data.value.selected[i]?.[idx]) {
      return i;
    }
  }
  return -1;
};

const selectStone = (idx: number): void => {
  const idxLayer = getSelectableLayer(idx);
  data.value.selected[idxLayer][idx] = !data.value.selected[idxLayer][idx];
  if (!data.value.selected[idxLayer][idx]) {
    return;
  }
  emit('selectStone')
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
        @selectStone="selectStone(idx)"
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
        @selectStone="selectStone(data.stones.length + idx)"
      />
    </li>

    <li v-if="!data.stones.length && !data.ghosts.length" class="">
      <Stone type="none" />
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
