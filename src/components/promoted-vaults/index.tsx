'use client';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useState, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

import { Item } from './item';
import { SortableItem } from './sortable-item';
import { PromotedVaultsModal } from './ui/modal';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { setPromotedVaults } from '@/actions/set-promouted-vaults';
import { Button } from '@/ui/button';
import { useToast } from '@/ui/use-toast';

type Props = {
  vaults: VaultWithApyAndTvl[];
  allVaults: VaultWithApyAndTvl[];
};

export default function PromotedVaultsGrid({ vaults, allVaults }: Props) {
  const [items, setItems] = useState<VaultWithApyAndTvl[]>(vaults);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = items.findIndex((v) => v.id === active.id);
        const newIndex = items.findIndex((v) => v.id === over!.id);

        setItems(arrayMove(items, oldIndex, newIndex));
        setIsChanged(true);
      }

      setActiveId(null);
    },
    [items],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleRemove = (id: string) => {
    setItems((items) => items.filter((v) => v.id !== id));
  };

  const handleSave = useCallback(async () => {
    if (walletClient && address) {
      const res = await setPromotedVaults(
        items.map((vault) => vault.id),
        walletClient,
      );

      if (res?.status === 200) {
        setIsChanged(false);
        toast({
          title: 'Vaults saved successfully',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error during saving',
          description: 'Please try again later',
        });
      }
    }
  }, [address, items, toast, walletClient]);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="my-4 text-sm font-medium text-white">
          Drag vault to change its order number
        </p>
        <Button
          onClick={handleSave}
          variant="outlined"
          className="px-4 text-sm"
          disabled={!isChanged}
        >
          Save promoted
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 gap-3 rounded-[26px] bg-transparent-bg p-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((vault, index) => (
              <SortableItem
                onCloseClick={handleRemove}
                displayedIndex={index + 1}
                length={items.length}
                vault={vault}
                key={vault.id}
                id={vault.id}
              />
            ))}
            <PromotedVaultsModal
              items={allVaults.filter(
                (vault) => !items.some((item) => item.id === vault.id),
              )}
              total={items.length + 1}
              promotedItems={items}
              setPromotedItems={setItems}
            />
          </div>
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
          {activeId ? (
            <Item
              length={items.length}
              vault={vaults.find((v) => v.id == activeId) as VaultWithApyAndTvl}
              id={activeId}
              onCloseClick={handleRemove}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
