import Text from '@/components/atom/text';
import { useRouter } from 'next/router';
import Skeleton from '../atom/skeleton';

interface TopBarProps {
  title: string;
  backButton?: Boolean;
  titleLoading?: Boolean;
}

export const TopBar = ({ title, backButton, titleLoading = false }: TopBarProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center h-16 px-6 bg-white shadow-md">
      {backButton && (
        <div onClick={router.back} className="ml-2 cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.4697 5.46967C12.7626 5.17678 13.2374 5.17678 13.5303 5.46967L19.5303 11.4697C19.8232 11.7626 19.8232 12.2374 19.5303 12.5303L13.5303 18.5303C13.2374 18.8232 12.7626 18.8232 12.4697 18.5303C12.1768 18.2374 12.1768 17.7626 12.4697 17.4697L17.1893 12.75H5C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25H17.1893L12.4697 6.53033C12.1768 6.23744 12.1768 5.76256 12.4697 5.46967Z"
              fill="#0F1D40"
            />
          </svg>
        </div>
      )}
      {titleLoading ? (
        <Skeleton w="7rem" h="1rem" rounded="full" />
      ) : (
        <Text fontWeight="bold" fontSize="sm">
          {title}
        </Text>
      )}
    </div>
  );
};

export default TopBar;
