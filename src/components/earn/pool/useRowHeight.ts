import { useMediaQuery } from '@/hooks/useMediaQuery';

const expandedRowHeights = {
  small: 358,
  medium: 358,
  large: 358,
  extralarge: 358,
  default: 358,
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
