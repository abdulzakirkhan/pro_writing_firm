import { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { Link } from "react-router";
import {
  useGetAgentOrdersDataQuery,
  useGetPaperSubjectQuery,
  useGetUniversityAndBatchesQuery,
} from "../../redux/agentdashboard/agentApi";
import { useSelector } from "react-redux";
export default function ({
  navigate,
  title = "Order List",
  btnTitle,
  onClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  
  const {
    data: universityAndBatchData,
    isLoading: universityAndBatchDataLoading,
    error: universityAndBatchDataError,
  } = useGetUniversityAndBatchesQuery();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState(["Any University"]);
  const user = useSelector((state) => state.auth?.user);
  const {
    data: paperSubjectData,
    isLoading: paperSubjectDataLoading,
    error: paperSubjectDataError,
  } = useGetPaperSubjectQuery();
  const subjects = paperSubjectData?.result?.All_Paper_subject;
  // const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  // const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  // const [selectedSubject, setSelectedSubject] = useState(["Any Subject"]);
  // const universities = universityAndBatchData?.result?.universities_data;

  let payload = {
    agentId: user?.agent_user_id,
    university:selectedUniversity,
    batch:"All",
    paperSubject:selectedSubject
  };


  const {data: agentOrdersData,isLoading: agentOrdersDataLoading,error,} = useGetAgentOrdersDataQuery(payload);



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
            <Link
              to={"/order-list"}
              className="text-sm text-teal-600 underline"
            >
              See all
            </Link>
          )}
        </div>

        {/* Right Side: Buttons + Search */}
        <div className="flex items-center flex-wrap gap-3">
          <button
            onClick={onClick}
            className="bg-[#157BA7] text-white text-sm px-4 py-1.5 min-w-[96px] max-w-[150px] h-[39px] rounded"
          >
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

                {/* Dropdown Subjects */}
                <div className="mb-4">
                  <button
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className="flex items-center justify-between w-full text-sm font-medium"
                  >
                    {selectedSubject || "Any University"}{" "}
                    <IoMdArrowDropdown />
                  </button>
                  {showSubjectDropdown && (
                    <div className="border max-h-48 overflow-y-auto rounded p-2 mt-1 space-y-1 bg-white shadow">
                      {subjects.map((subject) => (
                        <div
                          key={subject?.id}
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => {
                            setSelectedSubject(subject?.id);
                            setShowSubjectDropdown(false);
                          }}
                        >
                          {subject?.subject_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown universities */}

                <div className="mb-4">
                  <button
                    onClick={() =>
                      setShowUniversityDropdown(!showUniversityDropdown)
                    }
                    className="flex items-center justify-between w-full text-sm font-medium"
                  >
                    {selectedUniversity || "Any University"}{" "}
                    <IoMdArrowDropdown />
                  </button>
                  {showUniversityDropdown && (
                    <div className="border max-h-48 overflow-y-auto rounded p-2 mt-1 space-y-1 bg-white shadow">
                      {universities.map((uni) => (
                        <div
                          key={uni?.id}
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => {
                            setSelectedUniversity(uni?.id);
                            setShowUniversityDropdown(false);
                          }}
                        >
                          {uni?.uni_name}
                        </div>
                      ))}
                    </div>
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
