import { print } from 'react-html2pdf';

interface PdfGeneratorProps {
  pdfName: string;
  children?: React.ReactNode;
}

export const PdfGenerator = (props: PdfGeneratorProps) => {
  const { pdfName, children } = props;
  return (
    <>
      <div className="w-full">
        <div id={'jsx-template'}>{children}</div>
      </div>
      <button onClick={() => print(`${pdfName}`, 'jsx-template')}> print</button>
    </>
  );
};
export default PdfGenerator;
