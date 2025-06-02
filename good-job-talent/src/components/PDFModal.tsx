import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { X, Loader, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Configure PDF.js worker directly using CDN
// This is a backup in case the global worker configuration isn't working
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

const PDFModal: React.FC<PDFModalProps> = ({ isOpen, onClose, pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const formatPdfUrl = (url: string) => {
    // If URL doesn't start with http:// or https://, prepend https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const formattedPdfUrl = formatPdfUrl(pdfUrl);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: { numPages: number }) {
    console.log('PDF loaded successfully with', nextNumPages, 'pages');
    setNumPages(nextNumPages);
    setPageNumber(1); // Reset to first page on new document load
    setIsLoading(false);
    setLoadError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setLoadError(`Error: ${error.message || 'Failed to load PDF document'}`);
    setIsLoading(false);
  }

  const goToPreviousPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  const goToNextPage = () => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));

  if (!isOpen) {
    return null;
  }

  console.log('Attempting to load PDF from URL:', formattedPdfUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Resume Preview</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body - PDF Viewer */}
        <div className="flex-grow overflow-y-auto p-2 md:p-4 bg-gray-100">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <Loader className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading PDF...</p>
              <p className="text-xs text-gray-500 mt-2">URL: {formattedPdfUrl}</p>
            </div>
          )}
          {loadError && (
             <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-red-600">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="font-semibold">Error loading PDF</p>
              <p className="text-sm text-center max-w-md">{loadError}. <br/>Please ensure the URL is correct and accessible, or try downloading the file.</p>
              <p className="text-xs text-gray-500 mt-2 mb-2">Attempted URL: {formattedPdfUrl}</p>
              <a href={formattedPdfUrl} target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                Open PDF in New Tab
              </a>
            </div>
          )}
          {!isLoading && !loadError && numPages && (
            <div className="flex justify-center">
                <Document
                    file={formattedPdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading="" // Handled by custom isLoading state
                    error=""   // Handled by custom loadError state
                >
                <Page 
                    pageNumber={pageNumber} 
                    width={Math.min(window.innerWidth * 0.8, 800)} // Responsive width 
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                />
                </Document>
            </div>
          )}
        </div>

        {/* Modal Footer - Pagination */}
        {!isLoading && !loadError && numPages && numPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <button 
              onClick={goToPreviousPage} 
              disabled={pageNumber <= 1}
              className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 flex items-center"
            >
              <ChevronLeft size={18} className="mr-1"/> Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {pageNumber} of {numPages}
            </span>
            <button 
              onClick={goToNextPage} 
              disabled={pageNumber >= numPages}
              className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 flex items-center"
            >
              Next <ChevronRight size={18} className="ml-1"/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFModal; 