<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { UserDto } from '@/interfaces/user/user.dto';
import { useUserStore } from '@/store/user';

const StaticAbout = defineAsyncComponent(() => import('./static/about.vue'));
const StaticContact = defineAsyncComponent(() => import('./static/contact.vue'));

defineProps<{
  type: 'about' | 'contact';
}>();

const userStore = useUserStore();
const user = computed(() => userStore.user as UserDto);
const referralMember = computed(() => userStore.referralMember as UserDto);
</script>

<template>
  <div class="info-item flex-column">
    <div class="title flex-center-between fw300">
      <span class="yellow">{{ type === 'about' ? 'Описание' : 'Контактная информация' }}</span>
      <!-- <span
        v-if="!referralMember"
        class="gray cursor-pointer fz14"
        @click="state.edit = !state.edit"
      >
        {{ state.edit ? 'Отмена' : 'Редактировать' }}
      </span> -->
    </div>
    <div class="container">
      <static-about
        v-if="type === 'about'"
        :about="referralMember ? referralMember.about : user.about"
      ></static-about>
      <static-contact
        v-else
        :phone="referralMember?.phone || user.phone"
        :birthday="referralMember ? referralMember.birthday : user.birthday"
      ></static-contact>
      <!-- <div v-else>
        <structure v-if="type === 'about'" :module="forms.about" class-name="black"></structure>
        <structure v-else :module="forms.contact" class-name="black"></structure>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-item {
  gap: 12px;
  .title {
    gap: 12px;
  }
}
</style>
