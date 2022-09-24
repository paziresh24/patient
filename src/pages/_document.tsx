import clsx from 'clsx';
import type { NextComponentType } from 'next';
import { Head, Html, Main, NextScript } from 'next/document';

const CustomDocument: NextComponentType = (props: any) => {
  const { locale } = props.__NEXT_DATA__;
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  return (
    <Html dir={dir} className="scroll-smooth">
      <Head />
      <body
        className={clsx('bg-[#F5F6F7]', {
          'dont-fa-number-font': dir === 'ltr',
        })}
        style={{ direction: dir }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
export default CustomDocument;
