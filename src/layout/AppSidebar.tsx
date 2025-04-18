import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import { useSidebar } from "../context/SidebarContext";

// icons
import { FaHistory } from "react-icons/fa";
import { TbWallet } from "react-icons/tb";
import { ImUsers } from "react-icons/im";
import { IoSettingsOutline } from "react-icons/io5";
import { PiNote } from "react-icons/pi";
import ques from "../../icons/q.png";
import left from "../../icons/left.png";
import { MdOutlineLogout } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { CgNotes } from "react-icons/cg";

import { useNavigate } from "react-router-dom"; 
import { ChevronDownIcon } from "../icons";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  sPath?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <MdSpaceDashboard />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <CgNotes />,
    name: "Orders",
    path: "/orders",
    sPath: "/order-list",
  },
  {
    icon: <ImUsers  />,
    name: "My Clients",
    path: "/my-clients",
  },
  {
    icon: <FaHistory />,
    name: "Payment History",
    path: "/payment-history",
  },
  {
    name: "Wallet",
    icon: <TbWallet />,
    path: "/wallet",
  },
  {
    name: "Settings",
    icon: <IoSettingsOutline />,
    path: "/settings",
  },
  {
    name: "Terms &  Conditions",
    icon: <PiNote />,
    path: "/terms-and-conditions",
  },
  {
    name: "FAQs",
    icon: <img src={ques} alt="FAQs Icon" className="w-5 h-5" />,
    path: "/faqs",
  },
];

const othersItems: NavItem[] = [];
type AppSidebarProps = {
  setShowLogoutModal: (val: boolean) => void;
};
const AppSidebar: React.FC<AppSidebarProps> = ({ setShowLogoutModal }) => {
  const {
    isExpanded,
    isMobileOpen,
    toggleSidebar,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );



  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-start"
                  : "lg:justify-end"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "text-[#13A09D]"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item ${isExpanded || isHovered || isMobileOpen ? "lg:justify-center" : "!justify-start"} group ${
                  isActive(nav.path)
                    ? "bg-[#13A09D] text-white"
                    : "menu-item-inactive"
                }`}
              >
                <span className={`menu-item-icon-size `}>{nav.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) ? "":  <span
                    className={`menu-item-text ${
                      isActive(nav.path) ? "text-white" : ""
                    }`}
                  >
                    {nav.name}
                  </span>}

                  <span
                    className={`menu-item-text lg:hidden ${isActive(nav.path) ? "text-white" : ""}`}>
                    {nav.name}
                  </span>
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name} className="flex justify-center items-center">
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };
  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  return (
    <aside
      className={`fixed flex flex-col lg:mt-0 top-0 left-3 lg:left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[90%] lg:w-[120px]" : isHovered ? "w-[290px]": "w-[290px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-0 ${
          !isExpanded && !isHovered
            ? "lg:justify-center py-2 justify-center text-center"
            : " mt-0 py-0 h-[110px]"
        }`}
      >
        <Link to="/" className="flex w-full items-center justify-center">
          <div className="">
            <img className="h-[80px]" src="/images/logo/logo.png" alt="Logo" />
          </div>
        </Link>
      </div>
      <div className="relative">
        <div className="w-full h-[1.4px] bg-[#C6BCBC]"></div>
        <button
          className="absolute flex justify-center items-center -right-3 -top-5 z-999999 w-[32px] h-[32px] bg-[#D9D9D9] rounded-4xl"
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
        >
          <img src={left} alt="" className="w-[30px]" />
          {/* {isMobileOpen ? () : ()} */}
        </button>
        <button
          onClick={toggleApplicationMenu}
          className="hidden items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="mt-12">{renderMenuItems(navItems, "main")}</div>
          </div>
        </nav>
      </div>
      <div className="w-full h-[1.2px] bg-[#C6BCBC]"></div>

      <div className="mt-5 flex justify-center">
        <button className="flex items-center gap-2" onClick={() => setShowLogoutModal(true)}>
          <MdOutlineLogout className="menu-item-icon-inactive" size={30} />
          {(isExpanded || isHovered || isMobileOpen) ? "" : <span className="menu-item-text">Log out</span>}
        </button>
      </div>

    </aside>

    
  );
};

export default AppSidebar;
