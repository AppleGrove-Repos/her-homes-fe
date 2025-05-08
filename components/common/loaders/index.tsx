import { LoaderIcon } from 'lucide-react';
import { FC } from 'react';

interface Props {
  size?: number;
}

const Loader: FC<Props> = ({ size = 40 }) => {
  return (
    <div className="size-12 grid place-content-center rounded-full bg-secondary-800 shadow-md animate-pulse">
      <LoaderIcon className="animate-spin text-primary" size={size} />
    </div>
  );
};

export default Loader;
