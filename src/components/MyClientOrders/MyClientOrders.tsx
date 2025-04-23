import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaDownload } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";

type OrderCardProps = {
  percentage: number;
  topic: string;
  orderId: string;
  placedOn: string;
  deadline: string;
  marks: number;
  price: number;
  status: "paid" | "unpaid" | "pending";
};

const MyClientOrders: React.FC<OrderCardProps> = ({order}) => {

const percentage = Number(order?.completePercentage)
  return (
    <div className="flex bg-white rounded-2xl shadow-lg p-4 w-full h-[240px] gap-6 items-center">
      {/* Progress Circle */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-[120px] h-[120px]">
            <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
                textColor: "black",
            //     pathColor: getColor(),
            pathColor: percentage === 100 ? "#3BB537" : "#FCAE30" ,
                trailColor: "#e5e5e5",
                textSize: "26px",
            })}
            />
        </div>
        <h4 className="text-[#6D6D6D] text-[17px] font-bold">{order?.orderStatus === "paid" ? "Completed" :"InProgress"}</h4>
      </div>

      {/* Order Info */}
      <div className="flex-1">
        <div className="flex flex-col gap-4 mb-6">
            <p className="font-bold text-sm text-gray-800">
            <span className="text-gray-600">Topic:</span> {order?.topic === null ? "no topic title" : order?.topic}
            </p>
            <p className="text-xs text-gray-500 mt-1">Order ID: {order?.id}</p>
            <div>
            <button className={` ${order?.orderStatus === "In Progress" || order?.orderStatus === "unpaid" ? "bg-[#6D6D6D] disabled:disabled cursor-no-drop" :"bg-[#13A09D] hover:bg-[#0e8b85] transition  "} text-white px-3 py-1.5 text-sm rounded flex items-center gap-1`}>
              <FaDownload size={12} />
              Download File
            </button>
            </div>
        </div>
        <p className="text-xs text-gray-500">
          Order placed: {order?.orderplacedate}
        </p>
        <p className="text-xs text-gray-500">Deadline: {order?.order_deadline}</p>
        

      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-between py-6 items-end h-full gap-2">
        {/* Status + Price */}
        <div className={`w-[72px] h-[72px] flex justify-center flex-col items-center rounded-full text-white ${order?.orderStatus === "Paid" ? "bg-[#137DA0]" : "bg-[#6D6D6D]"}`}>
            <span className="font-bold text-lg">{order?.marks === null ? 0 : order?.marks}</span>
            <span className="text-xs font-bold">Marks</span>
        </div>
        <div className="text-sm text-right mt-2">
          <p className="font-semibold text-gray-700">
            {/* Price: <span className="text-[#13A09D]">${price.toFixed(1)}</span> */}
          </p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={`font-bold ${
                order?.orderStatus === "In Progress"
                  ? "text-yellow-500"
                  : order?.orderStatus === "unpaid"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {order?.orderStatus.toLowerCase()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyClientOrders;
