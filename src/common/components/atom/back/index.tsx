import { useRouter } from 'next/router';
import BackIcon from '../../icons/back';

const Back = () => {
  const router = useRouter();
  return (
    <div onClick={router.back} className="ml-2 cursor-pointer">
      <BackIcon />
    </div>
  );
};

export default Back;
