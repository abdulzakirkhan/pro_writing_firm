import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetStandardValuesQuery } from "../../redux/sharedApi/sharedApi";
import {
  useGetAgentCreditLimitsQuery,
  useGetAllClientsForOrderQuery,
  useGetAllCoursesForOrderQuery,
  useGetAllPaperSubjectForOrdersQuery,
  useGetPaperTopicFromCourseQuery,
} from "../../redux/agentdashboard/agentApi";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { CATEGORY_LEVELS } from "../../constants/apiUrls";
import {
  useAgentInitiateOrderMutation,
  useUploadFileForFileReaderMutation,
  useUploadFileLinkForFileReaderMutation,
} from "../../redux/ordersApi/ordersApi";
import { convertDateToYYYYMMDD } from "../../config/indext";
import toast, { Toaster } from "react-hot-toast";
import { IoMdArrowDropdown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

interface FormValues {
  taskSheet: File | null;
  additionalModule: File | null;
  // client: string;
  deadline: string;
  wordCount: number | "";
  course: string;
  papertopic: string;
  // subject: string;
  batch: string;
  category: string;
  paperSubject: string;
}

// const initialValues: FormValues = {
//   taskSheet: null,
//   additionalModule: null,
//   // client: "",
//   deadline: "",
//   wordCount: "",
//   // subject: "",
//   course: "",
//   papertopic: "",
//   batch: "",
//   category: "",
//   paperSubject: "",
// };
const FILE_SIZE_LIMIT_MB = 30;
const SUPPORTED_FORMATS = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const validationSchema = Yup.object({
  taskSheet: Yup.mixed()
    .required("Task sheet is required")
    .test("fileSize", "File too large", (value) => {
      // If value is string (URL) → skip file size check
      if (typeof value === "string") return true;
  
      return value && value.size <= FILE_SIZE_LIMIT_MB * 1024 * 1024;
    })
    .test("fileFormat", "Unsupported file format", (value) => {
      if (typeof value === "string") return true;
  
      return value && SUPPORTED_FORMATS.includes(value.type);
    }),

  additionalModule: Yup.mixed()
    .required("Additional module is required")
    .test("fileSize", "File too large", (value) => {
      return value && value.size <= FILE_SIZE_LIMIT_MB * 1024 * 1024;
    })
    .test("fileFormat", "Unsupported file format", (value) => {
      return value && SUPPORTED_FORMATS.includes(value.type);
    }),
  // client: Yup.string().required("Client is required"),
  deadline: Yup.string().required("Deadline is required"),
  wordCount: Yup.number()
    .typeError("Must be a number")
    .required("Word count is required"),
  course: Yup.string().required("Course is required"),
  // subject: Yup.string().required("Subject is required"),
  batch: Yup.string().required("Batch is required"),
  category: Yup.string().required("Category is required"),
  papertopic: Yup.string().required("Paper Topic is required"),
  paperSubject: Yup.string().required("Paper Topic is required"),
});
export default function OrderInitiate() {
  const user = useSelector((state) => state.auth?.user);
  // const [selectedCourse, setSelectedCourse] = useState(null);
  const { data: standarValues } = useGetStandardValuesQuery(
    user?.agent_user_id
  );
  const [apiParsedData, setApiParsedData] = useState(null);
  const [uploadFileForFileReader, { isLoading:uploadFileForFileReaderLoading, error:oploadFileForFileReaderError }] = useUploadFileForFileReaderMutation();
  const [uploadFileLinkForFileReader,{isLoading:uploadFileLinkForFileReaderLoading,error:uploadFileLinkForFileReaderError}] = useUploadFileLinkForFileReaderMutation();

  const [agentInitaiteOrder, { isLoading: agentInitaiateOrderLoading }] =
    useAgentInitiateOrderMutation();
  const {
    data: agentCreditLimit,
    isLoading: agentCreditLimitLoading,
    error: agentCreditLimitError,
  } = useGetAgentCreditLimitsQuery(user?.agent_user_id);
  // const {data: allAgentClients,isLoading: allAgentClientsLoading,error: allAgentClientsError,} = useGetAllClientsForOrderQuery(user?.agent_user_id);
  const {
    data: getAllCourses,
    isLoading: getAllCoursesLoading,
    error: getAllCoursesError,
  } = useGetAllCoursesForOrderQuery();

  const {
    data: getAllPaperSubjectAndBatches,
    isLoading: getAllPaperSubjectAndBatchesLoading,
    error: getAllPaperSubjectAndBatchesError,
  } = useGetAllPaperSubjectForOrdersQuery();

  const [selectedClient, setSelectedClient] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState();
  const [fileName, setFileName] = useState();
  const [preview, setPreview] = useState<string | null>(null);
  const [taskSheetPre, setTaskSheetPre] = useState<string | null>(null);
  const [addintionalModule, setAdditionalModule] = useState("");
  const [fileReader, setFileReader] = useState(null)
  const {
    data: paperTopic,
    isLoading: paperTopicLoading,
    error: paperTopicError,
  } = useGetPaperTopicFromCourseQuery(selectedCourse?.id || selectedCourse);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);

  const {
    data: allAgentClients,
    isLoading: allAgentClientsLoading,
    error: allAgentClientsError,
  } = useGetAllClientsForOrderQuery(user?.agent_user_id);

  const courses = getAllCourses?.result || [];
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const clients = allAgentClients?.result || [];
  const paperTopics = paperTopic?.result || [];
  const subjectTopics = getAllPaperSubjectAndBatches?.paper_subject || [];
  const batches = getAllPaperSubjectAndBatches?.batch_data || [];
  const categories = CATEGORY_LEVELS;
  const ratesSlabes = standarValues?.result[0]?.slabs_rate;
  const standardRates = standarValues?.result[0]?.standardRates;

  const handleImageToggle = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    setFileName(null);
    setTaskSheetPre(null);
  };
  // const { setFieldValue } = useFormikContext();
  const [ptopic, setPtopic] = useState('');
  const [courseApi, setCourseApi] = useState('');
  const [wordCountApi, setWordCountApi] = useState('');
  const [deadlineApi, setDeadlineApi] = useState('');
  const [taskSheetApi, setTaskSheetApi] = useState('');
 
  const sendAPI = async (res, type) => {
    try {
      // console.log('resposne', { res, type });
      const formData = new FormData();

      formData.append('file_link', res?.data?.file_url); // Replace with actual ID
      formData.append('customer_id', '100');
      formData.append('file_type', type);
      setTaskSheetApi(res?.data?.file_url)
      uploadFileLinkForFileReader(formData)
        .unwrap()
        .then((res) => {
          const { word_count: wc, deadline, paper_topic } = res.data;
          setPtopic(paper_topic)
          setWordCountApi(wc);
          setCourseApi('7')
          const ndAp =convertDateToYYYYMMDD(deadline)
          setDeadlineApi(ndAp)

          // // …the rest stays the same
          // setFileReaderPaperTopic(paper_topic);
          // setFileReaderWordCount(wc);
          // setValue('wordCount', wc);
          const py={id: '7', label: 'General '}
          setSelectedCourse(py);
          // setValue('course', '7');
        });
    } catch (error) {
      console.error('file parsing failed', error);
    }
  };

