import { Close } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';

import { TooltipItem } from '@/components/tooltip-item';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, Danger } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { DEFAULT_WITHDRAW_SLIPPAGE } from '@/constants/slippage';
import { cn } from '@/lib/utils';

type SlippageFormData = {
  buttonValue: string;
  inputValue: string;
};

type SlippageModalPrpos = {
  slippageValue: number;
  onSlippageChange: (slippage: number) => void;
};

export function SlippageModal({
  slippageValue,
  onSlippageChange,
}: SlippageModalPrpos) {
  const { toast } = useToast();
  const { handleSubmit, setValue, control } = useForm<SlippageFormData>({
    defaultValues: {
      buttonValue: String(slippageValue),
      inputValue: String(slippageValue),
    },
  });
  const [selected, setSelected] = useState(String(slippageValue));
  const [inputSelected, setInputSelected] = useState(false);
  const [dirty, setDirty] = useState(false);

  const onSubmit: SubmitHandler<SlippageFormData> = (data) => {
    onSlippageChange(
      Number(inputSelected ? data.inputValue : data.buttonValue),
    );
    setDirty(false);
    toast({
      title: 'Success',
      description: 'Slippage settings were successfully saved',
    });
  };

  const buttonValues = [String(DEFAULT_WITHDRAW_SLIPPAGE), '0.3', '0.5', '1'];

  const handleButtonClick = (value: string) => {
    setValue('buttonValue', value);
    setInputSelected(false);
    setSelected(value);
    setDirty(true);
  };

  const handleInputClick = () => {
    setInputSelected(true);
    setDirty(true);
  };

  const validateInput = (value: string) => {
    return /^\d*\.?\d*$/.test(value);
  };

  const handleSetDefaultClick = () => {
    setInputSelected(false);
    setValue('buttonValue', String(DEFAULT_WITHDRAW_SLIPPAGE));
    setValue('inputValue', String(DEFAULT_WITHDRAW_SLIPPAGE));
    setSelected(String(DEFAULT_WITHDRAW_SLIPPAGE));
    setDirty(true);
  };

  const handleBlur = () => {
    if (dirty) {
      setValue('buttonValue', String(slippageValue));
      setValue('inputValue', String(slippageValue));
      setSelected(String(slippageValue));
      toast({
        title: 'Carefully',
        description: 'Slippage settings have not been saved',
        variant: 'destructive',
      });
      setDirty(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="group  flex gap-1 self-end p-1 underline-offset-4 ">
        <span className="group-hover:text-primary text-sm font-semibold transition-all group-hover:underline">
          Settings
        </span>
        <Settings className="fill-light-purple" />
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={handleBlur}
        onEscapeKeyDown={handleBlur}
        className="max-w-[70%] bg-[#272536] lg:max-w-[60%] xl:max-w-[50%]"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-text-grey">
                  Slippage tolerance
                </span>
                <TooltipItem contentClassName="w-[400px]">
                  <p className="text-xs font-medium text-text-light">
                    Slippage is the difference between a trade&apos;s expected
                    or requested price and the price at which the trade is
                    effectively executed. It typically occurs in markets
                    experiencing high volatility or low liquidity.
                  </p>
                </TooltipItem>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {buttonValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={cn(
                      'cursor-pointer rounded bg-[rgba(53,40,82,.5)] px-3 py-2 text-center text-sm font-medium',
                      !inputSelected && selected === value
                        ? 'bg-light-purple'
                        : '',
                    )}
                    onClick={() => handleButtonClick(value)}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-text-grey">
                  Custom
                </span>
              </div>
              <Controller
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onClick={handleInputClick}
                    value={field.value + '%'}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/%$/, '');
                      if (validateInput(newValue)) {
                        field.onChange(
                          parseInt(newValue) >= 100 ? '100' : newValue,
                        );
                      }
                    }}
                    className={cn(
                      'w-[calc(50%_-_6px)] bg-[#3E3C4B] p-4 text-center outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 md:w-[calc(25%_-_9px)]',
                      inputSelected || !buttonValues.includes(selected)
                        ? 'border-[#E9C268]'
                        : '',
                    )}
                  />
                )}
                name="inputValue"
              />
              <div
                className={cn(
                  'flex gap-2 transition-all',
                  inputSelected || !buttonValues.includes(selected)
                    ? 'visible opacity-100'
                    : 'invisible opacity-0',
                )}
              >
                <Danger />
                <p className="text-xs font-medium text-[#E9C268]">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              onClick={handleSetDefaultClick}
              className="h-[30px] border border-white bg-[#3E3C4B] px-3 py-1 text-xs font-semibold text-white hover:bg-[#4A485A]"
            >
              Set up default
            </Button>
          </div>
          <Close
            type="submit"
            className="bg-light-purple hover:bg-light-purple-hover inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors"
          >
            Save changes
          </Close>
        </form>
      </DialogContent>
    </Dialog>
  );
}
