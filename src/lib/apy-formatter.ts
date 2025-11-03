export const apyFormatter = (apy: number | string | null | undefined) => {
  return apy ? `${(parseFloat(apy.toString()) * 100).toFixed(2)}%` : '0.00%';
};
