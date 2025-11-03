import { BACKEND_API_URL } from '@/constants/backend_api';

export const ARCHIVED_VAULT_URL = BACKEND_API_URL + '/api/archived-vault';

export type ArchivedVault = {
  id: string;
};
export const getArchivedVaults = async (): Promise<ArchivedVault[]> => {
  try {
    const response = await fetch(ARCHIVED_VAULT_URL, {
      cache: 'no-cache',
    });

    return (await response.json()) as ArchivedVault[];
  } catch (error) {
    console.error(error);

    return [];
  }
};
