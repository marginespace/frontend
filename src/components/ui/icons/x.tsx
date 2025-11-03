interface Props {
  className?: string;
}

const X = ({ className }: Props): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.04392 6.51236H7.30411L14.9869 17.4874H16.7262L9.04392 6.51236Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.5811 12.6574L5.66744 5.63636H9.45439L12.676 10.2373L16.663 5.63636H17.7759L13.1732 10.9489L18.3636 18.3636H14.5775L11.0785 13.3669L6.74924 18.3634H5.63636L10.5811 12.6574Z"
      fill="white"
    />
  </svg>
);

export default X;
