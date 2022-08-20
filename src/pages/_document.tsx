import type { NextComponentType } from "next";
import { Head, Html, Main, NextScript } from "next/document";

const CustomDocument: NextComponentType = () => {
  return (
    <Html dir="rtl" lang="fa-IR" className="scroll-smooth">
      <Head />
      <body className="bg-[#f3f7fa]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
export default CustomDocument;
