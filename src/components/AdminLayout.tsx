import { ReactNode, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Star, Edit, PlusCircle, Users, Menu, X } from "lucide-react";
import wlbizLogo from "@/assets/logo.png";
import icon1 from "@/assets/icon/reward.png";
import icon2 from "@/assets/icon/Gallery Edit.png";
import icon3 from "@/assets/icon/Add Circle.png";
import icon4 from "@/assets/icon/kyc.png";
import bg from "@/assets/background.png";

import { useWeb3Modal,useWeb3ModalTheme } from '@web3modal/wagmi/react'
import { useAccount, useReadContract, useWriteContract } from "wagmi";

const navItems = [
  { title: "Statists Reward", path: "/", icon: icon1 },
  { title: "Edit/delete Product", path: "/edit-product", icon: icon2 },
  { title: "Add Product", path: "/add-product", icon: icon3 },
  { title: "Manage KYC", path: "/manage-kyc", icon: icon4 },
];

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const AdminLayout = ({ children, pageTitle }: AdminLayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);



  const { open, close } = useWeb3Modal()
  const { isConnected,isDisconnected,chain } = useAccount()
  const { address } = useAccount();

  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex  h-[73px] items-center justify-between px-4 md:px-8 py-4 navbar-border-b">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-foreground p-1"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="">
            <img src={wlbizLogo} alt="WLBIZ" className="" />
            
          </div>
        </div>
        <button className="gradient-connect px-6 py-2.5 rounded-xl text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
                              onClick={() => open()} 

        
        >
          {!isConnected?("Connect Wallet"):(address.slice(0,4)+"...."+address.slice(39,42))}
          </button>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static top-0 left-0 h-full lg:h-auto z-40 
            w-60 flex-shrink-0  pt-20 lg:pt-4 pb-4 px-4 bg-background lg:bg-transparent
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          sidebar-border-r`}
        >
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
                >
                 <img src={item.icon} alt={item.title} className="w-5 h-5" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 relative overflow-x-hidden">
          
          <div className="  z-10 relative">
            {children}
          </div>
          <div className="absolute top-0 left-0 h-[70vh]">
            <img src={bg} alt="WLBIZ" className=" h-[70vh] object-cover" />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex flex-col h-[73px] sm:flex-row items-center justify-between px-4 md:px-8 py-5  mt-auto gap-3">
        <div className="flex items-center gap-2.5">
          <img src={wlbizLogo} alt="WLBIZ" className="object-cover" />
        </div>
        <div className="flex items-center gap-4 text-foreground text-sm">
          <span className="hover:text-foreground cursor-pointer transition-colors">Terms & Conditions</span>
          <span className="text-border">|</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
