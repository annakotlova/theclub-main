<script setup lang="ts">
import zeroFilter from '@/filters/zero.filter';

const emit = defineEmits<{
  (e: 'validate', code: string): void;
  (e: 'resend'): boolean;
  (e: 'send'): boolean;
  (e: 'input'): void;
}>();

defineProps<{
  seconds: number;
  error: boolean;
  success: boolean;
  action?: boolean;
}>();

const keydown = (e: KeyboardEvent, index: number) => {
  const inputElements = document.querySelectorAll(
    'input.code-input',
  ) as NodeListOf<HTMLInputElement>;
  const target = e.target as HTMLInputElement;
  if (!target) return;

  if (e.code === 'Backspace' && target.value === '') inputElements[Math.max(0, index - 1)].focus();
};

const input = (e: Event, index: number) => {
  const inputElements = document.querySelectorAll(
    'input.code-input',
  ) as NodeListOf<HTMLInputElement>;
  const target = e.target as HTMLInputElement;
  if (!target) return;

  const [first, ...rest] = target.value;
  if (isNaN(+first)) return (target.value = '');

  emit('input');

  target.value = first ?? '';
  const lastInputBox = index === inputElements.length - 1;
  const didInsertContent = first !== undefined;

  const code = Array.from(inputElements)
    .map((input) => input.value)
    .filter((s) => s)
    .join('');
  if (code.length === 4 && !isNaN(+code)) return emit('validate', code);

  if (didInsertContent && !lastInputBox) {
    const next = inputElements[index + 1];
    if (!next) return;

    next.focus();
    next.value = rest.join('');
    next.dispatchEvent(new Event('input'));
  }
};
</script>

<template>
  <div class="code flex-column">
    <div v-if="action" class="code-action">
      <span class="yellow cursor-pointer" @click="emit('send')">Выслать код подтверждения</span>
    </div>
    <div class="code-container grid">
      <input
        v-for="index of 4"
        class="code-input text-center fw500 fz32"
        name="code"
        type="number"
        required
        :disabled="success"
        :key="index"
        :class="{ error }"
        @keydown="(e) => keydown(e, index - 1)"
        @input="(e) => input(e, index - 1)"
      />
    </div>
    <transition name="scale">
      <div v-if="!action" class="code-resend flex">
        <span
          v-if="!success"
          :class="{ 'cursor-pointer yellow': seconds === 0 }"
          @click="emit('resend')"
        >
          Отправить повторно
        </span>
        <span v-else class="yellow">Код подтвержен!</span>
        <span v-if="seconds && !success" class="yellow">через {{ zeroFilter(seconds) }} сек.</span>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.code {
  gap: 12px;
  &-container {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    input {
      border: 1px solid var(--yellow_color);
      color: var(--white_color);
      background-color: transparent;
      transition: 0.3s border;
      border-radius: 12px;
      aspect-ratio: 1;
      width: 100%;
      &.error {
        transition: 0.3s border;
        border-color: var(--red_color);
      }
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type='number'] {
      -moz-appearance: textfield;
    }
  }
  &-resend {
    gap: 16px;
  }
}
</style>
