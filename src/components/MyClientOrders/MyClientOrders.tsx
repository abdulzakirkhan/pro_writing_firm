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

const MyClientOrders: React.FC<OrderCardProps> = ({
  percentage,
  topic,
  orderId,
  placedOn,
  deadline,
  marks,
  price,
  status,
}) => {
  const isCompleted = percentage === 100;
  const isInProgress = percentage > 0 && percentage < 100;

  const getColor = () => {
    if (isCompleted) return "#22C55E";
    if (isInProgress) return "#FCAE30";
    return "#9CA3AF";
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-lg p-4 w-full h-[240px] gap-6 items-center">
      {/* Progress Circle */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-[120px] h-[120px]">
            <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
                textColor: getColor(),
                pathColor: getColor(),
                trailColor: "#e5e5e5",
                textSize: "26px",
            })}
            />
        </div>
        <h4 className="text-[#6D6D6D] text-[17px] font-bold">{status === "paid" ? "Completed" :"InProgress"}</h4>
      </div>

      {/* Order Info */}
      <div className="flex-1">
        <div className="flex flex-col gap-4 mb-6">
            <p className="font-bold text-sm text-gray-800">
            <span className="text-gray-600">Topic:</span> {topic}
            </p>
            <p className="text-xs text-gray-500 mt-1">Order ID: {orderId}</p>
            <div>
            <button className={` ${isCompleted ? "bg-[#13A09D] hover:bg-[#0e8b85] transition" :"bg-[#6D6D6D] disabled:disabled cursor-no-drop"} text-white px-3 py-1.5 text-sm rounded flex items-center gap-1`}>
              <FaDownload size={12} />
              Download File
            </button>
            </div>
        </div>
        <p className="text-xs text-gray-500">
          Order placed: {placedOn}
        </p>
        <p className="text-xs text-gray-500">Deadline: {deadline}</p>
        

      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-between py-6 items-end h-full gap-2">
        {/* Status + Price */}
        <div className={`w-[72px] h-[72px] flex justify-center flex-col items-center rounded-full text-white ${isCompleted ? "bg-[#137DA0]" : "bg-[#6D6D6D]"}`}>
            <span className="font-bold text-lg">{marks}</span>
            <span className="text-xs font-bold">Marks</span>
        </div>
        <div className="text-sm text-right mt-2">
          <p className="font-semibold text-gray-700">
            Price: <span className="text-[#13A09D]">${price.toFixed(1)}</span>
          </p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={`font-bold ${
                status === "paid"
                  ? "text-green-500"
                  : status === "unpaid"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyClientOrders;
