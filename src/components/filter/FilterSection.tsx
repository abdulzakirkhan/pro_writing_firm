import { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { Link } from "react-router";
export default function ({navigate,title="Order List",btnTitle , onClick}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownToggle = (section: string) => {
    setOpenDropdown((prev) => (prev === section ? null : section));
  };
  return (
    <>
      <div className="w-full flex-wrap flex justify-between items-center px-2">
        {/* Left Side: Title + See All */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          {navigate && (
            <Link to={"/order-list"} className="text-sm text-teal-600 underline">
                See all
            </Link>
          )}
        </div>

        {/* Right Side: Buttons + Search */}
        <div className="flex items-center flex-wrap gap-3">
          <button onClick={onClick} className="bg-[#157BA7] text-white text-sm px-4 py-1.5 min-w-[96px] max-w-[150px] h-[39px] rounded">
            {btnTitle}
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 text-sm border-2 border-[#B9AFAF] rounded"
            />
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md shadow"
            >
              <FaFilter /> Filter
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium"></span>
                  <button
                    onClick={() => setSelectedFilters([])}
                    className="text-teal-600 text-sm font-medium"
                  >
                    Clear all
                  </button>
                </div>

                {["Paid Orders", "Unpaid Orders", "Partially paid"].map(
                  (filter) => (
                    <div
                      key={filter}
                      className="flex justify-between items-center cursor-pointer text-sm py-1"
                      onClick={() => toggleFilter(filter)}
                    >
                      <span>{filter}</span>
                      <span
                        className={`h-4 w-4 rounded border border-gray-300 ${
                          selectedFilters.includes(filter) ? "bg-gray-400" : ""
                        }`}
                      ></span>
                    </div>
                  )
                )}

                {/* Dropdown Categories */}
                <div className="pt-3 space-y-2 text-sm">
                  {["Type of Paper", "Category", "Academic Level"].map(
                    (item) => (
                      <div key={item}>
                        <button
                          onClick={() => handleDropdownToggle(item)}
                          className="flex items-center justify-between w-full font-medium"
                        >
                          {item}{" "}
                          {openDropdown === item ? (
                            <IoMdArrowDropup />
                          ) : (
                            <IoMdArrowDropdown />
                          )}
                        </button>
                        {openDropdown === item && (
                          <div className="pl-4 pt-2 text-xs text-gray-600">
                            <p>Option 1</p>
                            <p>Option 2</p>
                            <p>Option 3</p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
