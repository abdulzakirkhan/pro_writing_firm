import { FaDownload, FaFileAlt } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router";
import FilePreviewButton from "../FilePreviewButton/FilePreviewButton";
import { useEffect, useState } from "react";
import { useGetFilePreviewFromZipMutation } from "../../redux/ordersApi/ordersApi";
interface OrderStatusCardProps {
  card: {
    id: string;
    completePercentage?: number;
    clientName: string;
    paymentStatus: "Paid" | "Un Paid" | "Partial Paid" | string;
    marks?: number | null;
    price: number;
    orders: any;
  };
  data: {};
}
const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ card, data }) => {
  // console.log("card :", card)
  if (!card) return null;

  let percentage =
    card?.completePercentage === null || undefined
      ? 0
      : card?.completePercentage;

  const [fileUrlPreLink, setfileUrlPreLink] = useState("");
  const [getFilePreviewFromZip, { isLoading }] =
    useGetFilePreviewFromZipMutation();

  useEffect(() => {
    if (card?.paymentStatus === "Partial Paid" && card?.downloadFile) {
      getFilePreviewFromZip({ orderid: card?.id })
        .unwrap()
        .then((res) => {
          // console.log("Preview URL:", res);
          setfileUrlPreLink(res?.fileurl);
          // You can now render or pass this URL to another component
        })
        .catch((err) => {
          console.error("Failed to get preview URL", err);
        });
    }
  }, [card?.paymentStatus,card?.downloadFile]);

console.log("card :",card)

  return (
    <Link
      to={`/order/${card.id}/order-summary`}
      className="bg-white rounded-2xl shadow-lg p-4 flex justify-center items-center gap-4 w-full h-[210px]"
      state={{ card, data }}
    >
      {/* Progress Circle */}
      <div className="flex flex-col justify-center content-start items-center">
        <div className="w-[100px] h-[100px]">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              textColor: `black`,
              pathColor: `${
                card.paymentStatus === "Paid" ? "#3BB537" : "#FCAE30"
              }`,
              trailColor: "#e5e5e5",
              textSize: "28px",
              strokeLinecap: "round",
            })}
          />
        </div>
        <p className="text-sm font-bold text-gray-700 mt-2">
          {card?.orderStatus}
        </p>
      </div>
      
      {/* Info Section */}
      <div className="flex-1 px-3">
        <p className="font-bold text-sm">{card.clientName}</p>
        <p className="text-sm font-bold text-gray-600">OrderID: {card.id}</p>

        {card?.paymentStatus === "Paid" && card?.downloadFile && (
          <button
            className={`mt-2 text-white text-xs px-3 h-[38px] rounded flex items-center gap-2 ${
              card?.downloadFile ? " bg-[#6da5f9]" : "bg-gray-500"
            }`}
            onClick={() => {
              if (!card?.downloadFile) {
                alert("No file available for download.");
                return;
              }

              // Start download
              const link = document.createElement("a");
              link.href = card?.downloadFile;
              link.download = ""; // optional, you can put custom filename here e.g. "order-file.pdf"
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <FaDownload size={12} />
            Download File
          </button>
        )}
        {card?.paymentStatus === "Partial Paid" && card?.downloadFile && (
          <FilePreviewButton
            fileUrl={fileUrlPreLink}
            price={card?.price}
            balanceAmount={card?.balaceamount}
          />
        )}
      </div>

      {/* Marks and Price */}
      <div className="flex flex-col justify-center gap-2 h-full">
        <div
          className={`w-[93px] h-[93px] flex flex-col items-center justify-center rounded-full text-white text-xs font-semibold ${
            card?.paymentStatus === "Paid" ? "bg-[#157BA7]" : "bg-gray-600 "
          }`}
        >
          {/* {card?.paymentStatus ? 'Marks' : ( */}
          <>
            <span className="text-[14px]">
              {card?.marks === null || undefined ? 0 : card?.marks}
            </span>
            <span className="text-[10px]">Marks</span>
          </>
          {/* )} */}
        </div>
        <p className="text-sm mt-2">
          Price:{" "}
          <span className="text-[#157BA7] font-semibold">${card.price}</span>
        </p>
        <p className="text-sm  font-semibold text-[#D33316] my-0 -mt-1">
          Due:{" "}
          <span className="">${card?.paymentStatus === "Un Paid" ? card?.price : card?.paymentStatus === "Paid" ? 0 : card?.balaceamount === null ? 0 : card?.balaceamount}</span>
        </p>
        <p className={`text-sm`}>
          Status:{" "}
          <span
            className={`${
              card?.paymentStatus === "Un Paid"
                ? "text-[#D33316]"
                : card?.paymentStatus === "Paid"
                ? "text-[#3BB537]"
                : "text-[#FFBE55]"
            }`}
          >
            {card.paymentStatus}
          </span>
        </p>
      </div>
    </Link>
  );
};

export default OrderStatusCard;
