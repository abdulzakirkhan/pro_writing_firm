// FilePreviewButton.tsx

import React, { useState, useEffect } from "react";
import { FaFileAlt } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import toast from "react-hot-toast";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  type DocumentLoadEvent,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface PreviewOrderFileProps {
  fileUrl: string;
  price?: number;
  balanceAmount?: number;
}

const FilePreviewButton: React.FC<PreviewOrderFileProps> = ({
  fileUrl,
  price = 0,
  balanceAmount = 0,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [paymentPercentage, setPaymentPercentage] = useState(0);
  const [allowedPages, setAllowedPages] = useState(0);

  const fileType = fileUrl?.split(".").pop()?.toLowerCase();
  const isWordDoc = ["doc", "docx"].includes(fileType || "");

  useEffect(() => {
    const validPrice = Math.max(0, Number(price));
    const validBalance = Math.max(0, Math.min(Number(balanceAmount), validPrice));
    const paidAmount = validPrice - validBalance;
    const percentage =
      validPrice > 0 ? Math.round((paidAmount / validPrice) * 100) : 0;
    setPaymentPercentage(percentage);
  }, [price, balanceAmount]);
const convertDocToPdf = async (docUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(docUrl);
    const blob = await response.blob();
    const name = docUrl.split("/").pop() || "file.doc";

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const encoded = result.split(",")[1]; // Remove `data:...base64,`
        resolve(encoded);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const apiResponse = await fetch(
      "https://v2.convertapi.com/convert/doc/to/pdf?Secret=secret_9QhreIJ8W8Lh3BWt",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Parameters: [
            { Name: "File", FileValue: { Name: name, Data: base64 } },
            { Name: "StoreFile", Value: true }
          ]
        })
      }
    );

    const result = await apiResponse.json();

    if (result?.Files?.[0]?.Url) {
      return result.Files[0].Url;
    } else {
      console.error("ConvertAPI Error:", result?.Message || "Unknown error.");
      return null;
    }
  } catch (error) {
    console.error("Conversion failed:", error);
    return null;
  }
};
  const handlePreviewClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Uncomment below if you want Word-to-PDF conversion via ConvertAPI
    if (isWordDoc) {
      const pdfLink = await convertDocToPdf(fileUrl);
      if (pdfLink) {
        setPreviewUrl(pdfLink);
        setShowPreview(true);
      } else {
        toast.error("Failed to convert document. Please try again.");
      }
      return;
    }

    setPreviewUrl(fileUrl);
    setShowPreview(true);
  };

  const onDocumentLoad = (e: DocumentLoadEvent) => {
    const totalPages = e.doc.numPages;
    const allowed = Math.max(1, Math.ceil((Number(paymentPercentage) / 100) * Number(totalPages)));

    
    setAllowedPages(allowed);
    console.log("allowed :",allowed);
  };

  return (
    <>
      <button
        onClick={handlePreviewClick}
        className="text-white bg-[#6da5f9] text-xs px-3 py-2 rounded flex items-center gap-1"
      >
        <FaFileAlt />
        Preview File
      </button>

      {showPreview && previewUrl && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
        >
          <div className="relative bg-white rounded-lg shadow-xl w-full h-[90vh] flex flex-col">
            <button
              className="absolute top-2 right-12 z-99 text-gray-600 hover:text-gray-900"
              onClick={() => setShowPreview(false)}
            >
              <RxCross1 size={28} />
            </button>

            <div className="flex-1 overflow-auto px-4">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={previewUrl}
                  onDocumentLoad={onDocumentLoad}
                  defaultScale={SpecialZoomLevel.PageFit}
                  renderPage={(props) => {
                    const isLocked = props.pageIndex >= allowedPages;

                    if (isLocked) {
                      return (
                        <div className="relative w-full h-[1200px] flex items-center justify-center bg-gray-100 border-b border-gray-300">
                          <div className="text-center px-4">
                            <p className="text-xl font-semibold text-gray-700">
                              Page Locked
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Make a payment to access below pages.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="relative w-full h-full">
                        {props.canvasLayer.children}
                        {props.textLayer.children}
                        {props.annotationLayer.children}
                      </div>
                    );
                  }}
                />
              </Worker>
            </div>

            <div className="p-2 text-sm text-center text-gray-600">
              Showing {allowedPages} page(s) — {paymentPercentage}% paid
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilePreviewButton;
