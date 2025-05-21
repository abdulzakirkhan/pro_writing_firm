import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
const Order = ({ order }) => {
  const orders = order?.orders;
  const downloadFiles = orders[0]?.downloadFiles;
  const downloadFilesLength = Array.isArray(downloadFiles)
    ? downloadFiles.length
    : !downloadFiles
    ? 1
    : 0;
const nwfile=order.orders[0]?.downloadFile;

const baseUrl=`https://staging.portalteam.org/newfolder/${nwfile}`
  return (
    <div
      className="bg-white rounded-xl flex flex-col gap-4 shadow px-5 pt-8 w-full h-[230px] relative overflow-hidden"
      style={{
        borderLeft: `4px solid ${
          order.paymentStatus === "paid"
            ? "#FDCC7E"
            : order.paymentStatus === "Partial Paid"
            ? "#D33316"
            : ""
        }`,
      }}
    >
      {/* Header Row */}
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-[#6da5f9] text-xl font-bold mb-1">
            {order.batchNo}
          </h3>
          {/* <MdOutlineKeyboardArrowRight size={35} className="text-[#6da5f9]" /> */}
          <button onClick={() => {
            // Start download
            const link = document.createElement("a");
            link.href = baseUrl;
            link.download = ""; // optional, you can put custom filename here e.g. "order-file.pdf"
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }} className="bg-[#6da5f9] text-white text-xs px-3 py-1.5 rounded flex items-center gap-2">
            <FaDownload size={12} />
            Files ({downloadFilesLength})
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-black text-xl leading-tight">
            {order?.title}
          </p>
          <p className="font-semibold text-black text-xl leading-tight">
            {order?.type} <span className="text-gray-500">({order?.qty})</span>
          </p>
        </div>

        <div className="">
          <p className="text-sm font-bold text-gray-600">
            Total Price:{" "}
            <span className="text-[#157BA7] px-1 font-semibold">
              ${order.price}
            </span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Status:{" "}
            <span
              className="font-medium"
              style={{
                color: order.paymentStatus === "paid" ? "#22C55E" : "#FFC107",
              }}
            >
              {order.paymentStatus}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-between ">
        <div className="">
          <p className="text-xs text-gray-600">
            Order placed:{" "}
            <span className="text-gray-800">{order.orderPlacedDate}</span>
          </p>
          <p className="text-xs text-gray-600">
            Deadline: <span className="text-gray-800">{order.deadline}</span>
          </p>
        </div>
        <div className="">
          <button className="bg-[#137DA0] px-3 py-2 rounded-md text-white">
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
