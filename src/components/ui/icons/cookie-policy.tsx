interface Props {
  className?: string;
}

const CookiePolicy = ({ className }: Props): JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      fill="currentColor"
    />
    <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" />
    <path
      d="M12 18C14.28 18 16.22 16.4 17.3 14C17.08 13.9 16.85 13.83 16.6 13.8C16.05 13.73 15.5 13.88 15.07 14.21C14.64 14.54 14.36 15.03 14.3 15.58C14.25 16.13 14.43 16.68 14.79 17.11C13.95 17.62 13.01 17.96 12 17.96C11.99 17.96 11.99 17.96 11.98 17.96C11.99 17.96 11.99 17.97 12 17.97C12 17.99 12 18 12 18Z"
      fill="currentColor"
    />
  </svg>
);

export default CookiePolicy;

