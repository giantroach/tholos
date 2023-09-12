<script setup lang="ts">
import { inject, ref } from 'vue';
import { QuarryData } from '../type/quarry.d';
import { quarryCarryDialogDef } from '../def/quarry';
import Stone from './Stone.vue';
import type { Ref } from 'vue';
import quarryImgUrl from '../assets/quarry.png';

const props = defineProps<{
  data: {
    type: QuarryData;
    required: true;
  };
}>() as any;

const i18n: Ref<any> = inject('i18n') || ref('');
const data: Ref<QuarryData> = ref(props.data);
const urlBase: Ref<string> = inject('urlBase') || ref('');

const modal = ref(false);
const minModalTop = 0;
const modalTop = ref(-10000);
const modalLeft = ref(-10000);
const def = quarryCarryDialogDef;

const selectStone = (idx: number) => {
  const newVal = !data.value.selected[idx];
  data.value.carry = 0;
  for (let i = 0; i < 3; i += 1) {
    if (idx === i) {
      data.value.selected[i] = newVal;
    } else {
      data.value.selected[i] = false;
    }
  }

  if (newVal) {
    showDialog(idx);
  } else {
    hideDialog();
  }
};

const showDialog = (idx: number) => {
  const color = ['w', 'g', 'b'].reduce((acc, cur, i) => {
    if (i === idx) {
      return cur;
    }
    return acc;
  });

  const elm = document.getElementById(`quarry-stone-${color}`) as HTMLElement;
  const rect = elm.getBoundingClientRect();

  // find center coordinate
  const centerY = rect.top + rect.height;
  const centerX = rect.right - rect.width / 2;

  modal.value = true;

  setTimeout(() => {
    // wait for render
    const mcElm = document.getElementById('carry-cnt');
    const body = document.body;
    if (!mcElm) {
      return;
    }
    const mcRect = mcElm.getBoundingClientRect();
    let mcTop = centerY;
    let mcLeft = centerX - mcRect.width / 2;

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

const hideDialog = () => {
  modal.value = false;
};
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
    <div id="quarry-stone-w" class="quarry-stone quarry-stone-w">
      <Stone
        type="white"
        :selectable="data.active && data.stones[0] > 0"
        :selected="data.selected[0]"
        @selectStone="selectStone(0)"
      />
      <div class="quantity">x{{ data.stones[0] }}</div>
    </div>
    <div id="quarry-stone-g" class="quarry-stone quarry-stone-g">
      <Stone
        type="gray"
        :selectable="data.active && data.stones[1] > 0"
        :selected="data.selected[1]"
        @selectStone="selectStone(1)"
      />
      <div class="quantity">x{{ data.stones[1] }}</div>
    </div>
    <div id="quarry-stone-b" class="quarry-stone quarry-stone-b">
      <Stone
        type="black"
        :selectable="data.active && data.stones[2] > 0"
        :selected="data.selected[2]"
        @selectStone="selectStone(2)"
      />
      <div class="quantity">x{{ data.stones[2] }}</div>
    </div>
  </div>

  <teleport to="#modals" v-if="modal">
    <div
      id="carry-cnt"
      class="hint"
      v-bind:style="{
        top: modalTop + 'px',
        left: modalLeft + 'px',
        visibility: data.carryMax > 0 ? 'visible' : 'hidden',
      }"
    >
      <div class="text">
        {{ i18n(def.text) }}
      </div>
      <ul class="cnt">
        <li
          v-for="n in data.carryMax"
          :class="{
            selected: data.carry === n,
          }"
          @click="data.carry = n"
        >
          {{ n }}
        </li>
      </ul>
    </div>
  </teleport>
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

#carry-cnt {
  position: fixed;
  z-index: 1000;
  animation: fadein 0.4s ease-out forwards;
  box-shadow: 0 5px 5px 5px rgb(0 0 0 / 30%);

  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
}
#carry-cnt > .text {
  padding: 10px;
}
.cnt {
  overflow-y: auto;
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}
.cnt > li {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.cnt > li:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.cnt > li.selected {
  background-color: rgba(0, 0, 0, 0.2);
}
.cnt > li:not(:last-child) {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
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
