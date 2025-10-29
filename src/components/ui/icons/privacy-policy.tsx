interface Props {
  className?: string;
}

const PrivacyPolicy = ({ className }: Props): JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11C10.9 11 10 10.1 10 9C10 7.9 10.9 7 12 7ZM16 16C15.86 16.28 15.69 16.54 15.5 16.78C14.95 17.54 14.28 18.19 13.51 18.69C12.74 19.19 11.88 19.45 11 19.45C10.12 19.45 9.26 19.19 8.49 18.69C7.72 18.19 7.05 17.54 6.5 16.78C6.31 16.54 6.14 16.28 6 16V13H16V16Z"
      fill="currentColor"
    />
  </svg>
);

export default PrivacyPolicy;

