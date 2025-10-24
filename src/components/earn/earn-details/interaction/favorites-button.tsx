'use client';
import { useIsMounted } from '@redduck/helpers-react';
import { useMemo } from 'react';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { Button } from '@/components/ui/button';
import { Star, StarOutlined } from '@/components/ui/icons';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

type VaultPageContainerProps = {
  cube: CubeWithApyAndTvl;
};

export const FavoritesButton = ({ cube }: VaultPageContainerProps) => {
  const isMounted = useIsMounted();
  const isExtraSmallDevice = useMediaQuery('(max-width: 639px)');

  const [savedVaults, setSavedVaults] = useLocalStorage<string[]>(
    'saved-cubes',
    [],
  );

  const addedToFavorites = useMemo(
    () => savedVaults?.find((v) => v === cube.id),
    [savedVaults, cube.id],
  );

  const handleAddToFavoritesClick = () => {
    setSavedVaults((prevSavedVaults) => {
      if (prevSavedVaults?.find((foundVault) => foundVault === cube.id)) {
        return prevSavedVaults.filter((foundVault) => foundVault !== cube.id);
      } else {
        return [...(prevSavedVaults || []), cube.id];
      }
    });
  };

  if (!isMounted)
    return (
      <Button
        variant="outlined"
        className="ml-[8px] transition-colors [&>svg]:fill-white"
      >
        Add to Favorites
        <Star className="ml-2 h-[20px] w-[20px]" />
      </Button>
    );

  return (
    <Button
      variant="outlined"
      className={cn(
        'ml-[8px] border-white text-white transition-colors [&>svg]:fill-white',
        addedToFavorites ? 'bg-[rgba(255,255,255,0.36)]' : '',
        isExtraSmallDevice ? 'border-none bg-transparent' : '',
      )}
      onClick={handleAddToFavoritesClick}
    >
      {isExtraSmallDevice ? (
        ''
      ) : addedToFavorites ? (
        <span className="mr-2">Remove from Favorites</span>
      ) : (
        <span className="mr-2">Add to Favorites</span>
      )}
      {isExtraSmallDevice ? (
        <Star className="h-[20px] w-[20px]" />
      ) : (
        <StarOutlined className="h-[20px] w-[20px]" />
      )}
    </Button>
  );
};
