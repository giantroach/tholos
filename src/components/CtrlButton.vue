<script setup lang="ts">
import { inject, ref } from 'vue';
import type { Ref } from 'vue';
import { ctrlButtonDefs } from '../def/ctrlButton';
import type {
  ButtonType,
  ButtonSizeDef,
  CtrlButtonDef,
} from '../type/ctrlButton.d';

const props = defineProps<{
  type: ButtonType;
  active: Boolean;
  display: Boolean;
}>();
const emit = defineEmits(['btnClick']);

const type: Ref<ButtonType> = ref(props.type);
const i18n: Ref<any> = inject('i18n') || ref('');

const def: CtrlButtonDef = ctrlButtonDefs[type.value];
const size: ButtonSizeDef = def.size;

const btnClick = () => {
  if (!props.active) {
    return;
  }
  emit('btnClick');
};

</script>

<template>
  <Button
    v-bind:style="{
      width: size.width,
      height: size.height,
      borderRadius: size.radius,
      color: def.textColor,
      background: def.background,
      border: def.border,
      cursor: active ? 'pointer' : '',
      display: props.display ? 'initial' : 'none',
    }"
    :class="{
      selectable: props.active,
    }"
    class="aura"
    @click="btnClick()"
  >
    {{ i18n(def.label) }}
  </Button>
</template>

<style scoped></style>
