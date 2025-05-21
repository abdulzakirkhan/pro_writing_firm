import { useState, useEffect, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import {
  useGetNotificationByIdQuery,
  useMarkReadNotificationMutation,
} from "../../redux/agentdashboard/agentApi";
import { useSelector } from "react-redux";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.auth?.user);
  const modalRef = useRef(null);
  const {
    data: getNotificationsById,
    isLoading: getNotificationsByIdLoading,
    error: getNotificationsByIdError,
  } = useGetNotificationByIdQuery(user?.agent_user_id);
  const [markNotificationbyId, { isLoading: markNotificationbyIdLoading }] =
    useMarkReadNotificationMutation();

  const notifications = getNotificationsById?.result || [];

  const handleClick = async (id) => {
    // console.log("CLICKED ON :",id)
    const body = new FormData();
    body.append("notification_id", id);
    const res = await markNotificationbyId(body);
    console.log("res :", res);
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const unreadCount = notifications.filter(n => n.read_status === "0").length;

  return (
    <div className="relative">
      {/* Notification Icon */}
      <div
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white rounded-full cursor-pointer hover:text-gray-700 h-11 w-11 hover:bg-gray-100"
        onClick={() => setOpen(true)}
      >
        <svg
          className="fill-current"
          width="25"
          height="25"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Red Dot */}
      
      {/* <div className="w-2 h-2 top-3 end-3 rounded-full bg-red-500 absolute"></div> */}
      {unreadCount > 0 && (
        <div className="absolute top-1 z-0 end-2 bg-red-500 text-white text-xs font-semibold w-4 h-4 rounded-full flex items-center justify-center">
          {unreadCount}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-white/30">
          <div
            ref={modalRef}
            className="bg-white relative rounded-lg shadow-lg w-[400px] lg:w-[600px] h-full  overflow-y-auto p-6 transform transition-all scale-95 animate-fadeIn"
          >
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            {/* Notifications List */}
            <ul className="space-y-3">
              {/* {notifications.map((notification) => (
                <li
                  key={notification.id} onClick={() =>handleClick(notification?.id)}
                  className={`p-4 rounded-lg shadow-sm transition-colors ${
                    notification.read_status === "0"
                      ? "bg-white border-l-4 border-blue-500 hover:bg-gray-50"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          notification.read_status === "0"
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.utctime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </p>
                    </div>
                    {notification.read_status === "0" && (
                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </li>
              ))} */}
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <li
                    key={notification.id}
                    onClick={() => handleClick(notification?.id)}
                    className={`p-4 rounded-lg shadow-sm transition-colors ${
                      notification.read_status === "0"
                        ? "bg-white border-l-4 border-blue-500 hover:bg-gray-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            notification.read_status === "0"
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification?.utctime}
                        </p>
                      </div>
                      {notification.read_status === "0" && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>

            {/* Close Button */}
            <button
              className="absolute top-0 right-4"
              onClick={() => setOpen(false)}
            >
              <RxCross1 size={30} className="text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
