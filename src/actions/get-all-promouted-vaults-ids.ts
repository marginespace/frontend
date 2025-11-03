import { BACKEND_API_URL } from '@/constants/backend_api';

const PROMOTIONAL_URL = BACKEND_API_URL + '/api/promotional-pool';

interface Ids {
  id: string;
}

export const getAllPromotedVaultsIds = async (): Promise<string[]> => {
  try {
    const response = await fetch(PROMOTIONAL_URL, {
      cache: 'no-cache',
    });
    return (await response.json()).map((item: Ids) => item.id) as string[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
