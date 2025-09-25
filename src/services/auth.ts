'use client';

import { useUser } from '@/firebase';

export function useIsAdmin() {
  const { user } = useUser();

  const checkAdminStatus = async () => {
    if (!user) {
      return false;
    }
    try {
      const idTokenResult = await user.getIdTokenResult();
      return idTokenResult.claims.admin === true;
    } catch (error) {
      console.error('Error fetching user token:', error);
      return false;
    }
  };

  return { checkAdminStatus };
}
