import { ref } from 'vue';
import { defineStore } from 'pinia';

import { UserDto } from '@/interfaces/user/user.dto';
import { FileDto } from '@/interfaces/file/file.dto';
import { ReferralDto } from '@/interfaces/referral/referral.dto';
import { PaymentDto } from '@/interfaces/payment/payment.dto';
import { CardDto } from '@/interfaces/card/card.dto';

import { updateObject } from '@/utils/global';

import referralAPI from '@/api/referral';
import paymentAPI from '@/api/payment';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserDto | null>(null);
  const payment = ref<PaymentDto | null>(null);
  const referral = ref<ReferralDto | null>(null);
  const referralMember = ref<UserDto | null>(null);

  const setUser = (data: UserDto) => (user.value = data);
  const setReferral = (data: ReferralDto) => (referral.value = data);
  const setPayment = (data: PaymentDto) => (payment.value = data);
  const setReferralMember = (data: UserDto) => (referralMember.value = data);
  const setCard = (data: CardDto) => {
    if (payment.value) payment.value.card = data;
  };

  const updateUser = (data: Partial<UserDto>) => {
    if (user.value) updateObject(user.value, data);
  };
  const updateAvatar = (avatar: FileDto) => {
    if (user.value) user.value.avatar = avatar;
  };
  const updatePayment = (data: PaymentDto) => {
    if (payment.value) updateObject(payment.value, data);
  };
  const updateBalance = (balance: number) => {
    if (payment.value) payment.value.balance = balance;
  };

  const destroyCard = () => {
    if (payment.value) payment.value.card = null;
  };
  const destroyReferralMember = () => {
    referralMember.value = null;
  };

  const getReferral = async (type: 'limit' | 'all') => {
    const { data } = await referralAPI.getItem(type);
    setReferral(data);
  };

  const getPayment = async () => {
    const { data } = await paymentAPI.getItem();
    setPayment(data);
  };

  return {
    user,
    payment,
    referral,
    referralMember,

    setUser,
    setReferral,
    setPayment,
    setReferralMember,
    setCard,

    updateUser,
    updateAvatar,
    updatePayment,
    updateBalance,

    destroyCard,
    destroyReferralMember,

    getReferral,
    getPayment,
  };
});
