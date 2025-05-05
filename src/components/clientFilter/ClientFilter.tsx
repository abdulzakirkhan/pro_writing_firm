import { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { Link } from "react-router";

type FilterSectionProps = {
  navigate?: boolean;
  title: string;
};

const FilterSection: React.FC<FilterSectionProps> = ({ navigate, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    Subject: [] as string[],
    Batch: [] as string[],
  });

  const categories = {
    Subject: ["Data Structures", "OOP", "History", "Calculus"],
    Batch: ["Batch 01", "Batch 02", "Batch 03", "Batch 04"],
  };

  const handleToggle = (section: string, option: string) => {
    setFilters((prev) => {
      const selected = prev[section];
      const newValues = selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option];
      return { ...prev, [section]: newValues };
    });
  };

  const handleToggleAll = (section: string) => {
    const allSelected = filters[section].length === categories[section].length;
    setFilters((prev) => ({
      ...prev,
      [section]: allSelected ? [] : [...categories[section]],
    }));
  };

  const clearAll = () => {
    getAllPaperSubjectAndBatches?.paper_subject || [];({ Subject: [], Batch: [] });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-wrap justify-between items-center px-2">
      {/* Title + See All */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-black">{title}</h2>
        {navigate && (
          <Link to="/order-list" className="text-sm text-teal-600 underline">
            See all
          </Link>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center flex-wrap gap-3">
        <button className="bg-[#157BA7] text-white text-sm px-4 py-1.5 w-[96px] h-[39px] rounded">
          Payment
        </button>

        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 text-sm border-2 border-[#B9AFAF] rounded"
          />
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Filter */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md shadow"
          >
            <FaFilter /> Filter
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-[270px] bg-white rounded-xl shadow-lg p-4 z-50 border">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Filter Options</span>
                <button onClick={clearAll} className="text-teal-600 text-sm font-medium">
                  Clear all
                </button>
              </div>

              {/* Grouped Filters */}
              {Object.entries(categories).map(([section, options]) => (
                <div key={section} className="mb-4 border rounded p-2">
                  <div className="flex justify-between font-medium text-sm mb-2">
                    <span>{section}</span>
                    <span
                      className={`h-4 w-4 rounded border border-gray-300 cursor-pointer ${
                        filters[section].length === options.length ? "bg-teal-500" : ""
                      }`}
                      onClick={() => handleToggleAll(section)}
                    ></span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {options.map((option) => (
                      <div
                        key={option}
                        onClick={() => handleToggle(section, option)}
                        className="flex justify-between items-center cursor-pointer px-1"
                      >
                        <span>{option}</span>
                        <span
                          className={`h-4 w-4 rounded border border-gray-300 ${
                            filters[section].includes(option) ? "bg-teal-500" : ""
                          }`}
                        ></span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
