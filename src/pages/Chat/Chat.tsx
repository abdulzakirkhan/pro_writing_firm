import { useEffect } from "react";
import { useTitle } from "../../context/TitleContext";
import { useChat } from "../../context/ChatContext";
import { FaPaperPlane, FaSearch, FaThumbtack } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { MdPushPin } from "react-icons/md";
import { useSidebar } from "../../context/SidebarContext";
export default function Chat() {
  const { setTitle } = useTitle();
  const { selectedUser } = useChat();
  const {
    isMobileOpen,
    toggleMobileSidebar,
  } = useSidebar();
  useEffect(() => {
    setTitle("Chat");
  }, [setTitle]);

  if (!selectedUser) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-auto lg:h-full relative">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:h-[88px] px-6 py-6 bg-white justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="font-bold text-md">{selectedUser.name}</div>
        </div>
        <div className="relative w-[240px]">
          <input
            type="text"
            placeholder="Search"
            className="border px-4 py-1.5 pr-10 rounded text-sm w-full"
          />
          <FaSearch className="absolute top-2.5 right-3 text-gray-400" />
        </div>
      </div>

      {/* Pinned Message */}
      <div className="bg-teal-700 flex items-center justify-between text-white text-sm py-2 px-4">
        <div className="flex items-center gap-2">
            <MdPushPin size={21} /> Lorem ipsum dolor sit amet consectetur....
        </div>
         <div className="">
         <button
              className="lg:hidden text-red-700"
              onClick={toggleMobileSidebar}
            >
              <CiMenuFries size={26}/>
            </button>
         </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 bg-[#f5f5f5]">
        {/* Date Label */}
        <div className="flex justify-center">
          <span className="bg-teal-600 text-white px-3 py-1 text-xs rounded-sm">
            13 September 2024
          </span>
        </div>

        {/* Received Message */}
        <div className="max-w-[80%] lg:max-w-[50%] bg-[#00A5A5] text-white p-3 rounded-md ml-auto text-sm relative">
          Lorem ipsum dolor sit amet consectetur. Dolor consectetur libero
          facilisi sagittis sed sed morbi feugiat hendrerit. Pellentesque
          ultricies scelerisque metus aenean id aliquet nunc sollicitudin.
        </div>

        {/* Sent Message */}
        <div className="max-w-[80%] lg:max-w-[50%] bg-[#e4e4e4] text-black p-3 rounded-md mr-auto text-sm">
          Lorem ipsum dolor sit amet consectetur. Dolor consectetur libero
          facilisi sagittis sed sed morbi feugiat hendrerit. Pellentesque
          ultricies scelerisque metus aenean id aliquet nunc sollicitudin.
        </div>

        {/* Sent + Pinned */}
        <div className="max-w-[80%] lg:max-w-[50%] bg-[#0077A7] text-white p-3 rounded-md ml-auto text-sm relative">
          <div className="absolute top-2 right-2 text-white">
            <FaThumbtack size={12} />
          </div>
          Lorem ipsum dolor sit amet consectetur. Dolor consectetur libero
          facilisi sagittis sed sed morbi feugiat hendrerit.
        </div>

        {/* Today Label */}
        <div className="flex justify-center">
          <span className="bg-gray-300 text-black px-3 py-1 text-xs rounded-md">
            Today
          </span>
        </div>

        {/* Received Again */}
        <div className="max-w-[80%] lg:max-w-[50%] bg-[#e4e4e4] text-black p-3 rounded-md mr-auto text-sm">
          Lorem ipsum dolor sit amet consectetur. Dolor consectetur libero
          facilisi sagittis sed sed morbi feugiat hendrerit.
        </div>
      </div>

      {/* Input */}
      <div className="px-3 lg:fixed lg:bottom-0 w-full lg:w-[85vw] flex gap-2">
        <div className="p-3 border w-1/1 rounded-md border-[#13A09D] flex items-center gap-3 bg-white">
            <input
            type="text"
            placeholder="Type your message"
            className="w-full px-4 py-2 rounded-full text-sm outline-none"
            />
        </div>
        <div className="w-1/12 flex items-center">
            <button className="bg-teal-600 text-white p-2 w-[48px] h-[48px] flex items-center justify-center rounded-full">
                <FaPaperPlane size={16} />
            </button>
        </div>
      </div>
    </div>
  );
}
