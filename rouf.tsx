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