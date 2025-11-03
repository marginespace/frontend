import { TooltipItem } from '@/components/tooltip-item';
import { stopLossesLabels, StopLossValue } from '@/constants/earn-details';
import { cn } from '@/lib/utils';

type RiskManagementProps = {
  activeOption: StopLossValue;
  stopLossesPercents: {
    id: number;
    value: number;
  }[];
  onClick: (value: StopLossValue) => void;
};

export default function RiskManagement({
  activeOption,
  stopLossesPercents,
  onClick,
}: RiskManagementProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 [&>div]:flex">
        <p className="text-sm font-semibold text-text-grey">
          Risk Management options:
        </p>
        <TooltipItem>
          <div className="flex max-w-[245px] flex-col gap-1">
            <p className="text-xs font-medium text-additional-grey">
              Margin Space uses a Stop-Loss order, which serves to control the
              risks of a fall in the price of assets in vault.
            </p>
          </div>
        </TooltipItem>
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex">
        {Object.entries(stopLossesLabels).map(([option, stopLossLabel]) => {
          const stopLoss = stopLossesPercents.find(
            (s) => s.id === stopLossLabel.id,
          );
          const selectedOption = activeOption === option;
          const label =
            (option as StopLossValue) !== StopLossValue.NONE
              ? stopLossLabel.label + ' ' + stopLoss?.value + '%'
              : '';

          return (
            <div
              key={stopLossLabel.id}
              onClick={() => onClick(option as StopLossValue)}
              className={cn(
                'flex flex-1 cursor-pointer items-center justify-center rounded-[8px] px-3 py-2 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] backdrop-blur-[10px]',
                selectedOption
                  ? 'bg-light-purple !text-white'
                  : 'bg-transparent-bg-dark',
              )}
            >
              <div className="select-none text-sm font-medium">
                {label ? (
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        background: selectedOption
                          ? 'white'
                          : stopLossLabel.color,
                      }}
                      className="h-2 w-2 rounded-full"
                    />
                    <p
                      style={{
                        color: selectedOption ? 'white' : stopLossLabel.color,
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ) : (
                  <p>None</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
