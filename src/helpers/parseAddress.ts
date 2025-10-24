export const parseAddress = (address: string): string => {
  if (address.length < 6) return address;

  const firstTwo = address.slice(0, 4);
  const lastFour = address.slice(-4);

  return `${firstTwo}..${lastFour}`;
};
