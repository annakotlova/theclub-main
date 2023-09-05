<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue';
import { UserDto } from '@/interfaces/user/user.dto';
import { useUserStore } from '@/store/user';
import { checkFileSize, checkFileType, handleInputUpdated } from '@/utils/global/file';
import { useModalStore } from '@/store/modal';
import { generateCodes } from '@/utils/global/codes';
import fileAPI from '@/api/file';

import Edit from './edit/index.vue';
import Name from './name/index.vue';
import Media from '@/plugins/media/index.vue';
import IconCommonEdit from '@icons/common/edit.vue';
import PreloaderCircle from '@page/preloader/Circle.vue';

const modal = useModalStore();
const userStore = useUserStore();

const user = computed(() => userStore.user as UserDto);
const referralMember = computed(() => userStore.referralMember as UserDto);

const state = reactive({
  uploading: false,
  percent: 0,
});

const action = async (id: string, object: Record<string, any>) => {
  if (referralMember.value || !user.value) return;

  const data = id === 'user-update' ? user.value : object;
  modal.create({ id, data });
};

const avatar = ref<null | HTMLInputElement>(null);
const uploadHandler = () => {
  if (!avatar.value || !avatar.value.files) return;
  const file_list = Array.from(avatar.value.files);

  if (!checkFileSize(file_list)) return;
  if (!checkFileType(file_list[0], 'image')) return;

  state.uploading = true;

  handleInputUpdated(file_list, (orientation: number) => {
    updateAvatarMethod(file_list[0], orientation);
  });
};

const updateAvatarMethod = async (file: Blob, orientation: number) => {
  const formData = new FormData();
  formData.append('avatar', file, `${generateCodes({ count: 1, length: 12 })}.webp`);
  formData.append('orientation', String(orientation));

  const config = {
    onUploadProgress: (progress: { loaded: number; total: number }) =>
      (state.percent = Math.floor((progress.loaded / progress.total) * 100)),
  };

  try {
    const { data } = await fileAPI.updateUser(formData, config);
    userStore.updateAvatar(data.avatar);
  } finally {
    state.uploading = false;
    state.percent = 0;
  }
};

onUnmounted(() => {
  userStore.destroyReferralMember();
});
</script>

<template>
  <div class="info-main flex-column flex-ic">
    <edit v-if="!referralMember" @action="action"></edit>
    <label class="avatar">
      <media
        :image="referralMember ? referralMember.avatar : user.avatar"
        :orientation="true"
      ></media>
      <template v-if="!referralMember">
        <div class="avatar-edit flex-center">
          <icon-common-edit size="20px"></icon-common-edit>
        </div>
        <div v-if="state.uploading" class="avatar-uploading flex-center">
          <preloader-circle :scale="0.3"></preloader-circle>
        </div>
        <input type="file" name="avatar" ref="avatar" @change="uploadHandler" />
      </template>
    </label>
    <name :name="referralMember ? referralMember.name : user.name"></name>
  </div>
</template>

<style scoped lang="scss">
.info-main {
  position: relative;
  gap: 24px;
  .avatar {
    $px: 120px;
    min-width: $px;
    width: $px;
    height: $px;
    border-radius: $px;
    border: 1px solid var(--white_color);
    position: relative;
    &-uploading {
      position: absolute;
      top: -1px;
      left: -1px;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      background-color: rgba(0, 0, 0, 0.8);
    }
    &-edit {
      position: absolute;
      z-index: 1;
      bottom: 0;
      right: 0;
      $px: 32px;
      width: $px;
      height: $px;
      border-radius: $px;
      background-color: var(--yellow_color);
    }
  }
}

@media (max-width: 1260px) {
  .info-main {
    margin-top: 0;
    flex-direction: row;
  }
}

@media (max-width: 600px) {
  .info-main {
    gap: 12px;
    .avatar {
      $px: 64px;
      min-width: $px;
      width: $px;
      height: $px;
      &-edit {
        $px: 24px;
        width: $px;
        height: $px;
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
