import { FaDownload } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
const Order = ({order}) => {
  return (
    <div
      className="bg-white rounded-xl flex flex-col gap-4 shadow px-5 pt-8 w-full h-[210px] relative overflow-hidden"
      style={{ borderLeft: `4px solid ${order.paymentStatus === "paid" ?"#FDCC7E" : order.paymentStatus === "Partial Paid" ? "#D33316" : ""}` }}
    >
      {/* Header Row */}
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-[#13A09D] text-xl font-bold mb-1">
            {order.batchNo}
          </h3>
          <MdOutlineKeyboardArrowRight size={35} className="text-[#13A09D]" />
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <p className="font-semibold text-black text-sm leading-tight">
          {order.title} <span className="text-gray-500">({order?.orders.length})</span>
        </p>
        <button className="bg-[#13A09D] text-white text-xs px-3 py-1.5 rounded flex items-center gap-2">
          <FaDownload size={12} />
          Files ({order.fileCount})
        </button>
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Order placed: <span className="text-gray-800">{order.orderPlacedDate}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Total Price:{" "}
            <span className="text-[#157BA7] px-1 font-semibold">${order.price}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Deadline: <span className="text-gray-800">{order.deadline}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Status:{" "}
            <span className="font-medium" style={{ color: order.paymentStatus === "paid" ? "#22C55E" : "#FFC107" }}>
              {order.paymentStatus}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Order;
