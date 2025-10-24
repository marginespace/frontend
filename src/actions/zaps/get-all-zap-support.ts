import { API_URL } from '@/constants/api';

const ZAP_SUPPORT_URL = API_URL + '/vaults/zap-support';

type ZapSupportRawResponse = Record<string, string[]>;

export type ZapSupportResponse = Record<string, boolean>;

export const getAllZapSupport = async (): Promise<ZapSupportResponse> => {
  try {
    const response = await fetch(ZAP_SUPPORT_URL, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
    const zapSupports = (await response.json()) as ZapSupportRawResponse;

    return Object.fromEntries(
      Object.entries(zapSupports).map(([key, zaps]) => [
        key,
        zaps.includes('oneInch'),
      ]),
    );
  } catch (error) {
    console.error(error);
    return {};
  }
};
