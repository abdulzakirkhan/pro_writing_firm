import { FaDownload } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router';
interface OrderStatusCardProps {
  card: {
    id: string;
    completePercentage?: number;
    clientName: string;
    paymentStatus: "Paid" | "Un Paid" | "Partial Paid" | string;
    marks?: number | null;
    price: number;
    orders:any
  };
  data: {}
}
const OrderStatusCard : React.FC<OrderStatusCardProps> = ({card ,data}) => {
  // console.log("card :", card)
  if (!card) return null;



  let percentage =card?.completePercentage === null || undefined ? 0 : card?.completePercentage
  return (
    <Link to={`/order/${card.id}/order-summary`} className="bg-white rounded-2xl shadow-lg p-4 flex justify-center items-center gap-4 w-full h-[210px]" state={{card ,data}}>
      {/* Progress Circle */}
      <div className="flex flex-col justify-center content-start items-center">
        <div className="w-[100px] h-[100px]">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              textColor:  `black`,
              pathColor: `${card.paymentStatus === "Paid" ? "#3BB537" : "#FCAE30"}`,
              trailColor: '#e5e5e5',
              textSize: '28px',
              strokeLinecap: 'round',
            })}
          />
        </div>
        <p className="text-sm font-bold text-gray-700 mt-2">
          {/* {isCompleted ? 'Completed' : isInProgress ? 'Inprogress' : 'Pending'} */}
        </p>
      </div>

      {/* Info Section */}
      <div className="flex-1 px-3">
        <p className="font-bold text-sm">{card.clientName}</p>
        <p className="text-sm font-bold text-gray-600">OrderID: {card.id}</p>

        <button
          className={`mt-2 text-white text-xs px-3 h-[38px] rounded flex items-center gap-2 ${
            card?.paymentStatus === "Un Paid" ? 'bg-gray-500' : 'bg-[#13A09D]'
          }`}
        >
          <FaDownload size={12} />
          Download File
        </button>
      </div>

      {/* Marks and Price */}
      <div className="flex flex-col justify-center gap-2 h-full">
        <div
          className={`w-[93px] h-[93px] flex flex-col items-center justify-center rounded-full text-white text-xs font-semibold ${card?.paymentStatus === "Paid" ? 'bg-[#157BA7]' : 'bg-gray-600 '}`}
        >
          {/* {card?.paymentStatus ? 'Marks' : ( */}
            <>
              <span className="text-[14px]">{card?.marks === null || undefined ? 0 : card?.marks}</span>
              <span className="text-[10px]">Marks</span>
            </>
          {/* )} */}
        </div>
        <p className="text-sm mt-2">
          Price: <span className="text-[#157BA7] font-semibold">${card.price}</span>
        </p>
        <p className={`text-sm`}>
          Status:  <span className={`${card?.paymentStatus === "Un Paid" ? "text-[#D33316]" : card?.paymentStatus === "Paid" ? "text-[#3BB537]" : "text-[#FFBE55]"}`}>{card.paymentStatus}</span>
        </p>
      </div>
    </Link>
  );
};

export default OrderStatusCard;
