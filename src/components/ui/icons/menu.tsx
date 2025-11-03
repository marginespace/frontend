interface Props {
  className?: string;
}

const Menu = ({ className }: Props): JSX.Element => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M3.93848 7H21.9385H3.93848Z" fill="white" />
    <path
      d="M3.93848 7H21.9385"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M3.93848 12H21.9385H3.93848Z" fill="white" />
    <path
      d="M3.93848 12H21.9385"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M3.93848 17H21.9385H3.93848Z" fill="white" />
    <path
      d="M3.93848 17H21.9385"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Menu;
