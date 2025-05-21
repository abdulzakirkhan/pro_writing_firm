import { useEffect } from "react";
import { useTitle } from "../../context/TitleContext";
import OrderCard from "../../components/OrderCard/OrderCard";
import FilterSection from "../../components/filter/FilterSection";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router";
export default function OrderList() {
  const { setTitle } = useTitle();

  const cardData = [
    {
        id:1,
      batchName: "Batch 01",
      fileCount: "4/5",
      subject: "Bachelors - Computer Science",
      itemsCount: 5,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "partially paid",
      statusColor: "#F4A825",
      borderColor: "#F76631",
    },
    {
        id:2,
      batchName: "Batch 02",
      fileCount: "2/4",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Paid",
      statusColor: "#3BB537",
      borderColor: "#FBB343",
    },
    {
        id:3,
      batchName: "Batch 03",
      fileCount: "2/3",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Unpaid",
      statusColor: "#FF5C5C",
      borderColor: "#57C063",
    },
    {
        id:4,
      batchName: "Batch 01",
      fileCount: "4/5",
      subject: "Bachelors - Computer Science",
      itemsCount: 5,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "partially paid",
      statusColor: "#F4A825",
      borderColor: "#F76631",
    },
    {
        id:5,
      batchName: "Batch 03",
      fileCount: "2/3",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Unpaid",
      statusColor: "#FF5C5C",
      borderColor: "#57C063",
    },
    {
        id:6,
      batchName: "Batch 02",
      fileCount: "2/4",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Paid",
      statusColor: "#3BB537",
      borderColor: "#FBB343",
    },
    {
        id:7,
      batchName: "Batch 03",
      fileCount: "2/3",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Unpaid",
      statusColor: "#FF5C5C",
      borderColor: "#57C063",
    },
    {
        id:8,
      batchName: "Batch 02",
      fileCount: "2/4",
      subject: "Bachelors - Computer Science",
      itemsCount: 2,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "Paid",
      statusColor: "#3BB537",
      borderColor: "#FBB343",
    },
    {
        id:9,
      batchName: "Batch 01",
      fileCount: "4/5",
      subject: "Bachelors - Computer Science",
      itemsCount: 5,
      placedOn: "20/12/2024",
      deadline: "30/12/2024",
      price: 50,
      status: "partially paid",
      statusColor: "#F4A825",
      borderColor: "#F76631",
    },
  ];

  useEffect(() => {
    setTitle("Order List");
  }, [setTitle]);
  return (
    <>
      <div className="">
        <Link
          to={"/orders"}
          className="flex items-center text-xl text-[#6da5f9]"
        >
          <RiArrowLeftSLine size={30} /> Back
        </Link>
      </div>
      <FilterSection navigate={false} btnTitle={"Payment"} />
      <div className="grid grid-cols-3 gap-4 py-8">
        {cardData.map((card, idx) => (
          <OrderCard key={idx} {...card} />
        ))}
      </div>
    </>
  );
}
