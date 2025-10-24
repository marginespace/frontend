interface Props {
  className?: string;
}

const CuberaLabel = ({ className }: Props): JSX.Element => (
  <div className={`flex flex-col items-start ${className}`}>
    <span className="text-lg font-bold text-white">Margin</span>
    <span className="text-lg font-bold text-white">Space</span>
  </div>
);

export default CuberaLabel;
