import { SortArrowSvg } from './sort-arrow-svg';

type Props = {
  title: string;
  up: boolean;
  down: boolean;
  handleChange: (up: boolean, down: boolean, title: string) => void;
};

export const SortItem = ({ title, up, down, handleChange }: Props) => {
  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-[4px] px-[12px] py-[10px] transition-colors hover:bg-gray-50"
      onClick={() => handleChange(up, down, title)}
    >
      <SortArrowSvg color={up ? `#D46B30` : '#667085'} />
      <h3
        className={`mx-[12px] font-medium ${
          up || down ? 'text-primary' : 'text-additional-grey'
        }`}
      >
        {title}
      </h3>
      <SortArrowSvg color={down ? `#D46B30` : '#667085'} rotate={true} />
    </div>
  );
};
