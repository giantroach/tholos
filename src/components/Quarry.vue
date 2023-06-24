<script setup lang="ts">
import { inject, ref } from 'vue';
import { QuarryData } from '../type/quarry.d';
import Stone from './Stone.vue';
import type { Ref } from 'vue';
import quarryImgUrl from '../assets/quarry.png';

const props = defineProps<{
  data: {
    type: QuarryData;
    required: true;
  };
}>() as any;
const data: Ref<QuarryData> = ref(props.data);
const urlBase: Ref<string> = inject('urlBase') || ref('');
</script>

<template>
  <div class="quarry-layout">
    <div class="quarry-icon">
      <div
        v-bind:style="{
          width: '106px',
          height: '106px',
          backgroundImage: 'url(\'' + urlBase + quarryImgUrl + '\')',
        }"
      />
    </div>
    <div class="quarry-stone quarry-stone-w">
      <Stone
        type="stoneW"
        :selectable="data.active && data.stones[0] > 0"
        :selected="data.selected[0]"
        @selectStone="data.selected[0] = !data.selected[0]"
      />
      <div class="quantity">x{{ data.stones[0] }}</div>
    </div>
    <div class="quarry-stone quarry-stone-g">
      <Stone
        type="stoneG"
        :selectable="data.active && data.stones[1] > 0"
        :selected="data.selected[1]"
        @selectStone="data.selected[1] = !data.selected[1]"
      />
      <div class="quantity">x{{ data.stones[1] }}</div>
    </div>
    <div class="quarry-stone quarry-stone-b">
      <Stone
        type="stoneB"
        :selectable="data.active && data.stones[2] > 0"
        :selected="data.selected[2]"
        @selectStone="data.selected[2] = !data.selected[2]"
      />
      <div class="quantity">x{{ data.stones[2] }}</div>
    </div>
  </div>
</template>

<style scoped>
.quarry-layout {
  display: flex;
  flex-direction: column;
  align-items: center;

  > .quarry-icon {
    flex: 0 0 120px;
    align-items: center;
    display: flex;
  }

  > .quarry-stone {
    flex: 0 0 80px;
    align-items: center;
    display: flex;
  }
}

.quantity {
  font-size: x-large;
  font-weight: bolder;
  width: 60px;
}
</style>
