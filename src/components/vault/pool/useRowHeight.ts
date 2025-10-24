import { useMediaQuery } from '@/hooks/useMediaQuery';

const expandedRowHeights = {
  small: 442,
  medium: 462,
  large: 498,
  extralarge: 462,
  default: 442,
};

const expandedBoostedRowHeights = {
  small: 518,
  medium: 538,
  large: 576,
  extralarge: 538,
  default: 518,
};

export const useExpandedRowHeight = () => {
  const isSmallDevice = useMediaQuery('(max-width: 767px)');
  const isMediumDevice = useMediaQuery(
    '(min-width: 768px) and (max-width: 1023px)',
  );
  const isLargeDevice = useMediaQuery(
    '(min-width: 1024px) and (max-width: 1108px)',
  );
  const isExtraLargeDevice = useMediaQuery(
    '(min-width: 1109px) and (max-width: 1717px)',
  );

  const deviceSize = isSmallDevice
    ? 'small'
    : isMediumDevice
    ? 'medium'
    : isLargeDevice
    ? 'large'
    : isExtraLargeDevice
    ? 'extralarge'
    : 'default';
  const expandedRowHeight = expandedRowHeights[deviceSize];

  return expandedRowHeight;
};

export const useExpandedBoostedRowHeight = () => {
  const isSmallDevice = useMediaQuery('(max-width: 767px)');
  const isMediumDevice = useMediaQuery(
    '(min-width: 768px) and (max-width: 1023px)',
  );
  const isLargeDevice = useMediaQuery(
    '(min-width: 1024px) and (max-width: 1108px)',
  );
  const isExtraLargeDevice = useMediaQuery(
    '(min-width: 1109px) and (max-width: 1717px)',
  );

  const deviceSize = isSmallDevice
    ? 'small'
    : isMediumDevice
    ? 'medium'
    : isLargeDevice
    ? 'large'
    : isExtraLargeDevice
    ? 'extralarge'
    : 'default';
  const expandedBoostedRowHeight = expandedBoostedRowHeights[deviceSize];

  return expandedBoostedRowHeight;
};
