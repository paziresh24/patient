/* eslint-disable @next/next/no-img-element */
import Card from '@/common/components/atom/card';
import Text from '@/common/components/atom/text';
import ChevronIcon from '@/common/components/icons/chevron';
import getConfig from 'next/config';
import Link from 'next/link';
const { publicRuntimeConfig } = getConfig();

interface CategoryCardProps {
  url: string;
  image: string;
  title: string;
  count: string;
}

export const CategoryCard = (props: CategoryCardProps) => {
  const { count, image, title, url } = props;
  return (
    <Link href={url} shallow scroll>
      <Card className="flex !flex-row items-center justify-between cursor-pointer">
        <div className="flex items-center space-s-3">
          <img src={publicRuntimeConfig.CDN_BASE_URL + image} alt={title} loading="lazy" className="w-8 h-8" width={32} height={32} />
          <Text fontSize="sm" fontWeight="bold">
            {title}
          </Text>
        </div>
        <div className="flex items-center space-s-2">
          <Text fontSize="xs">{count} پزشک</Text>
          <ChevronIcon dir="left" />
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
