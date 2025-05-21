import { useSelector } from "react-redux";
import {
  useDeleteOrderMutation,
  useGetAgentPendingOrdersQuery,
  useGetAllPaperSubjectForOrdersQuery,
  useMovePendingOrderMutation,
} from "../../redux/agentdashboard/agentApi";
import { useEffect, useState } from "react";
import {
  DocumentTextIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  CubeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRightIcon, UserIcon } from "../../icons";

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

  // if (error)
  //   console.log("Error :",error?.data?.message)
  //   return (
  //     <div className="text-center py-12">
  //       {/* <div className="text-red-500 mb-4 text-4xl">⚠️</div> */}
  //       <h2 className="text-xl font-semibold text-gray-800 mb-2">
  //         {error?.data?.message}
  //       </h2>
  //     </div>
  //   );
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
      console.log("res :", res);
      toast.success("Moved Successfully");
    } catch (error) {
      console.error("Error moving order:", error);
    }
  };
  const {
    data: getAllPaperSubjectAndBatches,
    isLoading: getAllPaperSubjectAndBatchesLoading,
    error: getAllPaperSubjectAndBatchesError,
  } = useGetAllPaperSubjectForOrdersQuery();
  const batches = getAllPaperSubjectAndBatches?.batch_data || [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pending Orders
          </h1>
        </div>

        {isLoading ? (
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
        ) : (
          <>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-12">
                {/* <div className="text-green-500 mb-4 text-6xl">🎉</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              All caught up!
            </h2> */}
                <p className="text-gray-600">No pending orders at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
  {pendingOrders.map((order, index) => {
    const batch = batches.find(b => b.id === order.batch_id);
    return (
      <div
        key={order.pendinglistid}
        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-gray-200 group relative overflow-hidden"
      >
        {/* Status Indicator Ribbon */}
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 to-[#254E5C]"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <ClipboardDocumentIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <span className="block font-semibold text-gray-900">Order ID</span>
              <span className="font-mono text-sm text-cyan-600">#{order.pendinglistid}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedOrderId(order.pendinglistid);
              setShowDeleteModal(true);
            }}
            className="p-2 hover:bg-red-50 rounded-full transition-colors"
          >
            <TrashIcon className="h-5 w-5 text-red-400 hover:text-red-600" />
          </button>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Batch Info */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <CubeIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Batch</p>
                <p className="font-semibold text-gray-900">{batch?.label || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500">
                <UserCircleIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Agent</span>
              </div>
              <p className="font-semibold text-gray-900 truncate">{order.agent_name}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500">
                <UserIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Client</span>
              </div>
              <p className="font-semibold text-gray-900 truncate">
                {order.clientname || 'No Name'}
              </p>
            </div>
          </div>

          {/* Paper Details */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-gray-500">
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Topic</span>
              </div>
              <p className="font-semibold text-gray-900 leading-tight">
                {order.paper_topc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-indigo-600 mb-1">Words</p>
                <p className="font-bold text-indigo-700 text-xl">{order.no_of_words}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-emerald-600 mb-1">Price</p>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-emerald-600 mr-1" />
                  <span className="font-bold text-emerald-700 text-xl">{order.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => {
              setSelectedOrderId(order.pendinglistid);
              setShowMoveOrderModal(true);
            }}
            className="w-full bg-gradient-to-r from-cyan-500 to-[#254E5C] hover:from-cyan-600 hover:to-[#2c5d6d] text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02]"
          >
            Move to Order List
            <ArrowRightIcon className="h-4 w-4 inline-block ml-2" />
          </button>
        </div>
      </div>
    );
  })}
</div>
            )}
          </>
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
                className="px-6 py-2 rounded-md bg-[#6da5f9] text-white hover:bg-[#10807f] transition"
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
                      agetID: user?.agent_user_id,
                    };
                    const res = await movePendingOrder(payload1);
                    const { error } = res || {};
                    if (error) {
                      toast.error("Something went wrong.");
                      setShowMoveOrderModal(false);
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
                    : "bg-[#6da5f9] hover:bg-[#10807f]"
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
