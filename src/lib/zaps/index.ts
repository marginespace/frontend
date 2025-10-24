import { ZapTypeCommon } from './strats-common/common';
import {
  getZapsDataForRegularLPVaultType,
  getZapsOutDataForRegularLPVaultType,
} from './strats-common/regular-lp-vault';
import {
  getZapsDataForRegularSingleVaultType,
  getZapsOutDataForRegularSingleVaultType,
} from './strats-common/regular-single-vault';
import {
  getZapsDataForCurveConvex,
  getZapsOutDataForCurveConvex,
} from './strats-curve/curve-convex';
import { getZapsDataForHop, getZapsDataOutForHop } from './strats-hop/hop';
import {
  type GetOutZapsDataParams,
  type GetZapsDataParams,
  type ZapsData,
  type ZapsOutData,
} from './types';
import { getZapAddressForCategory } from './utils';

import { ZapCategory } from '@/actions/zaps/get-all-zap-configs';
import {
  getZapsDataForBalancer,
  getZapsDataOutForBalancer,
} from '@/lib/zaps/strats-balancer/balancer';
import {
  getZapsDataForCurveOp,
  getZapsOutDataForCurveOp,
} from '@/lib/zaps/strats-curve-op/curve-op';
import {
  getZapsDataForRetroGamma,
  getZapsDataOutForRetroGamma,
} from '@/lib/zaps/strats-retro-gamma/retro-gamma';
import {
  getZapsDataForVelodrome,
  getZapsDataOutForVelodrome,
} from '@/lib/zaps/strats-velodrome/velodrome';

const isRegularLpVaultType = (zapId: ZapTypeCommon) => {
  return (
    zapId === ZapTypeCommon.SOLIDLY_STABLE_LP ||
    zapId === ZapTypeCommon.SOLIDLY_VOLATILE_LP ||
    zapId === ZapTypeCommon.UNISWAP_V2_LP
  );
};

export type ZapsDataReturn = {
  zapsData: ZapsData;
  uiSteps: string[];
};

export type ZapsOutDataReturn = {
  zapsData: ZapsOutData;
  uiSteps: string[];
};

const getZapParams = <T extends GetZapsDataParams | GetOutZapsDataParams>(
  params: T,
  zapConfigAddress: string,
) => ({
  ...params,
  zapConfig: {
    ...params.zapConfig,
    zapAddress: zapConfigAddress,
  },
});

const getOutZapParams = (
  params: GetOutZapsDataParams,
  zapConfigAddress: string,
) => ({
  ...params,
  zapConfig: {
    ...params.zapConfig,
    zapAddress: zapConfigAddress,
  },
});

const _getZapsData = async (params: GetZapsDataParams) => {
  if (!params.vault.zapsSupported) throw new Error('Zaps are not supported');

  const zapId = params.vault.zapId;
  const zapCategory = params.vault.zapCategory;

  if (!zapCategory) throw new Error('zapCategory is not set');

  if (params.token === params.vault.token) {
    throw new Error('Cannot do zaps for vault token');
  }

  // for old(current) zaps implementation
  if (zapId === undefined) {
    throw new Error('Unknown zapId');
  }

  const zapAddress = getZapAddressForCategory(params.zapConfig, zapCategory);
  if (!zapAddress) throw new Error('Invalid zap config');

  if (zapCategory === ZapCategory.COMMON) {
    if (isRegularLpVaultType(zapId)) {
      return getZapsDataForRegularLPVaultType(getZapParams(params, zapAddress));
    }
    return getZapsDataForRegularSingleVaultType(
      getZapParams(params, zapAddress),
    );
  } else if (zapCategory === ZapCategory.CURVE_CONVEX_ETH) {
    return getZapsDataForCurveConvex(getZapParams(params, zapAddress));
  } else if (
    zapCategory === ZapCategory.BALANCER_AURA_ETH ||
    zapCategory === ZapCategory.BALANCER_AURA_ARBITRUM
  ) {
    return getZapsDataForBalancer(getZapParams(params, zapAddress));
  } else if (zapCategory === ZapCategory.RETRO_GAMMA) {
    return getZapsDataForRetroGamma(getZapParams(params, zapAddress));
  } else if (zapCategory === ZapCategory.HOP) {
    return getZapsDataForHop(getZapParams(params, zapAddress));
  } else if (zapCategory === ZapCategory.VELODROME) {
    return getZapsDataForVelodrome(getZapParams(params, zapAddress));
  } else if (zapCategory === ZapCategory.CURVE_OP) {
    return getZapsDataForCurveOp(getZapParams(params, zapAddress));
  } else {
    throw new Error('Temporary unsupported');
  }
};

