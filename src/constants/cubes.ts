export type CubesTabValue = 'all' | 'my' | 'saved';

type CubesTabDataItem = {
  value: CubesTabValue;
  label: string;
};

export const cubesTabsData: CubesTabDataItem[] = [
  { value: 'all', label: 'All Cubes' },
  { value: 'my', label: 'My Cubes' },
  { value: 'saved', label: 'Saved Cubes' },
];
