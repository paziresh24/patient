interface pdfGeneratorParams {
  ref: string;
  fileName: string;
  scale: 1 | 2 | 3 | 4;
  pageSize: 'a3' | 'a4' | 'a5';
  orientation: 'portrait' | 'landscape';
}
export const usePdfGenerator = ({ ref, fileName, scale, pageSize, orientation }: pdfGeneratorParams) => {
  const pdfGenrator = async () => {
    console.log('kjiohoh');

    const html2pdf = (await import('html2pdf.js')).default;
    const options = {
      margin: 0.3,
      filename: fileName,
      image: {
        type: 'jpeg',
        quality: 0.98,
      },
      html2canvas: {
        scale: scale,
      },
      jsPDF: {
        unit: 'in',
        format: pageSize,
        orientation: orientation,
      },
    };
    html2pdf()
      .from(document.querySelector(`#${ref}`))
      .set(options)
      .save();
  };

  return pdfGenrator;
};

export default usePdfGenerator;