const _getZapsOutData = async (
  params: GetOutZapsDataParams,
): Promise<ZapsOutData> => {
  if (!params.vault.zapsSupported) throw new Error('Zaps are not supported');

  const zapId = params.vault.zapId;
  const zapCategory = params.vault.zapCategory;

  if (!zapCategory) throw new Error('zapCategory is not set');

  if (params.token === params.vault.token) {
    throw new Error('Cannot do zaps for vault token');
  }

  // for old(current) zaps implementation
  if (zapId === undefined) {
    throw new Error('Unknown zapId');
  }

  const zapAddress = getZapAddressForCategory(params.zapConfig, zapCategory);
  if (!zapAddress) throw new Error('Invalid zap config');

  if (zapCategory === ZapCategory.COMMON) {
    if (isRegularLpVaultType(zapId)) {
      return getZapsOutDataForRegularLPVaultType(
        getOutZapParams(params, zapAddress),
      );
    } else {
      return getZapsOutDataForRegularSingleVaultType(
        getOutZapParams(params, zapAddress),
      );
    }
  } else if (zapCategory === ZapCategory.CURVE_CONVEX_ETH) {
    return getZapsOutDataForCurveConvex(getZapParams(params, zapAddress));
  } else if (
    zapCategory === ZapCategory.BALANCER_AURA_ETH ||
    zapCategory === ZapCategory.BALANCER_AURA_ARBITRUM
  ) {
    const zapAddress = getZapAddressForCategory(params.zapConfig, zapCategory);

    if (!zapAddress) throw new Error('Invalid zap config');

    return getZapsDataOutForBalancer(getOutZapParams(params, zapAddress));
  } else if (zapCategory === ZapCategory.RETRO_GAMMA) {
    return getZapsDataOutForRetroGamma(getOutZapParams(params, zapAddress));
  } else if (zapCategory === ZapCategory.HOP) {
    return getZapsDataOutForHop(getOutZapParams(params, zapAddress));
  } else if (zapCategory === ZapCategory.VELODROME) {
    return getZapsDataOutForVelodrome(getOutZapParams(params, zapAddress));
  } else if (zapCategory === ZapCategory.CURVE_OP) {
    return getZapsOutDataForCurveOp(getOutZapParams(params, zapAddress));
  } else {
    throw new Error('Temporary unsupported');
  }
};

export const getZapsData = async (
  params: GetZapsDataParams,
): Promise<ZapsDataReturn> => {
  const zapsData = await _getZapsData(params);

  const steps = [
    ...zapsData.swaps.map(
      (swap) =>
        `Swap ${swap.from.amount} ${swap.from.tokenName} for ${swap.to.amount} ${swap.to.tokenName}`,
    ),
    ...(!zapsData.buildLp
      ? []
      : [
          `Build LP using ${zapsData.buildLp
            .map((lp) => `${lp.estimatedAmount} ${lp.tokenName}`)
            .join(', ')}`,
        ]),
    `Deposit estimated ${zapsData.deposit.estimatedAmount} ${zapsData.deposit.depositTokenName}`,
  ];

  return {
    zapsData,
    uiSteps: steps,
  };
};

export const getZapsOutData = async (
  params: GetOutZapsDataParams,
): Promise<ZapsOutDataReturn> => {
  const zapsData = await _getZapsOutData(params);

  const steps = [
    ...(!zapsData.burnLp
      ? []
      : [
          `Destroy LP and get ${zapsData.burnLp
            .map((lp) => `${lp.estimatedAmount} ${lp.tokenName}`)
            .join(', ')}`,
        ]),
    ...zapsData.swaps.map(
      (swap) =>
        `Swap ${swap.from.amount} ${swap.from.tokenName} for ${swap.to.amount} ${swap.to.tokenName}`,
    ),
    `Receive estimated ${zapsData.withdraw.estimatedAmount} ${zapsData.withdraw.withdrawTokenName}`,
  ];

  return {
    zapsData,
    uiSteps: steps,
  };
};
