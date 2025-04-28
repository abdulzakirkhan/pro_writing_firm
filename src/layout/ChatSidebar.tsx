import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { chatUsers } from "../assets/data";
import { useChat } from "../context/ChatContext";
import { useSidebar } from "../context/SidebarContext";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Link } from "react-router";
import { useGetAllChatsQuery, useGetCurrentUserChatSessionQuery } from "../redux/chat/chatApi";
import { useSelector } from "react-redux";

const ChatSidebar: React.FC = () => {
  // const { selectedUser, setSelectedUser } = useChat();
  const [page, setPage] = useState(0);
  const user = useSelector((state) => state.auth?.user);

  const {
    isMobileOpen,
    toggleMobileSidebar,
  } = useSidebar();

  return (
    <>
      {/* BACKDROP for mobile */}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[290px] bg-white border-r shadow-md transition-transform duration-300
          ${!isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative lg:block
        `}
      >
        {/* Back Logo or Arrow */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <MdOutlineArrowBackIos size={26} className="text-[#13A09D]" />
            </Link>
            {/* Close sidebar on mobile */}
            <button
              className="lg:hidden text-red-700"
              onClick={toggleMobileSidebar}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-lg px-4 py-2 pr-10 text-sm outline-none"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Chat List */}
        <ul className="flex flex-col overflow-y-auto max-h-[calc(100vh-150px)] px-1">
            <li
              className={`flex items-start justify-between gap-2 px-3 py-3 border-b cursor-pointer hover:bg-gray-50 bg-gray-200`}
            >
              <div className="flex gap-3 items-start">
                <img
                  src={"https://randomuser.me/api/portraits/men/1.jpg"}
                  alt={"Customer Support"}
                  className="w-[42px] h-[42px] rounded-full object-cover"
                />
                <div>
                  <p
                    className={`text-sm font-semibold text-teal-600`}
                  >
                    Customer Support
                  </p>
                  <p className="text-xs text-gray-500">Chat With Customer Support</p>
                </div>
              </div>
            </li>
        </ul>
      </aside>
    </>
  );
};

export default ChatSidebar;
