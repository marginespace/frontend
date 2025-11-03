type Props = {
  className?: string;
};

const ChainsBase = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="12" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM5.00004 12.5C5.25645 16.1423 8.29246 19.0175 12 19.0175C15.8757 19.0175 19.0175 15.8757 19.0175 12C19.0175 8.12434 15.8757 4.9825 12 4.9825C8.29223 4.9825 5.25609 7.85803 4.99999 11.5007L15.3794 11.5V12.5H5.00004Z"
        fill="#0052FF"
      />
    </svg>
  );
};

export default ChainsBase;
