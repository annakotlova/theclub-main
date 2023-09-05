import { defineStore } from 'pinia';
import { useUserStore } from '../user';
import { UserRole } from '@/interfaces/user/user.dto';
import authAPI from '@/api/auth';

export const useAuthStore = defineStore('auth', () => {
  const verification = async () => {
    const userStore = useUserStore();
    const user = userStore.user;
    if (user)
      return { status: true, role: user.role, subjects: user.subjects, activated: user.activated };

    try {
      const { data } = await authAPI.authentication();
      userStore.setUser(data);

      return { status: true, role: data.role, subjects: data.subjects, activated: data.activated };
    } catch (error) {
      return { status: false, role: UserRole.USER, subjects: [], activated: false };
    }
  };

  const logout = async () => {
    authAPI.logout().finally(() => {
      location.reload();
    });
  };

  return {
    verification,
    logout,
  };
});
