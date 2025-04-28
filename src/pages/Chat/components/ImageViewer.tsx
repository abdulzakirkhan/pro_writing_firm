// ImageViewer.tsx
import React from 'react';

interface ImageViewerProps {
  file: File;
  onRemove: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ file, onRemove }) => {
  const previewUrl = URL.createObjectURL(file);

  return (
    <div className="relative group inline-block m-1">
      <img
        src={previewUrl}
        alt="Selected preview"
        className="h-24 w-24 object-cover rounded-lg border border-gray-200"
      />
      
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                   opacity-0 group-hover:opacity-100 transition-opacity shadow-sm
                   hover:bg-red-600 focus:outline-none"
        aria-label="Remove image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default ImageViewer;