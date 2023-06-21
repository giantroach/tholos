<script setup lang="ts">
import { inject, ref } from 'vue';
import { QuarryData } from '../type/quarry.d';
import Stone from './Stone.vue';
import type { Ref } from 'vue';
import quarryImgUrl from '../assets/quarry.png';

const props = defineProps<{
  data: {
    data: QuarryData;
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
      <Stone type="stoneW" />
      <div class="quantity">x{{ data.w }}</div>
    </div>
    <div class="quarry-stone quarry-stone-g">
      <Stone type="stoneG" />
      <div class="quantity">x{{ data.g }}</div>
    </div>
    <div class="quarry-stone quarry-stone-b">
      <Stone type="stoneB" />
      <div class="quantity">x{{ data.b }}</div>
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
