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
const emit = defineEmits(['cancel', 'submit', 'takeAction', 'noAction']);

const i18n: Ref<any> = inject('i18n') || ref('');

const btnClick = (type: ButtonType) => {
  emit(type);
};
</script>

<template>
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
</template>

<style scoped>
ul.buttons {
  display: flex;
  list-style: none;
  padding: 0;
}
</style>
