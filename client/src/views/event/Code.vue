<script setup lang="ts">
import { reactive } from 'vue';
import { QrCodeDto, QrCodeStatus } from '@/interfaces/qrcode/qrcode.dto';
import qrcodeAPI from '@/api/event/qrcode';

import Media from '@/plugins/media/index.vue';

const { code } = defineProps<{
  code: string;
}>();

const state = reactive({
  pending: false,
  qrcode: null as QrCodeDto | null,
});

const approve = async () => {
  if (!state.qrcode || state.pending) return;

  state.pending = true;
  try {
    const { data } = await qrcodeAPI.approve(state.qrcode._id, state.qrcode.event._id);
    state.qrcode.status = data.status;
  } finally {
    state.pending = false;
  }
};

const validateCode = async () => {
  const { data } = await qrcodeAPI.validate(code);
  state.qrcode = data;
};

const currentName = () => {
  return {
    CREATED: 'Подтвердить',
    CONFIRMED: 'Подтвержден',
    EXPIRED: 'Просрочен',
  };
};

validateCode();
</script>

<template>
  <section class="qrcode flex-column">
    <template v-if="state.qrcode">
      <div class="qrcode-block flex-column">
        <div class="qrcode-block--header yellow">Мероприятие</div>
        <div class="qrcode-block--container flex flex-ic">
          <div class="avatar">
            <media :image="state.qrcode.event.cover"></media>
          </div>
          <div class="name">{{ state.qrcode.event.name }}</div>
        </div>
      </div>
      <div class="qrcode-block flex-column">
        <div class="qrcode-block--header yellow">Участник</div>
        <div class="qrcode-block--container flex flex-ic">
          <div class="avatar">
            <media :image="state.qrcode.member.avatar"></media>
          </div>
          <div class="name">{{ state.qrcode.member.name }}</div>
        </div>
      </div>
      <div class="qrcode-block">
        <button
          v-if="state.qrcode.status === QrCodeStatus.CREATED"
          class="btn btn-main btn-small btn-max"
          @click="approve"
        >
          Подтвердить
        </button>
        <button
          v-if="state.qrcode.status !== QrCodeStatus.CREATED"
          class="btn btn-notification btn-small btn-max"
        >
          {{ state.qrcode.status === QrCodeStatus.EXPIRED ? 'Просрочен' : 'Подтвержден' }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.qrcode {
  background-color: var(--black_color);
  padding: 16px;
  border-radius: 16px;
  gap: 24px;
  &-block {
    gap: 12px;
    &--container {
      gap: 12px;
      .avatar {
        $px: 46px;
        width: $px;
        height: $px;
        border-radius: $px;
      }
    }
  }
}
</style>
