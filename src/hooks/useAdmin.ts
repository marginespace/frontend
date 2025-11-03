import { useEffect, useState } from 'react';

import { BACKEND_API_URL } from '@/constants/backend_api';

const ADMIN_URL = BACKEND_API_URL + '/api/admin';

interface Admin {
  address: `0x${string}`;
}

export function useAdmin(address: string | undefined): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (!address) return;

      try {
        const response = await fetch(ADMIN_URL, {
          cache: 'no-cache',
        });

        const admins = (await response.json()) as Admin[];

        const userIsAdmin = admins.some((admin) => admin.address === address);
        setIsAdmin(userIsAdmin);
      } catch (error) {
        // Handle fetch error
        console.error('Error fetching admin status:', error);
      }
    };

    fetchAdminStatus();
  }, [address]);

  return isAdmin;
}
