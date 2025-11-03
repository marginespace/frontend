'use client';
import { Close } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useAccount, useWalletClient } from 'wagmi';

import { BackButton } from './back-button';
import { SearchInput } from './search-input';
import { VaultItem } from './vault-item';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { setPromotedVaults } from '@/actions/set-promouted-vaults';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContentWithoutClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Fire } from '@/components/ui/icons';

type Props = {
  items: VaultWithApyAndTvl[];
  total: number;
  promotedItems: VaultWithApyAndTvl[];
  setPromotedItems: (vaults: VaultWithApyAndTvl[]) => void;
};

export function PromotedVaultsModal({
  total,
  items,
  promotedItems,
  setPromotedItems,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredResults, setFilteredResults] =
    useState<VaultWithApyAndTvl[]>(items);
  const [selected, setSelected] = useState<string[]>([]);

  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const debouncedSearch = useDebouncedCallback((value) => {
    const vaultSearchKeys: (keyof VaultWithApyAndTvl)[] = [
      'name',
      'platformId',
      'chain',
    ];
    const lowerCaseValue = value.toLowerCase();

    const filteredData = items.filter((item) =>
      vaultSearchKeys.some((prop) =>
        String(item[prop]).toLowerCase().includes(lowerCaseValue),
      ),
    );

    setFilteredResults(filteredData);
  }, 500);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePromote = useCallback(
    (id: string) => {
      selected.includes(id)
        ? setSelected(selected.filter((item) => item !== id))
        : setSelected([...selected, id]);
    },
    [selected],
  );

  const handleSubmit = async () => {
    try {
      if (!walletClient || !address) return;
      const res = await setPromotedVaults(
        [...promotedItems.map((item) => item.id), ...selected],
        walletClient,
      );
      if (res && res.status === 200) {
        setPromotedItems([
          ...promotedItems,
          ...items.filter((item) => selected.includes(item.id)),
        ]);
        setSelected([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="border-primary flex min-h-[221px] flex-col rounded-[10px] border bg-gradient-to-b from-[rgba(255,255,255,0.28)] via-[rgba(255,255,255,0.17)] p-2 lg:p-4 xl:min-h-[232px]">
        <div className="border-b border-dashed border-[rgba(255,255,255,0.2)] pb-2 text-base font-semibold">
          {total}
        </div>
        <div className="flex h-full items-center justify-center">
          <DialogTrigger asChild>
            <Button className="bg-transparent text-white hover:bg-transparent">
              <Plus />
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContentWithoutClose className="flex max-h-[90vh] max-w-[80%] flex-col bg-[#272536]">
        <DialogHeader className="flex flex-row items-center justify-between gap-[40px]">
          <div className="flex flex-1 items-center">
            <Close>
              <BackButton />
            </Close>
            <div className="!my-0 ml-auto flex h-8 translate-x-5 items-center rounded-[8px] bg-[#D85F5A] px-3 py-[6px]">
              <p className="mr-1 cursor-default text-sm font-semibold">
                Hot Vault
              </p>
              <Fire className="fill-white" />
            </div>
          </div>
          <SearchInput value={searchTerm} onChange={handleSearchChange} />
        </DialogHeader>
        {filteredResults.length ? (
          <div className="white-scrollbar grid h-full grid-cols-3 gap-4 overflow-y-auto py-4 pr-3">
            {filteredResults.map((vault, index) => (
              <VaultItem
                selected={selected.includes(vault.id)}
                displayedIndex={index + 1}
                vault={vault}
                key={vault.id}
                id={vault.id}
                onCheckboxClick={handlePromote}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center text-white">
            No Results Found
          </div>
        )}
        <DialogFooter>
          <div className="mr-auto flex h-full">
            <p className="mt-auto self-baseline text-base font-semibold">
              <span>{selected.length} </span>
              <span className="text-light-grey">/ {items.length}</span>
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            className="text-wgite bg-light-purple hover:bg-light-purple-hover"
            type="submit"
          >
            Add to promoted
          </Button>
        </DialogFooter>
      </DialogContentWithoutClose>
    </Dialog>
  );
}
