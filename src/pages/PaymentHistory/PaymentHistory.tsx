import { useEffect } from "react";
import { useTitle } from "../../context/TitleContext";

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

  useEffect(() => {
    setTitle("Payment History");
  }, [setTitle]);

  return (
    <div className="p-6 space-y-6">
      {payments.map((payment, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-4">
          {/* Amount */}
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-lg">Amount:</h3>
            <span className="text-[#13A09D] font-semibold text-lg">${payment.amount.toLocaleString()}</span>
          </div>

          {/* Bulk Orders */}
          {payment.bulk.length > 0 && (
            <div className="bg-gray-200 text-sm rounded p-4 mt-3 space-y-2">
              {payment.bulk.map((b, i) => (
                <div key={i}>
                  <p className="font-bold">Bulk ID: {b.id}</p>
                  <p className="text-gray-700">
                    Order ID: {b.orders.join(", ")}{" "}
                    <span className="text-gray-500">
                      ({b.orders.length} out of {b.total})
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Payment Info */}
          <div className="mt-4">
            <div className="flex justify-between">
              <p className="text-sm font-semibold">Payed via:</p>
              <p className="text-sm">{payment.card}</p>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-sm font-semibold">Date:</p>
              <p className="text-sm">{payment.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
