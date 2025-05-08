import { FaDownload, FaFilePdf, FaPaperclip } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import completed from "../../assets/completed.png";
import progress from "../../assets/progress.png";
import { Link, useLocation, useParams } from "react-router";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { useInsertRequestRevesionMutation } from "../../redux/agentdashboard/agentApi";
import { CgAttachment } from "react-icons/cg";
import { RxCrossCircled } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { convertDateToYYYYMMDD } from "../../config/indext";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const OrderSummaryCard = () => {
  const [requestRevesion, { isLoading: requestRevesionLoading }] =
    useInsertRequestRevesionMutation();
  const { id } = useParams();
  const user = useSelector((state) => state.auth?.user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef(null);
  const [comment, setComment] = useState("");
  const [request, setRequest] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // console.log("order :", order);
  const location = useLocation();

  const { card, data } = location.state || [];
  const orderDetails = data?.orders?.find((order) => order.id === id);


  const nwfile=orderDetails?.downloadFile;

  const baseUrl=`https://staging.portalteam.org/newfolder/${nwfile}`

  
  const handleRequestRevision = () => {
    setRequest((prev) => !prev);
  };
  const modalRef = useRef(null);
  const handleFileBoxClick = () => {
    fileInputRef.current.click();
  };

  function decodeHTML(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const percentage =
    card?.completePercentage === null || undefined
      ? 0
      : card?.completePercentage;
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit behaviour
    try {
      if (!comment.trim()) {
        alert("Please enter comment before submitting.");
        return;
      }

      const formattedDate = convertDateToYYYYMMDD(date);
      const formData = new FormData();

      if (selectedFile) {
        formData.append("revision_file[]", selectedFile);
      }

      formData.append("order_id", id);
      formData.append("revision_date", formattedDate);
      formData.append("revision_comment", comment);
      formData.append("agent_id", user?.agent_user_id); // make sure user is available
      const res = await requestRevesion(formData);

      if (res?.error) {
        toast.error("Something went wrong.");
        return;
      }

      toast.success(res?.data?.result?.response || "Revision request sent successfully.");

      // Close modal + Reset
      setRequest(false);
      setSelectedFile(null);
      setComment("");
    } catch (error) {
      console.error("Revision error", error);
      toast.error("Something went wrong.");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setRequest(false);
      }
    };

    if (request) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [request]);
  return (
    <>
      <div className="">
        <Link
          to={"/orders"}
          className="flex items-center text-xl text-[#13A09D]"
        >
          <RiArrowLeftSLine size={30} /> Back
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-6 relative">
        {/* Left Side */}
        <div className="col-span-12 xl:col-span-7">
          <div
            className={`flex justify-between h-48 w-full bg-center  px-6 pt-6 bg-no-repeat items-start`}
            style={{
              backgroundImage: `url(${
                card?.paymentStatus === "Paid" ? completed : progress
              })`,
              backgroundSize: "100% 100%",
            }}
          >
            <div>
              <h2 className="text-lg font-semibold text-green-600">
                {card?.paymentStatus === "Paid" ? "Completed" : "Inprogress"}
              </h2>
              <p className="text-sm">
                {card?.status === "Paid"
                  ? "Your Order has been completed!"
                  : "We are working on your order. Please wait."}
              </p>
            </div>
            <div className="w-[79px] h-[79px]">
              <CircularProgressbar
                value={card?.completePercentage || 0}
                text={`${percentage}%`}
                styles={buildStyles({
                  textColor: card?.status === "Paid" ? "#3BB537" : "#FCAE30", // red-500 or white
                  pathColor: card?.status === "Paid" ? "#3BB537" : "#FCAE30",
                  trailColor: "#d4f1dc",
                  textSize: "28px",
                })}
              />
            </div>
          </div>
          <div
            className="bg-white shadow-lg pt-6 px-8"
            style={{
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
          >
            {/* Order Meta */}
            <div className="flex justify-between text-sm text-gray-600 ">
              <p>
                <span className="font-semibold text-black">Order ID:</span>{" "}
                {orderDetails?.id}
              </p>
              <p>Order placed: {data?.orderPlacedDate}</p>
              <p>Order deadline: {data?.deadline}</p>
            </div>

            {/* Download + Marks */}
            <div className="mt-4 flex justify-between items-center">
              <button
                className={`flex items-center gap-2 ${orderDetails?.downloadFile ? "bg-[#13A09D]"  :"bg-gray-500" }  text-white px-4 py-2 rounded text-sm`}
                onClick={() => {
                  if (!orderDetails?.downloadFile) {
                    alert("No file available for download.");
                    return;
                  }

                  // Start download
                  const link = document.createElement("a");
                  link.href = baseUrl;
                  link.download = ""; // optional, you can put custom filename here e.g. "order-file.pdf"
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <FaDownload size={14} />
                Download File
              </button>
              <div className="w-[55px] h-[55px] bg-[#157BA7] text-white rounded-full flex flex-col items-center justify-center text-sm font-bold">
                <span>{card?.marks ? card?.marks : 12}</span>
                <span className="text-[10px] font-normal">Marks</span>
              </div>
            </div>

            {/* Paper Details */}
            <div className="mt-4 text-sm  py-12">
              <p className="text-lg">
                <span className="font-semibold text-lg">Paper Topic:</span>{" "}
                {data?.title}
              </p>
              <p className="mt-2 text-lg">
                <span className="font-semibold text-lg">Paper Type:</span>{" "}
                {data?.type} &nbsp;&nbsp;
                <span className="font-semibold text-lg">Level:</span>{" "}
                {card?.level} &nbsp;&nbsp;
                <span className="font-semibold text-lg">Category:</span>{" "}
                {card?.category} &nbsp;&nbsp;
                <span className="font-semibold text-lg">Pages:</span>{" "}
                {data?.qty}
              </p>
              <p className="flex py-2 text-lg">
                <span className="font-semibold text-lg">Description:</span>{" "}
                <span
                  className="font-normal m-0 p-0"
                  dangerouslySetInnerHTML={{
                    __html: decodeHTML(data?.description || ""),
                  }}
                />
                {/* {data?.description} */}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-12 xl:col-span-5 flex flex-col space-y-12">
          <div className="p-5">
            <h3 className="text-lg font-bold mb-2">Payment Details</h3>
            <p className="text-sm flex justify-between mb-1">
              Total Price:{" "}
              <span className="font-bold text-gray-700">
                ${card?.price ? card?.price : 10}
              </span>
            </p>
            <p className="text-sm flex justify-between">
              Status:{" "}
              <span className="font-medium text-green-600">
                {card?.status ? card?.status : "Pending"}
              </span>
            </p>

            <div className="px-6 py-3 mt-4">
              <div className="border-[1.1px] border-[#7F7F7F]"></div>
            </div>
          </div>

          <div className="bg-[#007EA8] text-white p-6 h-[165px] rounded-xl text-center shadow">
            <p className="text-md font-medium mb-3">
              Need adjustments? We’ve got you covered!
            </p>

            <button
              onClick={handleRequestRevision}
              className="bg-white text-[#007EA8] font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-100"
            >
              Request Revision
            </button>
            {request && (
              <div
                ref={modalRef}
                className="absolute -top-[10%] left-[35%] z-50 shadow-2xl border w-[394px] bg-white rounded-2xl p-6"
              >
                {/* Close Button */}
                <div className="flex justify-end">
                  <button onClick={() => setRequest(false)}>
                    <RxCrossCircled size={28} className="text-[#D33316]" />
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-center text-black text-xl font-semibold mb-4">
                  Set Deadline
                </h2>
                <form>
                  {/* Date Picker */}
                  <div className="flex items-center border px-2 py-1 rounded mb-4">
                    <input
                      value={date}
                      type="date"
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full outline-none text-sm text-black"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span className="text-lg text-black">
                        Attach project files{" "}
                        <span className="text-gray-400">(optional)</span>
                      </span>
                      <CgAttachment size={25} className="" />
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />

                    {/* Upload box trigger */}
                    <div
                      className="flex items-center justify-between border px-3 py-2 rounded bg-gray-50 text-sm cursor-pointer"
                      onClick={handleFileBoxClick}
                    >
                      {selectedFile ? (
                        <>
                          <div className="flex text-black items-center gap-2">
                            <FaFilePdf className="text-red-600" />
                            {selectedFile.name}
                          </div>
                          <MdClose
                            className="text-gray-500 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent triggering file upload again
                              setSelectedFile(null);
                            }}
                          />
                        </>
                      ) : (
                        <span className="text-gray-400 italic">
                          No file chosen
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment Box */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">
                      Comment
                    </label>
                    <textarea
                      rows={8}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border resize-none text-black rounded-lg px-3 py-2 text-sm focus:outline-none"
                      placeholder="Write your comment..."
                    />
                  </div>

                  {/* Confirm Button */}
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#13A09D] text-white font-medium py-2 rounded hover:bg-teal-600 transition"
                  >
                    Confirm
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummaryCard;
