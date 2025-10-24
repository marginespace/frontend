import formatDistance from 'date-fns/formatDistance';
import enUS from 'date-fns/locale/en-US';

export const lastHarvestFormatter = (lastHarvestTimestamp?: number) =>
  lastHarvestTimestamp
    ? formatDistance(new Date(lastHarvestTimestamp * 1000), new Date(), {
        locale: enUS,
        addSuffix: true,
      })
    : undefined;
