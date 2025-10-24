export function convertArrayTo2DArray<T>(
  inputArray: T[],
  length: number,
): T[][] {
  const outputArray = [];
  let currentNestedArray = [];

  for (const element of inputArray) {
    currentNestedArray.push(element);

    if (currentNestedArray.length === length) {
      outputArray.push(currentNestedArray);
      currentNestedArray = [];
    }
  }

  if (currentNestedArray.length > 0) {
    outputArray.push(currentNestedArray);
  }

  return outputArray;
}
