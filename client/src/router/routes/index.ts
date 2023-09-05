import meta from '../meta';

export const MAIN_ROUTES = [
  /* Event Routes */
  {
    path: '/',
    name: 'EventList',
    meta: meta.event.list,
    component: () => import('@/views/event/List.vue'),
  },
  {
    path: '/event/create',
    name: 'EventCreate',
    meta: meta.event.create,
    component: () => import('@/views/event/Create.vue'),
  },
  {
    path: '/event/:_id',
    name: 'EventUpdate',
    meta: meta.event.update,
    component: () => import('@/views/event/Update.vue'),
    props: true,
  },
  {
    path: '/event/code/:code',
    name: 'EventCode',
    meta: meta.event.code,
    component: () => import('@/views/event/Code.vue'),
    props: true,
  },

  /* User Routes */
  {
    path: '/profile',
    name: 'Profile',
    meta: meta.profile.index,
    component: () => import('@/views/profile/index.vue'),
  },

  /* Start Routes */
  {
    path: '/subjects',
    name: 'Subjects',
    meta: meta.start.subject,
    component: () => import('@/views/start/Subject.vue'),
  },
  {
    path: '/start',
    name: 'Start',
    meta: meta.start.index,
    component: () => import('@/views/start/index.vue'),
  },

  /* Payment Routes */
  {
    path: '/payment',
    name: 'Payment',
    meta: meta.payment.index,
    component: () => import('@/views/payment/index.vue'),
  },
  {
    path: '/payment/confirmed',
    name: 'PaymentConfirmed',
    meta: meta.payment.confirmed,
    component: () => import('@/views/payment/Confirmed.vue'),
  },
  {
    path: '/payment/rejected',
    name: 'PaymentRejected',
    meta: meta.payment.rejected,
    component: () => import('@/views/payment/Rejected.vue'),
  },

  /* Auth Routes  */
  {
    path: '/signup',
    name: 'Signup',
    meta: meta.auth.signup,
    component: () => import('@/views/auth/Signup.vue'),
  },
  {
    path: '/signup/:referral',
    name: 'SignupReferral',
    meta: meta.auth.signup,
    component: () => import('@/views/auth/Signup.vue'),
    props: true,
  },
  {
    path: '/signup/code',
    name: 'SignupCode',
    meta: meta.auth.signup_code,
    component: () => import('@/views/auth/SignupCode.vue'),
  },
  {
    path: '/signup/verify',
    name: 'SignupVerify',
    meta: meta.auth.signup_verify,
    component: () => import('@/views/auth/SignupVerify.vue'),
  },
  {
    path: '/signin',
    name: 'Signin',
    meta: meta.auth.signin,
    component: () => import('@/views/auth/Signin.vue'),
  },
  {
    path: '/recovery',
    name: 'Recovery',
    meta: meta.auth.recovery,
    component: () => import('@/views/auth/Recovery.vue'),
  },
  {
    path: '/recovery/code',
    name: 'RecoveryCode',
    meta: meta.auth.recovery_code,
    component: () => import('@/views/auth/RecoveryCode.vue'),
  },
  {
    path: '/recovery/verify',
    name: 'RecoveryVerify',
    meta: meta.auth.recovery_verify,
    component: () => import('@/views/auth/RecoveryVerify.vue'),
  },

  { path: '/:catchAll(.*)', redirect: '/profile' },
];
