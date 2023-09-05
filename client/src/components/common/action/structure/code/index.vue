<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue';
import { StructureProps } from '@/interfaces/common/structure.dto';
import userAPI from '@/api/user';

import CommonCode from '@action/code/index.vue';

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();

// TODO: вынести в отдельный компонент для всех действий

const state = reactive({
  seconds: 59,
  success: false,
  error: false,
  action: true,
});

const resendCode = async () => {
  if (state.success || state.seconds) return;
  // await authAPI.resendCode();
  state.seconds = 59;
  state.success = state.error = false;
  startTimer();
};

const sendCode = async () => {
  if (state.success) return;

  await userAPI.updatePhone({ phone: props.data.phone });
  startTimer();
  state.action = false;
};

const inputCode = () => {
  state.error = false;
};

const validateCode = async (code: string) => {
  props.data.code = code;
  // await userAPI.validatePhone({ phone: props.data.phone, code });

  // stopTimer();
  // state.action = false;
  // state.success = true;
  // emit('phoneDisabled');
};

const interval = ref();
const startTimer = () => {
  interval.value = setInterval(() => {
    state.seconds--;
    if (state.seconds <= 0) stopTimer();
  }, 1000);
};

const stopTimer = () => {
  clearInterval(interval.value);
};

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <div class="modal-code">
    <common-code
      :seconds="state.seconds"
      :error="state.error"
      :success="state.success"
      :action="state.action"
      @input="inputCode"
      @validate="validateCode"
      @resend="resendCode"
      @send="sendCode"
    ></common-code>
  </div>
</template>

<style scoped lang="scss"></style>
