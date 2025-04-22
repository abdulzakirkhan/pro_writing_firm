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

export default function App() {
  return (
    <>
    <PageMeta title="Pro Writng Firm"
        description="This is React.js " />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/orders" element={<Orders  />} />

            <Route path="/order-list" element={<OrderList  />} />

            <Route path="/order/order-details" element={<OrderDetails  />} />
            <Route path="/order/:id/order-summary" element={<OrderSummaryCard  />} />
            <Route path="/my-clients" element={<MyClients  />} />
            <Route path="/settings" element={<Settings  />} />
            <Route path="/wallet" element={<Wallet  />} />
            <Route path="/payment-history" element={<PaymentHistory  />} />
            <Route path="/chat" element={<Chat  />} />


          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
