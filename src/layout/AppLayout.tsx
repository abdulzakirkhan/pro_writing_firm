import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation, useNavigate } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { TitleProvider } from "../context/TitleContext";
import LogoutModal from "../components/LogoutModal/LogoutModal";
import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import { ChatProvider } from "../context/ChatContext";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();

  // Define routes where you want to hide or change sidebar
  const isChatPage = location.pathname.startsWith('/chat');
  const handleLogout = () => {
    // clear user state/token if needed
    navigate("/signin");
  };

  return (
    <>
      <div className="min-h-screen xl:flex">
        <div>
          {!isChatPage && 
          <>
          <AppSidebar setShowLogoutModal={setShowLogoutModal} />
          <Backdrop />
          </>
          }
          {isChatPage && <ChatSidebar />}  
        </div>
        <div
          className={`flex-1 transition-all ${isChatPage && "lg:!ml-0"} duration-300 ease-in-out ${
            isExpanded || isHovered ? "lg:ml-[120px]" : "lg:ml-[120px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
        >
          <AppHeader />
          <div className={` ${!isChatPage && "p-4 mx-auto md:p-6"} max-w-(--breakpoint-2xl)`}>
            <Outlet />
          </div>
        </div>
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

const AppLayout: React.FC = ()  => {
  return (
    <SidebarProvider>
      <TitleProvider>
        <ChatProvider>
          <LayoutContent  />
        </ChatProvider>
      </TitleProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
