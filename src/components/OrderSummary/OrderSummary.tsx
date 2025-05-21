import { useInsertRequestRevesionMutation } from "../../redux/agentdashboard/agentApi";

type OrderSummaryProps = {
    className?: string;
  };
  type order = {};
export default function OrderSummary({className ="",order,index}: OrderSummaryProps) {
  const [requestRevesion, { isLoading: requestRevesionLoading }] =useInsertRequestRevesionMutation();

  return (
    <div className={`w-full ${className}`}>
        <div
          className={`rounded-2xl border-2 border-[#C6BCBC] bg-white p-5 md:p-3`}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#4D4D4D]">{order.title}</h1>
            <div
              className={`w-[47px] h-[48px] flex justify-center items-center rounded-full
          ${order.title === "Complete" ? "bg-[#C4E9C3] text-[#3BB537]" : ""}
          ${order.title === "In Progress" ? "bg-[#F2E4CF] text-[#FCAE30]" : ""}
          ${index === 0 ? "!bg-[#CDEBEA] !text-[#6da5f9]" : ""}`}
            >
              {order.icon}
            </div>
          </div>

          <div className="mt-5">
            <h4 className="mt-2 font-bold text-gray-800 text-2xl">
              {order.value}
            </h4>
            <div className="mt-5">
              <div className="flex items-center gap-1">
                {order.badge}
                <span className={`text-sm text-[${order.trend.color}]`}>
                  {order.trend.percent} {order.trend.description}
                </span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
