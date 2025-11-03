import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

const VaultArrow = ({ className }: Props): JSX.Element => {
  return (
    <div
      className={cn(
        'group/vault-arrow h-[24px] rounded-full transition-all',
        className,
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-all group-hover/vault-arrow:opacity-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.53 13.03L12.53 16.03C12.38 16.18 12.19 16.25 12 16.25C11.81 16.25 11.62 16.18 11.47 16.03L8.47 13.03C8.18 12.74 8.18 12.26 8.47 11.97C8.76 11.68 9.24 11.68 9.53 11.97L11.25 13.69V8.5C11.25 8.09 11.59 7.75 12 7.75C12.41 7.75 12.75 8.09 12.75 8.5V13.69L14.47 11.97C14.76 11.68 15.24 11.68 15.53 11.97C15.82 12.26 15.82 12.74 15.53 13.03Z"
          fill="#D46B30"
        />
      </svg>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="-translate-y-6 opacity-0 transition-all group-hover/vault-arrow:opacity-100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="#CFC9FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8.5V14.5"
          stroke="#CFC9FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12.5L12 15.5L15 12.5"
          stroke="#CFC9FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default VaultArrow;
