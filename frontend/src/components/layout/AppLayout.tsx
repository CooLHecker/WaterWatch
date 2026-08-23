import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { AssistantFab } from "./AssistantFab";

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-[280px] flex flex-col min-w-0">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 w-full">
          <div className="p-4 md:p-gutter max-w-container-max mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <AssistantFab />
    </div>
  );
}
