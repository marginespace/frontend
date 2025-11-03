import { BACKEND_API_URL } from '@/constants/backend_api';

const HIDDEN_VAULTS_URL = BACKEND_API_URL + '/api/hide-vaults';

interface Ids {
  id: string;
}

export const getAllHiddenVaults = async (): Promise<string[]> => {
  try {
    const response = await fetch(HIDDEN_VAULTS_URL, {
      cache: 'no-cache',
    });
    return (await response.json()).map((item: Ids) => item.id) as string[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
