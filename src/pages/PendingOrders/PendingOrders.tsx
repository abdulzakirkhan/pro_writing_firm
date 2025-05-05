import { useSelector } from "react-redux";
import {
  useDeleteOrderMutation,
  useGetAgentPendingOrdersQuery,
  useMovePendingOrderMutation,
} from "../../redux/agentdashboard/agentApi";
import { useEffect, useState } from "react";
import {
  DocumentTextIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

export default function PendingOrders() {
  const user = useSelector((state) => state.auth?.user);
  const {
    data: allPendingOrders,
    isLoading,
    error,
    refetch,
  } = useGetAgentPendingOrdersQuery(user?.agent_user_id);
  const pendingOrders = allPendingOrders?.result || [];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveOrderModal, setShowMoveOrderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation();
  const [movePendingOrder, { isLoading: movePendingOrderLoading }] =
    useMovePendingOrderMutation();
  if (isLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4 text-4xl">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Failed to load orders
        </h2>
        <p className="text-gray-600 mb-4">Please try refreshing the page</p>
        <button
          onClick={refetch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  //   const confirmDeleteOrder = async () => {
  //     try {
  //       let payload = {
  //         agentId: user?.agent_user_id,
  //         orderId: "selectedOrder",
  //       };
  //       const res = await deleteOrder(payload);
  //       console.log("res datatatatattata=======>>>>>>>>>>", res?.data?.message);
  //       const { error } = res || {};
  //       if (error) {
  //         toast.error("Something went wrong.");
  //         return;
  //       }
  //       toast.success("Deleted Successfully");

  //       // refetch();
  //     } catch (error) {
  //       console.error("Error deleting order:", error);
  //     }
  //   };
  //   const handleDeleteClick = () => {
  //     console.log("clicked");
  //   };

  const confirmMoveOrder = async () => {
    try {
      let payload1 = {
        orderId: selectedOrderId,
      };
      const res = await movePendingOrder(payload1);
      const { error } = res || {};
      if (error) {
        toast.error("Something went wrong.");
        return;
      }
      toast.success("Moved Successfully");
    } catch (error) {
      console.error("Error moving order:", error);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pending Orders
          </h1>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-green-500 mb-4 text-6xl">🎉</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              All caught up!
            </h2>
            <p className="text-gray-600">No pending orders at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#13a09d] to-[#254E5C]"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <ClipboardDocumentIcon className="h-6 w-6 text-blue-600" />
                    <span className="font-mono text-sm text-gray-500">
                      #{order?.pendinglistid}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrderId(order?.pendinglistid);
                      setShowDeleteModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-red-200 text-red-700 rounded-full"
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <UserCircleIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Agent</p>
                      <p className="font-medium text-gray-900">
                        {order?.agent_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <UserCircleIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-medium text-gray-900">
                        {order?.clientname ? order?.clientname : "No Name"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Topic</p>
                      <p className="font-medium text-gray-900">
                        {order?.paper_topc}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Words</p>
                      <p className="font-medium text-gray-900">
                        {order?.no_of_words}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-1" />
                        <span className="font-medium text-gray-900">
                          {order?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
                    <button onClick={() => {
                      setSelectedOrderId(order?.pendinglistid);
                      setShowMoveOrderModal(true);
                    }} className="bg-[#13a09d] px-6 py-2 text-white rounded-sm">
                      Move To Order List
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 bg-white flex flex-col justify-center w-[509px] h-[255px] p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#065f46] mb-4">
              Delete Order
            </h2>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete order{" "}
              <span className="font-semibold">#{selectedOrderId}</span>?
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  const payload = {
                    agentId: user?.agent_user_id,
                    orderId: selectedOrderId,
                  };
                  const res = await deleteOrder(payload);
                  if (res?.error) {
                    toast.error("Something went wrong.");
                  } else {
                    toast.success("Deleted Successfully");
                    refetch();
                  }
                  setShowDeleteModal(false);
                }} 
                disabled={deleteLoading}
                className="px-6 py-2 rounded-md bg-[#13A09D] text-white hover:bg-[#10807f] transition"
              >
                {deleteLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showMoveOrderModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 bg-white flex flex-col justify-center w-[509px] h-[255px] p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#065f46] mb-4">
              Confirm Move
            </h2>
            <p className="text-gray-600 mb-8">
              Are you sure you want to move this order from pending to actual
              orders <span className="font-semibold">#{selectedOrderId}</span>?
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowMoveOrderModal(false)}
                className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    let payload1 = {
                      orderId: selectedOrderId,
                      agetID:user?.agent_user_id
                    };
                    const res = await movePendingOrder(payload1);
                    const { error } = res || {};
                    if (error) {
                      toast.error("Something went wrong.");
                      setShowMoveOrderModal(false)
                      return;
                    }
                    toast.success("Moved Successfully");
                    setShowMoveOrderModal(false);
                    refetch(); // Optional if you want to refresh orders
                  } catch (error) {
                    console.error("Error moving order:", error);
                    toast.error("Error occurred.");
                  }
                }}
                disabled={movePendingOrderLoading}
                className={`px-6 py-2 rounded-md ${
                    movePendingOrderLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#13A09D] hover:bg-[#10807f]"
                } text-white transition`}
              >
                {movePendingOrderLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
