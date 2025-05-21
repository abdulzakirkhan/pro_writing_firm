import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useTitle } from "../../context/TitleContext";
import FilterSection from "../../components/filter/FilterSection";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import Order from "../../components/Order/Order";
import OrderStatusCard from "../../components/OrderStatusCard/OrderStatusCard";
interface OrderItem {
  orders:OrderItem[];
}

export default function UnpaidOrders() {
  const user = useSelector((state) => state.auth?.user);
  
    const { setTitle } = useTitle();
    const { id } = useParams();
    const location = useLocation();
    const order = location.state;

    const orders=order?.orders


    console.log("orders: ",orders)
  return (
    <>
    <div className="flex">
      <div className="">

        <Link
          to={"/orders"}
          className="flex items-center text-xl text-[#6da5f9]"
        >
          <RiArrowLeftSLine size={30} /> Back
        </Link>
      </div>
      </div>
      {/* <FilterSection navigate={false} /> */}
      <div className="py-8">
        <Order order={order} />
      </div>

      <div className="grid grid-cols-3 gap-2 py-8">
        {orders.length > 0 ? orders.map((card, idx) => (
          <OrderStatusCard card={ card} key={idx} data={order} />
        )) : <p className="text-center w-full md:col-span-12">No Orders</p>}
      </div> 
    </>
  );
}