const getFileType = (fileUrl: string): string | null => {
  if (!fileUrl) return null; // no url? return null

  const urlParts = fileUrl.split("?"); // remove any query params
  const cleanUrl = urlParts[0];

  const extensionMatch = cleanUrl.match(/\.([a-zA-Z0-9]+)$/); // extract extension

  if (extensionMatch) {
    return extensionMatch[1].toLowerCase(); // return extension like 'pdf', 'png'
  }

  return null; // no extension found
};




// console.log("standardRates :",standarValues?.result[0]?.standardRates)

// let nrw = standardRates?.[category];

  useEffect(() => {
    const uploadFile = async () => {
      if (taskSheetPre) {
        const formData = new FormData();
        formData.append("filemsg", fileReader);
        try {
          const response = await uploadFileForFileReader(formData).then(
             (response) =>{
              // console.log(response.data)
              const filetype= getFileType(response.data.file_url);
              // console.log("filetype :",filetype)
              sendAPI(response,filetype)
             }
          ).catch(
            (error) =>{
              console.log(error)
            }
          )
          // console.log("Response :", response);
          // const url=response?.file_url;

          // if(response.status_code ===200){

          // }

        } catch (error) {
          console.error("Upload error", error);
        }
      }
    };
  
    uploadFile();
  }, [taskSheetPre])
  



  const initialValues: FormValues = {
    taskSheet: taskSheetApi,
    additionalModule: null,
    // client: "",
    deadline: deadlineApi,
    wordCount: wordCountApi,
    // subject: "",
    course: courseApi,
    papertopic: ptopic,
    batch: "",
    category: "",
    paperSubject: "",
  };
  if(uploadFileForFileReaderLoading || uploadFileLinkForFileReaderLoading){
    return(
      <div className="w-full md:h-[80vh]">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    )
  }

  console.log("clients :",clients)
  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Order
        </h1>

        <Formik
         enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            // console.log("category",values)
            try {
              const {
                wordCount,
                category,
                deadline,
                course,
                paperSubject,
                batch,
                papertopic,
                taskSheet,
                additionalModule,
              } = values;
              // console.log("category",values)
              const wordCountNum = parseInt(wordCount.toString(), 10);
              const clients = selectedClientIds;
              // console.log("clients",clients)
              // return
              const noOfCopiesNum = selectedClientIds.length;
              if (!additionalModule) {
                const proceed = window.confirm(
                  "Without providing any additional module, results may be affected. Do you want to continue?"
                );
                // if (!proceed) {
                //   actions.setSubmitting(false);
                //   return;
                // }
              }

              const slabRanges = Object.keys(ratesSlabes || {});
              slabRanges.sort(
                (a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0])
              );

              let rate = standardRates[category];

              for (const range of slabRanges) {
                const [start, end] = range.split("-").map(Number);
                if (wordCountNum >= start && wordCountNum <= end) {
                  rate = ratesSlabes?.[range]?.[category];
                  break;
                }
              }

              if (rate === undefined) {
                alert("Invalid category or rate not found.");
                actions.setSubmitting(false);
                return;
              }

              const totalOrderPrice = wordCountNum * rate * noOfCopiesNum;
              const creditLimit =
                agentCreditLimit?.result?.credit_data?.avaible_limit ?? 0;

              if (totalOrderPrice > creditLimit) {
                const maxOrders = Math.floor(
                  creditLimit / (wordCountNum * rate)
                );
                const remainingCredit =
                  creditLimit - maxOrders * wordCountNum * rate;

                if (maxOrders === 0) {
                  alert(
                    `Credit limit exceeded. You cannot place an order. Required: ${
                      wordCountNum * rate
                    }`
                  );
                  actions.setSubmitting(false);
                  return;
                }

                const confirmProceed = window.confirm(
                  `• You can create up to ${maxOrders} orders.\n• Remaining Credit: ${remainingCredit}\nProceed with limited orders?`
                );

                if (!confirmProceed) {
                  actions.setSubmitting(false);
                  return;
                }
              }
              const formatedDate = convertDateToYYYYMMDD(deadline);

              const formData = new FormData();
              const max = Math.floor(creditLimit / (wordCountNum * rate));
              formData.append("agent_id", user?.agent_user_id);
              formData.append("no_of_copies", selectedClientIds.length);
              formData.append("order_deadline", formatedDate);
              formData.append("orders_total_price", totalOrderPrice.toString());
              formData.append("no_of_words", wordCount.toString());
              formData.append("category", category);
              formData.append(
                "single_copy_price",
                Math.ceil(wordCountNum * rate).toString()
              );
              formData.append("total_copies", clients.length.toString());
              formData.append("course", course);
              formData.append("paperSubject", paperSubject);
              formData.append("paperTopic", papertopic);
              formData.append("clients", selectedClientIds);
              // selectedClientIds.forEach((id) => {
              //   formData.append("clients[]", id.toString());
              // });
              formData.append("batch", batch);
              formData.append("currency", user?.currency);

              if (taskSheet) formData.append("tasksheet[]", taskSheet);
              if (additionalModule)
                formData.append("additionalmodlue[]", additionalModule);

              // TODO: Replace with your actual API call
              const res = await agentInitaiteOrder(formData);
              if (res?.error) {
                alert("Something went wrong.");
                return;
              }
              toast.success("Order initiated successfully!");
              actions.resetForm();
              setPreview(null);
              setTaskSheetPre(null);
              setSelectedClientIds([]);
              setPtopic("")
              setCourseApi("")
              setWordCountApi("")
              setDeadlineApi("")
              setTaskSheetApi("")
              setFileName("")
              setAdditionalModule("")
            } catch (error) {
              console.error("Submission Error:", error);
              alert("An unexpected error occurred.");
            } finally {
              actions.resetForm()
              actions.setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              {/* File Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Task Sheet *
                    <div className="mt-1 relative flex items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                      <div className="text-center">
                        <input
                          type="file"
                          name="taskSheet"
                          accept=".pdf,.docx,.jpg,.txt,.doc,.jpeg,.png"
                          className="sr-only"
                          onChange={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            const file = event.currentTarget.files?.[0] || null;
                            setFileName(file.name);
                            setFileReader(file)
                            setTaskSheetPre(URL.createObjectURL(file));
                            setFieldValue("taskSheet", file);
                          }}
                        />
                        {taskSheetPre ? (
                          <img src={taskSheetPre} alt="" className="max-w-32" />
                        ) : (
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        <p className="text-xs flex gap-3 items-center text-gray-500">
                          {fileName ? fileName : "PDF, DOCX up to 10MB"}
                        </p>
                      </div>
                      {taskSheetPre && (
                        <RxCross2
                          size={30}
                          className="text-red-500 absolute -top-5 -right-4 cursor-pointer"
                          onClick={handleImageToggle}
                        />
                      )}
                    </div>
                  </label>
                  <ErrorMessage
                    name="taskSheet"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Module *
                    <div className="mt-1 !relative flex items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                      <div className="text-center">
                        <input
                          type="file"
                          name="additionalModule"
                          accept=".pdf,.docx,.jpg,.jpeg,.png"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0] || null;
                            // console.log("file", file)
                            setPreview(URL.createObjectURL(file));
                            setAdditionalModule(file?.name);
                            setFieldValue("additionalModule", file);
                          }}
                        />
                        {preview ? (
                          <img
                            src={preview}
                            alt=""
                            className="max-w-32 max-h-14"
                          />
                        ) : (
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        <p className="text-xs text-gray-500">
                          {addintionalModule
                            ? addintionalModule
                            : "PDF, DOCX up to 10MB"}
                        </p>
                      </div>
                      {addintionalModule && (
                        <RxCross2
                          size={30}
                          className="text-red-500 absolute -top-5 -right-5 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            e.nativeEvent.stopImmediatePropagation();
                            setAdditionalModule(null);
                            setPreview(null);
                          }}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Client and Deadline Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Client (No. of Client=No. of Orders)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowClientDropdown(!showClientDropdown)}
                    className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {selectedClientIds.length > 0
                      ? `${selectedClientIds.length} selected`
                      : "Select Clients"}
                    <IoMdArrowDropdown />
                  </button>

                  {showClientDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow max-h-48 overflow-y-auto">
                      {clients.map((client) => (
                        <label
                          key={client.id}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedClientIds.includes(client.id)}
                            onChange={(e) => {
                              let updated;
                              if (e.target.checked) {
                                updated = [...selectedClientIds, client.id];
                              } else {
                                updated = selectedClientIds.filter(
                                  (id) => id !== client.id
                                );
                              }
                              setSelectedClientIds(updated);
                              // setFieldValue("client", updated);
                            }}
                            className="accent-teal-600"
                          />
                          <span className="ml-2 text-sm">{client.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Set Deadline
                  </label>
                  <div className="relative">
                    <Field
                      type="date"
                      name="deadline"
                      innerRef={dateInputRef}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                    />
                    <div
                      className="absolute w-full flex justify-end inset-y-0 right-4 pl-3 items-center cursor-pointer text-gray-400"
                      onClick={() => dateInputRef.current?.showPicker()}
                    >
                      📅
                    </div>
                  </div>
                  <ErrorMessage
                    name="deadline"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              {/* subjects and Deadline Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course *
                  </label>
                  <Field
                    as="select"
                    name="course"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("course", e.target.value); // Set value in Formik
                      const selectCourse = courses.find(
                        (course) => course.id === e.target.value
                      );
                      setSelectedCourse(selectCourse);
                      // console.log("selectCourse",selectCourse.id)
                    }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course?.id} value={course?.id}>
                        {course?.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="course"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Categories *
                  </label>
                  <Field
                    as="select"
                    name="category"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select course</option>
                    {categories.map((category) => (
                      <option key={category?.id} value={category?.label}>
                        {category?.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Course Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Paper Topics *
                  </label>
                  {selectedCourse?.id === "7" ? <Field
                    type="text"
                    name="papertopic"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="Enter word count"
                  />:
                  <Field
                    as="select"
                    name="papertopic"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Topic</option>
                    {paperTopics.map((subject) => (
                      <option key={subject?.id} value={subject?.label}>
                        {subject?.label}
                      </option>
                    ))}
                  </Field>
                  }
                  <ErrorMessage
                    name="papertopic"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Paper Subject *
                  </label>
                  <Field
                    as="select"
                    name="paperSubject"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Subject</option>
                    {subjectTopics.map((subject) => {
                      return (
                        <option key={subject?.id} value={subject?.id}>
                          {subject?.label}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="paperSubject"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                {/* Similar structure for Subject, Batch, Category, Word Count */}

                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Paper Topic *
                  </label>
                  <Field
                    type="text"
                    name="paperTopic"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("paperTopic", e.target.value);
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="Paper Topic"
                  />
                  <ErrorMessage
                    name="paperTopic"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div> */}
              </div>

              {/* batches Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Batches *
                  </label>
                  <Field
                    as="select"
                    name="batch"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch?.id} value={batch?.id}>
                        {batch?.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="batch"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Word Count *
                  </label>
                  <Field
                    type="number"
                    name="wordCount"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="Enter word count"
                  />
                  <ErrorMessage
                    name="wordCount"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                >
                  {isSubmitting ? "Submitting..." : "Create Order"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
