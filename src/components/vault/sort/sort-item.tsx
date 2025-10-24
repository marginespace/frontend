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
      className="flex cursor-pointer items-center justify-between px-[12px] py-[10px]"
      onClick={() => handleChange(up, down, title)}
    >
      <SortArrowSvg color={up ? `#A093FE` : '#667085'} />
      <h3
        className={`mx-[12px] font-medium ${
          up || down ? 'text-light-purple' : 'text-additional-grey'
        }`}
      >
        {title}
      </h3>
      <SortArrowSvg color={down ? `#A093FE` : '#293056'} rotate={true} />
    </div>
  );
};
