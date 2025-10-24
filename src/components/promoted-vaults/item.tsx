import { forwardRef, type CSSProperties } from 'react';

import { VaultItem, type VaultItemProps } from './ui/vault-item';

export type ItemProps = VaultItemProps & {
  withOpacity?: boolean;
  isDragging?: boolean;
};

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ withOpacity, isDragging, style, ...props }, ref) => {
    const inlineStyles: CSSProperties = {
      opacity: withOpacity ? '0.5' : '1',
      transformOrigin: '50% 50%',
      cursor: isDragging ? 'grabbing' : 'grab',
      boxShadow: isDragging
        ? 'rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px'
        : 'rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px',
      transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      ...style,
    };

    return (
      <VaultItem
        ref={ref}
        style={inlineStyles}
        addedDate="09-11-2023"
        {...props}
      />
    );
  },
);
Item.displayName = 'PromotedVaultGridItem';
