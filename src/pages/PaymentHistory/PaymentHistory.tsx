import { useEffect } from "react";
import { useTitle } from "../../context/TitleContext";
import { useGetpaymentHistryQuery } from "../../redux/paymentApi/paymentApi";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";

const payments = [
  {
    amount: 100,
    card: "**** **** **** 1234",
    date: "02/12/2024",
    bulk: [
      {
        id: "12346577",
        orders: ["22344342", "23244342", "34234234", "23234432", "12355788"],
        total: 5,
      },
      {
        id: "22347816",
        orders: ["23234432", "23244342"],
        total: 5,
      },
    ],
  },
  {
    amount: 100,
    card: "**** **** **** 1234",
    date: "02/12/2024",
    bulk: [
      {
        id: "12346577",
        orders: ["22344342", "23244342", "34234234", "23234432", "12355788"],
        total: 5,
      },
    ],
  },
  {
    amount: 100,
    card: "**** **** **** 1234",
    date: "02/12/2024",
    bulk: [],
  },
];

export default function PaymentHistory() {
  const { setTitle } = useTitle();
  const user = useSelector((state) => state.auth?.user);
  const {data: paymentHistory,isLoading: paymentHistoryLoading,refetch: paymentHistoryRefech,} = useGetpaymentHistryQuery(user?.agent_user_id);

    const history = Array.isArray(paymentHistory)
    ? paymentHistory
    : Array.isArray(paymentHistory?.result)
    ? paymentHistory.result
    : [];
  useEffect(() => {
    setTitle("Payment History");
  }, [setTitle]);

  return (
     <div className="p-6 space-y-6">
      {paymentHistoryLoading ? (
        <div className="h-[50vh] w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : history.length === 0 ? (
        <div className="h-[50vh] flex items-center justify-center text-gray-500 text-lg">
          No payment history found.
        </div>
      ) : (
        history.map((payment, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4">
            {/* Amount */}
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-semibold text-lg">Amount:</h3>
              <span className="text-[#6da5f9] font-semibold text-lg">
                {payment?.currency}
                {payment.amount}
              </span>
            </div>

            {/* Bulk Orders */}
            <div className="bg-gray-200 text-sm rounded p-4 mt-3 space-y-2">
              <div>
                <p className="font-bold">Bulk ID: {payment?.id}</p>
                <p className="text-gray-700">Order ID: {payment?.orderid}</p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Debit or Credit Card</span>
                  <span className="font-bold">{payment?.amount}</span>
                </div>

                <div>
                  <span>Includes</span>
                  <div>
                    <span>{payment?.currency} </span>
                    <span>{payment?.serviceCharges}</span>
                  </div>
                  <div>
                    <span>Vat </span>
                    <span>
                      {payment?.currency}
                      {payment?.vat}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-4">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Payed via:</p>
                <p className="text-sm">{payment?.transactionkey}</p>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm font-semibold">Date:</p>
                <p className="text-sm">{payment?.addeddate}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
