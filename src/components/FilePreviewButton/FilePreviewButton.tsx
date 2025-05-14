// FilePreviewButton.tsx — cleaned up for percentage-based preview using @react-pdf-viewer/core only

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaFileAlt } from "react-icons/fa";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import type { DocumentLoadEvent } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface PreviewOrderFileProps {
  fileUrl: string;
  price?: number;
  balanceAmount?: number;
}

const urlToBase64 = async (
  url: string
): Promise<{ base64: string; name: string }> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const name = url.split("/").pop() || "file.doc";

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve({ base64, name });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const convertDocToPdf = async (docUrl: string): Promise<string | null> => {
  try {
    const { base64, name } = await urlToBase64(docUrl);

    const response = await fetch(
      "https://v2.convertapi.com/convert/doc/to/pdf?Secret=secret_9QhreIJ8W8Lh3BWt",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Parameters: [
            { Name: "File", FileValue: { Name: name, Data: base64 } },
            { Name: "StoreFile", Value: true },
          ],
        }),
      }
    );

    const result = await response.json();
    if (result?.Files?.[0]?.Url) {
      return result.Files[0].Url;
    } else {
      throw new Error(result?.Message || "No file returned.");
    }
  } catch (error) {
    console.error("Conversion failed:", error);
    return null;
  }
};

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
    const validBalance = Math.max(
      0,
      Math.min(Number(balanceAmount), validPrice)
    );
    const paidAmount = validPrice - validBalance;
    const percentage =
      validPrice > 0 ? Math.round((paidAmount / validPrice) * 100) : 0;
    setPaymentPercentage(percentage);
  }, [price, balanceAmount]);

  const handlePreviewClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWordDoc) {
      const pdfLink = await convertDocToPdf(fileUrl);
      if (pdfLink) {
        setPreviewUrl(pdfLink);
        setShowPreview(true);
      } else {
        alert("Failed to convert document. Please try again.");
      }
    } else {
      setPreviewUrl(fileUrl);
      setShowPreview(true);
    }
  };

  const onDocumentLoad = (e: DocumentLoadEvent) => {
    const totalPages = e.doc.numPages;
    const allowed = Math.max(
      1,
      Math.floor((paymentPercentage / 100) * totalPages)
    );
    setAllowedPages(allowed);
  };
  console.log("allowed pages:", allowedPages);

  return (
    <>
      <button
        onClick={handlePreviewClick}
        className="text-white bg-[#13A09D] text-xs px-3 py-2 rounded flex items-center gap-1"
      >
        <FaFileAlt className="icon" />
        Preview File
      </button>

      {showPreview && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh]">
            <button
              className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowPreview(false)}
            >
              <FaTimes />
            </button>

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={previewUrl}
                onDocumentLoad={onDocumentLoad}
                defaultScale={SpecialZoomLevel.PageFit}
                renderPage={(props) => {
                  if (props.pageIndex >= allowedPages) return <><div className="p-2 text-sm text-center text-gray-600">
              Showing {allowedPages} page(s) — {paymentPercentage}% paid
            </div></>;
                  return (
                    <>
                      {props.canvasLayer.children}
                      {props.textLayer.children}
                      {props.annotationLayer.children}
                    </>
                  );
                }}
              />
            </Worker>

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
