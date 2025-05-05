import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Orders from "./pages/Orders/Orders";
import OrderList from "./pages/OrderList/OrderList";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import OrderSummaryCard from "./pages/OrderSummaryCard/OrderSummaryCard";
import MyClients from "./pages/MyClients/MyClients";
import Settings from "./pages/Settings/Settings";
import Wallet from "./pages/Wallet/Wallet";
import PaymentHistory from "./pages/PaymentHistory/PaymentHistory";
import Chat from "./pages/Chat/Chat";
import PageMeta from "./components/common/PageMeta";
import { useSelector } from "react-redux";
import PublicRoute from "./PrivateRoute";
import OrderInitiate from "./pages/OrderInitiate/OrderInitiate";
import FAQS from "./pages/FAQS/FAQS";
import PendingOrders from "./pages/PendingOrders/PendingOrders";

export default function App() {
  const user = useSelector((state) => state.auth?.user);
  return (
    <>
      <PageMeta title="Pro Writng Firm" description="This is React.js " />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <PublicRoute type="private">
                <AppLayout />
              </PublicRoute>
            }
          >
            <Route index path="/" element={<Home />} />

            <Route path="/orders" element={<Orders />} />
            <Route path="/my-pending-orders" element={<PendingOrders />} />

            {/* <Route path="/order-list" element={<OrderList  />} /> */}

            <Route path="/order/order-details" element={<OrderDetails />} />
            <Route
              path="/order/:id/order-summary"
              element={<OrderSummaryCard />}
            />
            <Route path="/my-clients" element={<MyClients />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/initiate-order" element={<OrderInitiate />} />
            <Route path="/faqs" element={<FAQS />} />
          </Route>

          {/* Auth Layout */}
          <Route
            path="/signin"
            element={
              <PublicRoute type="public">
                <SignIn />{" "}
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute type="public">
                <SignUp />
              </PublicRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
