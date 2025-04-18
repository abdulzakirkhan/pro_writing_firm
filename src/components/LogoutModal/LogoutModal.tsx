// components/LogoutModal.tsx
import React from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;
/* Are you sure you wan to logout from your account? */

// width: 429px;
// height: 48px;

// /* subtitle */
// font-family: 'Roboto';
// font-style: normal;
// font-weight: 400;
// font-size: 20px;
// line-height: 120%;
// /* or 24px */

// /* Dark Grey */
// color: #6D6D6D;


// /* Inside auto layout */
// flex: none;
// order: 1;
// align-self: stretch;
// flex-grow: 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Only dim the background without blur */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white flex flex-col justify-center w-[509px] h-[255px] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-teal-700 mb-3">Logout Account</h2>
        <p className="text-[20px] pr-6 font-[400] text-gray-700 mb-6">Are you sure you wan to logout from your account? </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="w-[206px] h-[48px] rounded border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-[206px] h-[48px] rounded bg-teal-600 text-white hover:bg-teal-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
