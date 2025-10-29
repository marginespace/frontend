import type React from 'react';

type Props = Omit<React.SVGProps<SVGSVGElement>, 'rotate'> & {
  color: string;
  rotate?: boolean;
};

export const SortArrowSvg: React.FC<Props> = ({ color, rotate, className, ...props }) => {
  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`${rotate ? 'rotate-180' : ''} ${className || ''} transition-all`}
    >
      <path
        d="M12.92 0.179688H6.68999H1.07999C0.119992 0.179688 -0.360007 1.33969 0.319993 2.01969L5.49999 7.19969C6.32999 8.02969 7.67999 8.02969 8.50999 7.19969L10.48 5.22969L13.69 2.01969C14.36 1.33969 13.88 0.179688 12.92 0.179688Z"
        fill={color}
        className="transition-all"
      />
    </svg>
  );
};
