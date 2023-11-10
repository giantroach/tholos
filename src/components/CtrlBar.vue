<script setup lang="ts">
import { inject, ref } from 'vue';
import type { Ref } from 'vue';
import { ButtonType } from '../type/ctrlButton.d';
import { BarType } from '../type/ctrlBar.d';
import { ctrlBarDefs } from '../def/ctrlBar';
import CtrlButton from './CtrlButton.vue';

const props = defineProps<{
  type: BarType;
}>();
const emit = defineEmits([
  'cancel',
  'submit',
  'takeAction',
  'takeActionColumn',
  'takeActionOrnament',
  'noAction',
  'noValidTarget',
]);

const i18n: Ref<any> = inject('i18n') || ref('');

const btnClick = (type: ButtonType) => {
  emit(type);
};
</script>

<template>
  <div
    class="bar-container"
    v-if="
      ctrlBarDefs[props.type].message ||
      ctrlBarDefs[props.type].buttonTypes.length
    "
  >
    <div class="message">
      {{ i18n(ctrlBarDefs[props.type].message) }}
    </div>
    <ul class="buttons">
      <li
        v-for="(buttonType, idx) in ctrlBarDefs[props.type].buttonTypes"
        :key="idx"
      >
        <CtrlButton
          :type="buttonType"
          :active="true"
          :display="true"
          @btnClick="btnClick(buttonType)"
        ></CtrlButton>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.bar-container {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  height: 72px;
  animation: fadein 0.4s ease-out forwards;
}

.message {
  margin: 5px 0;
}

ul.buttons {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 5px 0;
}
ul.buttons > li {
  margin: 0 5px;
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
