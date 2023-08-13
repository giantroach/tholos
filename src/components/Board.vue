<script setup lang="ts">
import { inject, ref } from 'vue';
import { boardDefs } from '../def/board';
import { pillarDefs } from '../def/pillar';
import Pillar from './Pillar.vue';
import type { BoardType, BoardData } from '../type/board.d';
import type { PillarHintDef } from '../type/pillar.d';
import type { Ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const props = defineProps<{
  type: {
    type: BoardType;
    required: true;
  };
  data: {
    type: BoardData;
    required: false;
  };
}>() as any;
const urlBase: Ref<string> = inject('urlBase') || ref('');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const i18n: Ref<any> = inject('i18n') || ref('');
const data: Ref<BoardData> = ref(props.data);

const def = boardDefs[props.type as BoardType];
const width = def.width;
const height = def.height;
const image = def.image;
const bgPos = (() => {
  let x = def.imgLeft || 0;
  let y = def.imgTop || 0;
  return `-${x}px -${y}px`;
})();

// hint popup
const modal = ref(false);
const minModalTop = 0;
const hintIdx = ref(0);
const modalTop = ref(-10000);
const modalLeft = ref(-10000);
const hintDef: Ref<PillarHintDef> | undefined = ref({
  image: '',
  text: '',
  width: '0',
  height: '0',
  imgWidth: '0',
  imgHeight: '0',
  imgTop: 0,
  imgLeft: 0,
});
const hintBgPos = ref(`0px 0px`);

const showHint = (evt: MouseEvent, idx: number) => {
  hintIdx.value = idx;
  const hd = pillarDefs[data.value.pillars[idx].type || 'standard'].hint;
  if (!hd || (!hd.image && !hd.text)) {
    // no hint to display
    return;
  }
  hintDef.value = hd;

  hintBgPos.value = `-${hintDef.value.imgLeft}px -${hintDef.value.imgTop}px`;

  const elm = evt.srcElement as HTMLElement;
  const rect = elm.getBoundingClientRect();

  // find center coordinate
  const centerY = rect.top + rect.height / 2;
  const centerX = rect.right + window.scrollX;
  modal.value = true;

  setTimeout(() => {
    // wait for render
    const mcElm = document.querySelector('#pillar-hint-' + hintIdx.value);
    const body = document.body;
    if (!mcElm) {
      return;
    }
    const mcRect = mcElm.getBoundingClientRect();
    let mcTop = centerY - mcRect.height / 2;
    // FIXME: hard coded
    let mcLeft = centerX + 20;
    // let mcLeft = centerX - mcRect.width / 2;
    const bdRect = body.getBoundingClientRect();
    if (mcTop + mcRect.height > bdRect.height) {
      mcTop = bdRect.height - mcRect.height;
    }
    if (mcLeft + mcRect.width > bdRect.width) {
      mcLeft = bdRect.width - mcRect.width;
    }
    modalTop.value = mcTop > minModalTop ? mcTop : minModalTop;
    modalLeft.value = mcLeft > 0 ? mcLeft : 0;
  });
};

const hideHint = () => {
  modal.value = false;
};
</script>

<template>
  <div
    v-bind:style="{
      width: width,
      height: height,
      backgroundImage: 'url(\'' + urlBase + image + '\')',
      backgroundPosition: bgPos,
    }"
  >
    <ul class="stones">
      <li
        v-for="(pillar, idx) in data.pillars"
        :key="idx"
        class=""
        v-bind:style="{
          left: def.stonePos[idx].x,
          top: def.stonePos[idx].y,
          zIndex: def.stonePos[idx].zIndex || 'auto',
        }"
        v-on:mouseover="showHint($event, idx)"
        v-on:mouseleave="hideHint"
      >
        <Pillar :data="pillar" :active="data.active" />
      </li>
    </ul>
  </div>

  <teleport to="#modals" v-if="modal">
    <div
      :id="'pillar-hint-' + hintIdx"
      class="hint"
      v-bind:style="{
        width: hintDef.width,
        height: hintDef.height,
        top: modalTop + 'px',
        left: modalLeft + 'px',
      }"
    >
      <div v-if="hintDef.image" class="container-image">
        <div
          class="image"
          v-bind:style="{
            width: hintDef.imgWidth,
            height: hintDef.imgHeight,
            backgroundImage: 'url(' + urlBase + hintDef.image + ')',
            backgroundPosition: hintBgPos,
          }"
        ></div>
      </div>
      <div v-if="hintDef.text" class="container-text">
        <div class="text">
          {{ i18n(hintDef.text) }}
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.stones {
  position: relative;
  margin: 0;
  list-style: none;
}

.stones > li {
  position: absolute;
}

/* hints */
.hint {
  position: fixed;
  z-index: 1000;
  animation: fadein 0.4s ease-out forwards;
  box-shadow: 0 5px 5px 5px rgb(0 0 0 / 30%);

  display: flex;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  overflow: hidden;
}
.container-image {
  display: flex;
  align-items: center;
}
.container-text {
  overflow-y: auto;
  margin-left: 10px;
  display: flex;
  align-items: center;
}
@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
