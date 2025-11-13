'use client';

import { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { toast } from 'sonner';

interface HarvestSettingsProps {
  strategyAddress: string;
  chainId: number;
}

export const HarvestSettings = ({ 
  strategyAddress, 
  chainId 
}: HarvestSettingsProps) => {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });
  
  const [harvestOnDeposit, setHarvestOnDeposit] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  // ABI для strategy
  const strategyAbi = [
    {
      inputs: [],
      name: 'harvestOnDeposit',
      outputs: [{ type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ name: '_harvestOnDeposit', type: 'bool' }],
      name: 'setHarvestOnDeposit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'keeper',
      outputs: [{ type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const;

  // Загрузить текущее состояние
  useEffect(() => {
    const loadSettings = async () => {
      if (!publicClient || !address) {
        setChecking(false);
        return;
      }

      try {
        setChecking(true);

        // Проверить harvestOnDeposit
        const harvestOn = await publicClient.readContract({
          address: strategyAddress as `0x${string}`,
          abi: strategyAbi,
          functionName: 'harvestOnDeposit',
        });
        setHarvestOnDeposit(harvestOn as boolean);

        // Проверить права manager (owner ИЛИ keeper)
        const [keeper, owner] = await Promise.all([
          publicClient.readContract({
            address: strategyAddress as `0x${string}`,
            abi: strategyAbi,
            functionName: 'keeper',
          }),
          publicClient.readContract({
            address: strategyAddress as `0x${string}`,
            abi: strategyAbi,
            functionName: 'owner',
          }),
        ]);
        
        const isKeeperOrOwner = 
          (keeper as string).toLowerCase() === address.toLowerCase() ||
          (owner as string).toLowerCase() === address.toLowerCase();
        
        setIsManager(isKeeperOrOwner);
      } catch (error) {
        console.error('Failed to load harvest settings:', error);
        setIsManager(false);
      } finally {
        setChecking(false);
      }
    };

    loadSettings();
  }, [publicClient, address, strategyAddress]);

  // Изменить настройку
  const toggleHarvestOnDeposit = async () => {
    if (!walletClient || !isManager) {
      toast.error('You do not have permission to change this setting');
      return;
    }

    setLoading(true);

    try {
      const hash = await walletClient.writeContract({
        address: strategyAddress as `0x${string}`,
        abi: strategyAbi,
        functionName: 'setHarvestOnDeposit',
        args: [!harvestOnDeposit],
      });

      toast.info('Transaction submitted, waiting for confirmation...');

      // Дождаться подтверждения
      await publicClient!.waitForTransactionReceipt({ hash });

      setHarvestOnDeposit(!harvestOnDeposit);
      toast.success(
        `Auto-compound on deposit ${!harvestOnDeposit ? 'enabled' : 'disabled'}!`
      );
    } catch (error: any) {
      console.error('Failed to update harvest setting:', error);
      toast.error(error.shortMessage || error.message || 'Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  // Если проверяем права - показываем loader
  if (checking) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
          <p className="text-sm text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Если не manager - не показывать UI
  if (!isManager) return null;

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              Auto-Compound on Deposit
            </h3>
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${
                harvestOnDeposit
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {harvestOnDeposit ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {harvestOnDeposit
              ? 'Harvest will run automatically on every deposit (higher gas cost)'
              : 'Harvest will run via Gelato Automation (lower gas cost for deposits)'}
          </p>
        </div>
        
        <button
          onClick={toggleHarvestOnDeposit}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            loading
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          } ${
            harvestOnDeposit ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              harvestOnDeposit ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {loading && (
        <div className="mt-3 flex items-center gap-2 rounded bg-yellow-900/20 p-2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-yellow-600 border-t-yellow-400" />
          <p className="text-xs text-yellow-400">
            Transaction pending...
          </p>
        </div>
      )}

      <div className="mt-3 rounded bg-gray-800 p-2">
        <p className="text-xs text-gray-400">
          💡 <strong>Tip:</strong> Enable for high APY vaults with frequent deposits.
          Disable for lower APY vaults to save gas costs.
        </p>
      </div>
    </div>
  );
};

