import React from "react";
import { FaSearch } from "react-icons/fa";
import { chatUsers } from "../assets/data";
import { useChat } from "../context/ChatContext";
import { useSidebar } from "../context/SidebarContext";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Link } from "react-router";

const ChatSidebar: React.FC = () => {
  const { selectedUser, setSelectedUser } = useChat();
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
          {chatUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                toggleMobileSidebar(); // close on mobile
              }}
              className={`flex items-start justify-between gap-2 px-3 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                selectedUser?.id === user.id ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex gap-3 items-start">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-[42px] h-[42px] rounded-full object-cover"
                />
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      user.isSupport || selectedUser?.id === user.id
                        ? "text-teal-600"
                        : "text-black"
                    }`}
                  >
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.message}</p>
                </div>
              </div>
              {user.unread ? (
                <div className="bg-teal-600 text-white text-xs px-2 py-[2px] rounded-full">
                  {user.unread}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default ChatSidebar;
