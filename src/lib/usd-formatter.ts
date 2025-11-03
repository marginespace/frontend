export const usdFormatter = (value: number) => {
  const isNegative = value < 0;
  if (isNegative) {
    value = Math.abs(value);
  }

  return `${isNegative ? '-' : ''}$${value.toFixed(2)}`;
};
