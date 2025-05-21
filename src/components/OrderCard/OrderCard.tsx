import { FaDownload } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router";

interface OrderCardProps {
  card: {
    id: number;
    batchNo: string;
    fileCount: string;
    subject: string;
    itemsCount: number;
    orderPlacedDate: string;
    deadline: string;
    price: number;
    paymentStatus: string;
    statusColor: string;
    borderColor: string;
    title:string
  };
}


const OrderCard : React.FC<OrderCardProps>  = ({card}) => {
 const statusColor=card?.paymentStatus === "Paid" ? "#3BB537" : card?.paymentStatus === "Un Paid" ? "#D33316" : "#FCAE30";
  const borderColor ="#FBB343";
  const lastChar = card?.batchNo?.slice(-1); 
  return (
    <Link to={`/order/order-details`} state={{ card }}
      className="bg-white rounded-xl flex flex-col gap-4 shadow px-5 pt-8 w-full h-[210px] relative overflow-hidden"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      {/* Header Row */}
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-[#6da5f9] text-xl font-bold mb-1">
            {card?.batchNo}
          </h3>
          <MdOutlineKeyboardArrowRight size={35} className="text-[#6da5f9]" />
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <p className="font-semibold text-black text-sm leading-tight">
          {card?.title} <br />
          Assignment <span className="text-gray-500">({card?.orders.length})</span>
        </p>
        <button className="bg-[#6da5f9] text-white text-xs px-3 py-1.5 rounded flex items-center gap-2">
          <FaDownload size={12} />
          Files ({card?.fileCount})
        </button>
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Order placed: <span className="text-gray-800">{card?.orderPlacedDate}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Total Price:{" "}
            <span className="text-[#157BA7] px-1 font-semibold">${card?.price}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Deadline: <span className="text-gray-800">{card?.deadline}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Status:{" "}
            <span className="font-medium" style={{ color: statusColor }}>
              {card?.paymentStatus}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
