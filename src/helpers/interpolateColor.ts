export const interpolateColor = (
  value: number,
  minVal: number,
  maxVal: number,
  startColor: string,
  endColor: string,
): string => {
  const parsedStartColor = parseHexColor(startColor);
  const parsedEndColor = parseHexColor(endColor);

  const fraction = (value - minVal) / (maxVal - minVal);

  const r = Math.round(
    parsedStartColor.r + (parsedEndColor.r - parsedStartColor.r) * fraction,
  )
    .toString(16)
    .padStart(2, '0');
  const g = Math.round(
    parsedStartColor.g + (parsedEndColor.g - parsedStartColor.g) * fraction,
  )
    .toString(16)
    .padStart(2, '0');
  const b = parsedEndColor.b.toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
};

function parseHexColor(hexColor: string) {
  if (hexColor.length !== 7) {
    throw new Error('Invalid hex color format');
  }

  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  return { r, g, b };
}
