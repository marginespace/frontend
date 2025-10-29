import { SortArrowSvg } from './sort-arrow-svg';

type Props = {
  title: string;
  up: boolean;
  down: boolean;
  handleChange: (up: boolean, down: boolean, title: string) => void;
};

export const SortItem = ({ title, up, down, handleChange }: Props) => {
  const isActive = up || down;
  
  return (
    <div
      className={`group flex cursor-pointer items-center justify-between gap-3 rounded-[10px] px-4 py-3 transition-all duration-200 ${
        isActive
          ? 'bg-primary/10 shadow-[0_0_0_1px_rgba(212,107,48,0.2)]'
          : 'hover:bg-gray-50 active:bg-gray-100'
      }`}
      onClick={() => handleChange(up, down, title)}
    >
      <SortArrowSvg 
        color={up ? '#D46B30' : isActive ? '#D46B30' : '#9CA3AF'} 
        className={`transition-all duration-200 ${up ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}
      />
      <h3
        className={`flex-1 text-center text-[15px] font-semibold transition-colors duration-200 ${
          isActive ? 'text-primary' : 'text-[#374151] group-hover:text-[#1F2937]'
        }`}
      >
        {title}
      </h3>
      <SortArrowSvg 
        color={down ? '#D46B30' : isActive ? '#D46B30' : '#9CA3AF'} 
        rotate={true} 
        className={`transition-all duration-200 ${down ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}
      />
    </div>
  );
};
