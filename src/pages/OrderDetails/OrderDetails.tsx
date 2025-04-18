import { useEffect } from "react";
import { useTitle } from "../../context/TitleContext";
import FilterSection from "../../components/filter/FilterSection";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router";
import { useParams } from "react-router-dom";
import Order from "../../components/Order/Order";
import OrderStatusCard from "../../components/OrderStatusCard/OrderStatusCard";
export default function OrderDetails() {
  const { setTitle } = useTitle();
  const { id } = useParams();
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

  const order= cardData.find(order=>order.id === Number(id));

  useEffect(() => {
    setTitle("Order List");
  }, [setTitle]);

  const cardDatas = [
    {
        id:1,
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
      percentage:100,
      clientName:"Client Name",
      marks:90,
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
      status: "partially paid",
      statusColor: "#3BB537",
      borderColor: "#FBB343",
      percentage:47,
      clientName:"Client Name",
      marks:90,
    },
    {
        id:3,
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
      percentage:100,
      clientName:"Client Name",
      marks:90,
    },
    {
        id:4,
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
      percentage:100,
      clientName:"Client Name",
      marks:90,
    },
    {
        id:5,
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
      percentage:100,
      clientName:"Client Name",
      marks:90,
    },
  ];

  return (
    <>
    <div className="">
        <Link
          to={"/order-list"}
          className="flex items-center text-xl text-[#13A09D]"
        >
          <RiArrowLeftSLine size={30} /> Back
        </Link>
      </div>
      <FilterSection navigate={false} />
      <div className="py-8">
        <Order order={order} />
      </div>

      <div className="grid grid-cols-3 gap-2 py-8">
        {cardDatas.map((card, idx) => (
          <OrderStatusCard card={card} />
        ))}
      </div> 
    </>
  );
}
