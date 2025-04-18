import { useEffect, useState } from "react";
import { useTitle } from "../../context/TitleContext";
import TopUpModal from "../../components/TopUpModal/TopUpModal";

const paymentHistory = [
  {
    id: 1,
    method: "**** **** **** 1234",
    date: "12/01/2023",
    time: "12:00:23",
    amount: "$100",
  },
  {
    id: 2,
    method: "**** **** **** 1234",
    date: "12/04/2024",
    time: "16:20:00",
    amount: "$900",
  },
  {
    id: 3,
    method: "**** **** **** 5678",
    date: "20/11/2024",
    time: "20:10:40",
    amount: "$500",
  },
  {
    id: 4,
    method: "**** **** **** 5678",
    date: "01/01/2025",
    time: "20:10:40",
    amount: "$1,000",
  },
  {
    id: 5,
    method: "**** **** **** 5678",
    date: "01/01/2025",
    time: "20:10:40",
    amount: "$1,000",
  },
];

export default function Wallet() {
  const { setTitle } = useTitle();
  const [showModal, setShowModal] = useState(false)

  
  const Modal = ({onCancel}) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Only dim the background without blur */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white flex flex-col justify-center lg:w-[925px] h-[255px] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-teal-700 mb-3">Top-up Wallet</h2>
        <p className="text-[#6D6D6D] text-[20px]">Choose an amount:</p>


        <div className="">
            <div className="flex items-center gap-4">
                <button className="w-[195px]">$ 100</button>
            </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="w-[206px] h-[48px] rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
          >
            Cancel
          </button>
          <button
            // onClick={onConfirm}
            className="w-[206px] h-[48px] rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
  useEffect(() => {
    setTitle("Wallet");
  }, [setTitle]);
  return (
    <>
    <div className="p-6 space-y-6">
    {/* Top Section */}
    <div className="grid grid-cols-1 lg:grid-cols-12 justify-between gap-6 items-center">
        <div className="w-full lg:col-span-9 h-[93px] flex items-center bg-white p-4 rounded-xl shadow-md">
        <div className="text-gray-700 text-lg w-full !flex !justify-between items-center font-medium">
            <span>Available Credit:</span>{" "}
            <span className="text-green-600 font-bold">$1,000</span>
        </div>
        </div>
        <div className="w-full lg:col-span-3">
        <button onClick={() => setShowModal(!showModal)} className="bg-[#157BA7] h-[93px] w-full text-white flex justify-center items-center p-4 rounded-lg font-semibold">
            Top-up Wallet
        </button>
        </div>
    </div>

    {/* Table */}
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">History</h3>
        <div className="overflow-x-scroll h-[472px]">
            <table className="w-full h-[472px] text-sm text-left border-collapse">
            <thead className="text-[#13A09D] border-b">
                <tr>
                <th className="py-2 !min-w-[40px]">Sr. No</th>
                <th className="py-2">Payment Method</th>
                <th className="py-2">Date</th>
                <th className="py-2">Time</th>
                <th className="py-2">Amount</th>
                </tr>
            </thead>
            <tbody className="text-gray-700">
                {paymentHistory.map((entry, index) => (
                <tr key={entry.id} className="border-b last:border-none">
                    <td className="py-2 min-w-[40px]">{index + 1}.</td>
                    <td className="py-2 !min-w-[160px]">{entry.method}</td>
                    <td className="py-2 !min-w-[160px]">{entry.date}</td>
                    <td className="py-2 !min-w-[160px]">{entry.time}</td>
                    <td className="py-2 !min-w-[160px] font-bold">{entry.amount}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
    </div>

    {showModal && (
        <TopUpModal onCancel={() => setShowModal(false)} />
    )}
    </>
  );
}
