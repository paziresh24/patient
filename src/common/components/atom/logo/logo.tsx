/* eslint-disable jsx-a11y/alt-text */
import classNames from '@/common/utils/classNames';
import Text from '@/components/atom/text';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { ElementType } from 'react';
import logoSvg from './logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  className?: string;
  type?: 'default' | 'compact';
  as?: ElementType;
  home?: boolean;
}

export const Logo: React.FC<LogoProps> = props => {
  const { width = 60, height, fontSize, className, type = 'default', as, home } = props;
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center space-s-1 md:space-s-2">
      <div className='relative'>
        <svg xmlns="http://www.w3.org/2000/svg" className={classNames('absolute z-10')} style={{ top: -(width * 0.71) + "px", left: -(width * 0.71) + "px", width: (width * 1.7) + "px", height: (width * 1.7) + "px" }} viewBox="0 0 80 10" >
          <defs>
          </defs>
          <g>
            <path className="cls-4" style={{ fill: "#0d7b3e", }} d="m50.998,2.705c-16.524-7.869-26.136,4.257-26.136,4.257l2.53,3.619h0s6.075-6.539,16.682-5.752c12.507.928,23.763,7.082,32.733.079,0,0-9.285,5.665-25.809-2.203Z"></path>
            <path className="cls-3" style={{ fill: "#fff" }} d="m76.806,4.908c-8.97,7.003-20.227.849-32.733-.079-10.606-.787-16.682,5.752-16.682,5.752l2.676,3.828s7.021-7.062,17.014-5.803c8.846,1.114,18.849,4.921,26.759-.921-.236.193,1.749-1.432,2.807-2.603.053-.059.106-.114.158-.175Z"></path>
            <g>
              <path className="cls-1" style={{ fill: "#dc1116" }} d="m73.841,7.686c-7.911,5.842-17.913,2.035-26.759.921-9.993-1.259-17.014,5.803-17.014,5.803h0l3.382,4.839s4.959-8.99,18.965-5.685c9.53,2.249,17.38-2.568,21.427-5.878Z"></path>
              <path className="cls-1" style={{ fill: "#dc1116" }} d="m76.806,4.908c-.054.063-.109.118-.162.179.103-.112.162-.179.162-.179Z"></path>
            </g>
          </g>
          <g>
            <path className="cls-1" style={{ fill: "#dc1116" }} d="m38.835,6.737c.015-.054.027-.109.044-.162.059-.187.162-.348.305-.482.151-.141.328-.234.539-.281-.338.254-.541.581-.599.992-.058.41.046.781.294,1.113-.074-.036-.14-.082-.201-.136-.204-.179-.33-.403-.376-.67,0-.004-.003-.007-.005-.011,0-.121,0-.242,0-.363Z"></path>
            <path className="cls-1" style={{ fill: "#dc1116" }} d="m40.681,5.492c.034.094-.001.194-.084.246-.074.046-.199.052-.286-.063-.042.057-.097.092-.169.094-.045.001-.087-.011-.123-.036-.079-.054-.109-.154-.076-.241.002,0,.004,0,.006,0,.001.004.003.007.004.011.036.112.161.165.266.115.041-.019.069-.051.093-.092.005.009.008.014.012.02.035.053.083.082.146.09.077.009.173-.034.205-.144h.006Z"></path>
            <path className="cls-1" style={{ fill: "#dc1116" }} d="m40.548,8.079c.185.067.371.096.563.091-.222.071-.448.079-.677.036-.012.086-.082.133-.123.209-.038-.077-.11-.123-.121-.209-.228.043-.454.035-.677-.036.192.004.378-.024.56-.09-.49-.294-.745-.719-.717-1.294.018-.368.178-.674.452-.921-.207.334-.285.694-.215,1.081.07.388.271.695.589.94-.002-.036-.003-.064-.004-.092-.011-.269-.027-.537-.032-.806-.007-.356-.006-.713-.008-1.069,0-.01.008-.025.017-.029.06-.032.112-.074.156-.13.006.006.013.01.017.016.039.046.085.084.139.11.017.008.022.019.022.037,0,.286.004.572,0,.858-.003.199-.016.399-.024.598-.007.161-.014.321-.021.482,0,.006,0,.011,0,.025.317-.244.518-.552.588-.94.069-.387-.008-.746-.214-1.08.343.317.501.709.445,1.174-.056.464-.305.806-.713,1.04Z"></path>
            <path className="cls-1" style={{ fill: "#dc1116" }} d="m41.2,7.922c.255-.336.359-.707.301-1.117-.058-.411-.261-.738-.594-.989.378.07.782.395.875.9.094.512-.17.989-.582,1.206Z"></path>
          </g>
        </svg>
        <Image src={logoSvg.src} alt="پذیرش 24" width={width || 60} height={height || 60} priority className='grayscale contrast-150' />

      </div>

      {type === 'default' && (
        <>
          <Text className={classNames('text-brand grayscale contrast-150', className)} as={as} fontSize={fontSize} fontWeight="black">
            {t('brandName')}
          </Text>
        </>
      )}
    </div>
  );
};

export default Logo;
