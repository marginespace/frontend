export type CubesTabValue = 'all' | 'my' | 'saved';

type CubesTabDataItem = {
  value: CubesTabValue;
  label: string;
};

export const cubesTabsData: CubesTabDataItem[] = [
  { value: 'all', label: 'All Strategies' },
  { value: 'my', label: 'My Strategies' },
  { value: 'saved', label: 'Saved Strategies' },
];
