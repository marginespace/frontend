export const getTransactionUrl = (
  etherscanUrl: string,
  transactionHash: string,
) => {
  return etherscanUrl.concat(`/tx/${transactionHash}`);
};
