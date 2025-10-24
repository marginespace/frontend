export const timeout = (ms: number) =>
  new Promise<void>((res) => setTimeout(res, ms));
