import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { MAIN_ROUTES } from './routes';

import { UserRole } from '@/interfaces/user/user.dto';
import { useAuthStore } from '@/store/auth';
import { useModalStore } from '@/store/modal';

const loadImages = (images: Array<string>) => {
  for (const src of images) {
    const img = new Image();
    img.src = src;
  }
};

const routes: Array<RouteRecordRaw> = MAIN_ROUTES;
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title as string;

  useModalStore().destroy();
  const auth = useAuthStore();
  const isNotAuthRoute = !!(from.meta.layout && !to.meta.auth && !from.meta.auth);

  const verified = isNotAuthRoute
    ? { status: false, role: UserRole.USER, subjects: [], activated: false }
    : await auth.verification();

  if (to.matched.some((route) => !route.meta.auth))
    return verified.status ? next({ name: 'Profile' }) : next();

  if (to.matched.some((route) => route.meta.auth)) {
    if (!verified.status) return next({ name: 'Signin' });
    if (to.meta.images) loadImages(to.meta.images as Array<string>);
    const accesses = (to.meta.accesses || []) as Array<UserRole>;

    const paymentActivated = to.name === 'Payment' && verified.activated;
    const subjectsSelected = to.name === 'Subjects' && verified.subjects.length;
    if (paymentActivated || subjectsSelected) return next({ name: 'Profile' });

    if (!['Payment', 'PaymentConfirmed', 'PaymentRejected'].includes(to.name as string) && !verified.activated)
      return next({ name: 'Payment' });

    if (!['Subjects', 'Payment'].includes(to.name as string) && !verified.subjects.length)
      return next({ name: 'Subjects' });

    if (!accesses.length) return next();
    const access = accesses.includes(verified.role) || accesses.length === 0;
    return access ? next() : next({ name: 'Profile' });
  }

  next();
});

export default router;
