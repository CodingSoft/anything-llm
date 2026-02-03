import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import HubItems from "./Trending/HubItems";
import AuthenticationPanel from "./AuthenticationPanel";

export default function CommunityHubUnified() {
  const [activeTab, setActiveTab] = useState("explore");

  const tabs = [
    { id: "explore", label: "Explorar", icon: "🔍" },
    { id: "my-items", label: "Mis Items", icon: "📦" },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Community Hub
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              Share and collaborate with the CodingSoft community.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 mt-6 mb-6 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "text-primary-button border-primary-button"
                    : "text-theme-text-secondary border-transparent hover:text-theme-text-primary"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === "explore" && <HubItems />}
            {activeTab === "my-items" && <AuthenticationPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
