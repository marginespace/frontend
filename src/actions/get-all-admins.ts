import { BACKEND_API_URL } from '@/constants/backend_api';

const ADMIN_URL = BACKEND_API_URL + '/api/admin';

interface Admin {
  address: `0x${string}`;
}

export async function getAllAdmins(): Promise<string[]> {
  try {
    const response = await fetch(ADMIN_URL, {
      cache: 'no-cache',
    });

    const admins = (await response.json()) as Admin[];
    return admins.map((admin) => admin.address);
  } catch (error) {
    console.error('Error fetching admin status:', error);
    return [];
  }
}
