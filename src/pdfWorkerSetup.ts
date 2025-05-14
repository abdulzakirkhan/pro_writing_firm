import { pdfjs } from 'react-pdf';

// Use Vite's module resolution to locate the actual worker file correctly
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

