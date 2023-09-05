import { markRaw } from 'vue';
import Success from './Success.vue';
import Error from './Error.vue';
import Warning from './Warning.vue';
import Info from './Info.vue';

export const ICONS = {
  success: markRaw(Success),
  error: markRaw(Error),
  warning: markRaw(Warning),
  info: markRaw(Info),
};
