import { useCallback, useState } from 'react';

interface pdfGeneratorParams {
  ref: string;
  fileName: string;
  scale: 1 | 2 | 3 | 4;
  pageSize: 'a3' | 'a4' | 'a5';
  orientation: 'portrait' | 'landscape';
}

export const usePdfGenerator = ({ ref, fileName, scale, pageSize, orientation }: pdfGeneratorParams) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const pdfGenrator = useCallback(async () => {
    if (isGenerating) return;

    if (typeof window === 'undefined') {
      console.error('PDF generation is only available on the client side');
      return;
    }

    try {
      setIsGenerating(true);

      const html2pdf = (
        await import(
          /* webpackChunkName: "html2pdf" */
          /* webpackMode: "lazy" */
          'html2pdf.js'
        )
      ).default;

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

      const element = document.querySelector(`#${ref}`);
      if (!element) {
        return;
      }

      html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [ref, fileName, scale, pageSize, orientation, isGenerating]);

  return { pdfGenerator: pdfGenrator, isGenerating };
};

export default usePdfGenerator;
