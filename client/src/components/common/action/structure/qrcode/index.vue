<script setup lang="ts">
import QRCodeVue3 from 'qrcode-vue3';
import { StructureProps } from '@/interfaces/common/structure.dto';
import dateFilter from '@/filters/date.filter';

defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();
</script>

<template>
  <div class="modal-qrcode flex-column flex-center">
    <div class="event">
      <div class="event-name fz18 fw500 yellow">{{ data.name }}</div>
    </div>
    <div class="qrcode">
      <QRCodeVue3
        :width="200"
        :height="200"
        :value="data.qrcode"
        :qrOptions="{ mode: 'Byte' }"
        :dotsOptions="{ type: 'square', color: '#fff' }"
        :cornersSquareOptions="{ type: 'square', color: '#fff' }"
        :cornersDotOptions="{ type: 'square', color: '#fff' }"
        :backgroundOptions="{ color: '#0e0e0e' }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-qrcode {
  gap: 24px;
}
</style>
