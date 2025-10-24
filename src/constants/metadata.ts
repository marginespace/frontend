export const appName = 'Cubera';
export const appDescription =
  'Margin Space is a decentralized application that allows users to stake their crypto assets and earn rewards.';

export const getAppUrl = () =>
  typeof window !== 'undefined' ? window.location.origin : '';
