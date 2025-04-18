import { FaDownload } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router";
const OrderCard = ({
  batchName,
  fileCount,
  subject,
  itemsCount,
  placedOn,
  deadline,
  price,
  status,
  statusColor,
  borderColor,id
}) => {
  return (
    <Link to={`/order/${id}`}
      className="bg-white rounded-xl flex flex-col gap-4 shadow px-5 pt-8 w-full h-[210px] relative overflow-hidden"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      {/* Header Row */}
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-[#13A09D] text-xl font-bold mb-1">
            {batchName}
          </h3>
          <MdOutlineKeyboardArrowRight size={35} className="text-[#13A09D]" />
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <p className="font-semibold text-black text-sm leading-tight">
          {subject} <br />
          Assignment <span className="text-gray-500">({itemsCount})</span>
        </p>
        <button className="bg-[#13A09D] text-white text-xs px-3 py-1.5 rounded flex items-center gap-2">
          <FaDownload size={12} />
          Files ({fileCount})
        </button>
      </div>
      <div className="">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Order placed: <span className="text-gray-800">{placedOn}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Total Price:{" "}
            <span className="text-[#157BA7] px-1 font-semibold">${price}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            Deadline: <span className="text-gray-800">{deadline}</span>
          </p>
          <p className="text-sm font-bold text-gray-600">
            Status:{" "}
            <span className="font-medium" style={{ color: statusColor }}>
              {status}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
