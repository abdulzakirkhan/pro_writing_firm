import { useState } from "react";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import ICON from "../../../icons/payment.png";

const amounts = [100, 200, 500, 1000];

const TopUpModal = ({ onCancel }: { onCancel: () => void }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [form, setForm] = useState({
    card: "",
    cvc: "",
    expiry: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white w-[700px] max-w-full p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">Top-up Wallet</h2>

        <p className="text-[#6D6D6D] text-md mb-2">Choose an amount:</p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setSelectedAmount(amt)}
              className={`border rounded-lg py-2 font-semibold ${
                selectedAmount === amt
                  ? "bg-[#13A09D] text-white"
                  : "border-[#13A09D] text-[#13A09D]"
              }`}
            >
              $ {amt.toLocaleString()}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={`$ ${selectedAmount.toLocaleString()}`}
          readOnly
          className="border w-full mb-4 px-3 py-3 text-gray-700"
        />

        {/* Card Info */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="card"
            placeholder="1234 1234 1234 1234"
            value={form.card}
            onChange={handleInputChange}
            className="border w-full px-3 py-3"
          />
          <div className="absolute w-[88px] h-[40px] right-4 top-7 flex gap-1 text-2xl text-gray-500">
            <img src={ICON} alt="" className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={form.cvc}
              onChange={handleInputChange}
              className="border w-full px-3 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleInputChange}
              className="border w-full px-3 py-3"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="w-[200px] h-[48px] rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => alert("Payment processing...")}
            className="w-[200px] h-[48px] rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;
