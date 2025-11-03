export const hashColor = (label: string, value: number): string => {
  let hash = 0;
  const stringValue = label + value;
  for (let i = 0; i < stringValue.length; i++) {
    const character = stringValue.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash |= 0;
  }
  const color = Math.abs(hash).toString(16).padStart(6, '0').substring(0, 6);
  return `#${color}`;
};
