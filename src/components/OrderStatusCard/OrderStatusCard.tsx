import { FaDownload } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router';

const OrderStatusCard = ({card}) => {
  console.log("card :", card)
  if (!card) return null;

  const isCompleted = card?.percentage === 100;
  const isInProgress = card?.percentage < 100 && card?.percentage > 0;
  const isUnpaid = card.status.toLowerCase() === 'unpaid';

  const getProgressColor = () => {
    if (isCompleted) return '#22C55E';
    if (isInProgress) return '#FCAE30';
    return '#EF4444';
  };

  return (
    <Link to={`/order/${card.id}/order-summary`} className="bg-white rounded-2xl shadow-lg p-4 flex justify-center items-center gap-4 w-full h-[210px]">
      {/* Progress Circle */}
      <div className="flex flex-col justify-center content-start items-center">
        <div className="w-[100px] h-[100px]">
          <CircularProgressbar
            value={card.percentage}
            text={`${card.percentage}%`}
            styles={buildStyles({
              textColor: getProgressColor(),
              pathColor: getProgressColor(),
              trailColor: '#e5e5e5',
              textSize: '28px',
              strokeLinecap: 'round',
            })}
          />
        </div>
        <p className="text-sm font-bold text-gray-700 mt-2">
          {isCompleted ? 'Completed' : isInProgress ? 'Inprogress' : 'Pending'}
        </p>
      </div>

      {/* Info Section */}
      <div className="flex-1 px-3">
        <p className="font-bold text-sm">{card.clientName}</p>
        <p className="text-sm font-bold text-gray-600">OrderID: {card.orderId}</p>

        <button
          className={`mt-2 text-white text-xs px-3 h-[38px] rounded flex items-center gap-2 ${
            isUnpaid ? 'bg-gray-500' : 'bg-[#13A09D]'
          }`}
        >
          <FaDownload size={12} />
          Download File
        </button>
      </div>

      {/* Marks and Price */}
      <div className="flex flex-col justify-center gap-2 h-full">
        <div
          className={`w-[93px] h-[93px] flex flex-col items-center justify-center rounded-full text-white text-xs font-semibold ${
            isUnpaid ? 'bg-gray-600' : 'bg-[#157BA7]'
          }`}
        >
          {isUnpaid ? 'Marks' : (
            <>
              <span className="text-[14px]">{card.marks}</span>
              <span className="text-[10px]">Marks</span>
            </>
          )}
        </div>
        <p className="text-sm mt-2">
          Price: <span className="text-[#157BA7] font-semibold">${card.price}</span>
        </p>
        <p className={`text-sm`}>
          Status:  <span style={{ color: getProgressColor() }}>{card.status}</span>
        </p>
      </div>
    </Link>
  );
};

export default OrderStatusCard;
