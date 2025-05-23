import { useState, useEffect } from "react";
import {
  useGetFaqCategoryQuery,
  useGetFaqQuestionsQuery,
} from "../../redux/faqApi/faqApi";

export default function FAQS() {
  const { data: getFaqCategories = [], isLoading: getFaqCategoryLoading } =
    useGetFaqCategoryQuery();
  const [activeTab, setActiveTab] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { data: getFaqQuestions, isLoading: getFaqQuestionLoading } =
    useGetFaqQuestionsQuery(categoryId, {
      skip: !categoryId,
    });

  useEffect(() => {
    if (getFaqCategories.length > 0) {
      setActiveTab(getFaqCategories[0]?.category_name);
      setCategoryId(getFaqCategories[0]?.id);
    }
  }, [getFaqCategories]);

  const tabClass = (tab: string) =>
    `px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer text-lg font-medium ${
      activeTab === tab
        ? "bg-gradient-to-r from-[#6da5f9] to-[#0D7C7A] text-white shadow-lg"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  console.log("getFaqCategories :", getFaqCategories);

  if (getFaqQuestionLoading || getFaqCategoryLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {getFaqCategories.map((categ, index) => (
          <div
            key={index}
            className={tabClass(categ?.category_name)}
            onClick={() => {
              setActiveTab(categ?.category_name);
              setCategoryId(categ?.id);
            }}
          >
            {categ?.category_name}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
          {activeTab}
        </h2>

        {getFaqCategories?.length > 0 && getFaqQuestions?.length > 0 ? (
          <ul className="space-y-4">
            {getFaqQuestions.map((q, idx) => (
              <li
                key={idx}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-[#6da5f9] transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-1 h-full bg-[#6da5f9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Q: {q.question}
                </h4>
                <p className="text-gray-600">A: {q.answer}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            {/* <div className="text-gray-400 mb-4 text-4xl">📭</div> */}
            <p>No data</p>
          </div>
        )}
      </div>
    </div>
  );
}
