import {
  type Abi,
  type Chain,
  type PublicClient,
  type Client,
  type Transport,
  type CallParameters,
  type CallReturnType,
  type TransactionRequest,
  type RpcTransactionRequest,
  BaseError,
  type RawContractError,
  type ChainFormatter,
  type Address,
  type Hex,
  type SimulateContractReturnType,
  type SimulateContractParameters,
} from 'viem';
import {
  type DecodeFunctionResultParameters,
  type EncodeFunctionDataParameters,
  assertRequest,
  decodeFunctionResult,
  encodeFunctionData,
  formatTransactionRequest,
  getCallError,
  getContractError,
  numberToHex,
  parseAccount,
} from 'viem/utils';

export type AppPublicClient = ReturnType<typeof getAppPublicClient>;

type CallParametersStateDiff<TChain extends Chain | undefined> =
  CallParameters<TChain> & {
    stateDiff?: Record<Address, Record<Hex, Hex>>;
  };

export type SimulateContractWithStateDiffParameters<
  TChain extends Chain | undefined,
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainOverride extends Chain | undefined,
> = SimulateContractParameters<TAbi, TFunctionName, TChain, TChainOverride> & {
  stateDiff?: CallParametersStateDiff<TChain>['stateDiff'];
};

export const getAppPublicClient = (client: PublicClient) => {
  return client; //.extend(usePublicClientExtensions);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usePublicClientExtensions = (provider: PublicClient) => {
  return {
    simulateContractWithStateDiff: simulateContractWithStateDiff.bind(
      this,
      provider,
    ),
  };
};

export async function simulateContractWithStateDiff<
  TChain extends Chain | undefined,
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    abi,
    address,
    args,
    dataSuffix,
    functionName,
    ...callRequest
  }: SimulateContractWithStateDiffParameters<
    TChain,
    TAbi,
    TFunctionName,
    TChainOverride
  >,
) {
  const account = callRequest.account
    ? parseAccount(callRequest.account)
    : undefined;

  const calldata = encodeFunctionData({
    abi,
    args,
    functionName,
  } as unknown as EncodeFunctionDataParameters<TAbi, TFunctionName>);

  try {
    const { data } = await call(client, {
      batch: false,
      data: `${calldata}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
      to: address,
      from: account?.address,
      ...callRequest,
    });

    const result = decodeFunctionResult({
      abi,
      args,
      functionName,
      data: data || '0x',
    } as DecodeFunctionResultParameters);

    return {
      result,
      request: {
        abi,
        address,
        args,
        dataSuffix,
        functionName,
        ...callRequest,
      },
    } as unknown as SimulateContractReturnType<
      TAbi,
      TFunctionName,
      TChain,
      TChainOverride
    >;
  } catch (err) {
    throw getContractError(err as BaseError, {
      abi: abi as Abi,
      address,
      args,
      docsPath: '/docs/contract/simulateContract',
      functionName,
      sender: account?.address,
    });
  }
}

export async function call<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  args: CallParametersStateDiff<TChain>,
): Promise<CallReturnType> {
  const {
    account: account_ = client.account,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    batch = Boolean(client.batch?.multicall),
    blockNumber,
    blockTag = 'latest',
    accessList,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value,
    stateDiff,
    ...rest
  } = args;
  const account = account_ ? parseAccount(account_) : undefined;

  try {
    assertRequest(args);

    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
    const block = blockNumberHex || blockTag;

    const format =
      client.chain?.formatters?.transactionRequest?.format ||
      formatTransactionRequest;

    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format }),
      from: account?.address,
      accessList,
      data,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
    } as TransactionRequest) as TransactionRequest;

    const response = await client.request({
      method: 'eth_call',
      params: stateDiff
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ([request as Partial<RpcTransactionRequest>, block, stateDiff] as any)
        : [request as Partial<RpcTransactionRequest>, block],
    });
    if (response === '0x') return { data: undefined };
    return { data: response };
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw getCallError(err as any, {
      ...args,
      account,
      chain: client.chain,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRevertErrorData(err: unknown) {
  if (!(err instanceof BaseError)) return undefined;
  const error = err.walk() as RawContractError;
  return typeof error.data === 'object' ? error.data.data : error.data;
}

function extract(
  value: Record<string, unknown>,
  { format }: { format?: ChainFormatter['format'] },
) {
  if (!format) return {};
  const keys = Object.keys(format({}));
  return keys.reduce((data: Record<string, unknown>, key) => {
    // biome-ignore lint/suspicious/noPrototypeBuiltins:
    // eslint-disable-next-line no-prototype-builtins
    if (value?.hasOwnProperty(key)) {
      data[key] = value[key];
    }
    return data;
  }, {});
}
