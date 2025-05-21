import { FaDownload } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router";
const PaymentCard = ({ order, onClick, isSelected , index}) => {
  return (
    <div
      className={`${isSelected && order?.paymentStatus !== "Paid" ? "bg-[#ACD6D4]" :"bg-white"} ${order?.paymentStatus === "Paid" ? "cursor-not-allowed" :""} rounded-xl flex flex-col gap-4 shadow px-5 pt-8 w-full h-[210px] relative overflow-hidden`}
      style={{ borderLeft: `4px solid ${index % 2 ? "#FBB343" : "#57C063"}` }}
    >
      {/* Header Row */}
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-[#6da5f9] text-xl font-bold mb-1">
            {order?.batchNo}
          </h3>
          <div className="absolute top-8 right-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={order.paymentStatus === "Paid" ? null : () => onClick(order?.batchid)}
                className={`sr-only peer`}
              />
              <div className="w-5 h-5 rounded-full border border-gray-400 peer-checked:bg-teal-600 transition" />
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <p className="font-semibold text-black text-sm leading-tight">
          {order?.subject} <br />
          Assignment{" "}
          <span className="text-gray-500">({order?.itemsCount})</span>
        </p>
        <button className="bg-[#6da5f9] text-white text-xs px-3 py-1.5 rounded flex items-center gap-2">
          <FaDownload size={12} />
          Files ({order?.fileCount})
        </button>
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Order placed:{" "}
            <span className="text-gray-800">{order?.placedOn}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Total Price:{" "}
            <span className="text-[#157BA7] px-1 font-semibold">
              ${order?.price}
            </span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Deadline: <span className="text-gray-800">{order?.deadline}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Status:{" "}
            <span className={`font-medium ${order?.paymentStatus === "Paid" ? "text-[#3BB537]" : order?.paymentStatus === "Partial Paid" ? "text-[#FFBE55]" : "text-red-600"}`}>
              {order?.paymentStatus}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;