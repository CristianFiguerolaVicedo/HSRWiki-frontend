import { memo } from "react";
import { Backpack, ChartNoAxesColumn, Component, Gamepad2, Menu, Orbit, Shirt, Swords, Users, X } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", label: "Characters", Icon: Users },
  { path: "/lightcones", label: "Light Cones", Icon: Swords },
  { path: "/relics", label: "Relics", Icon: Shirt },
  { path: "/planets", label: "Planets", Icon: Orbit },
  { path: "/factions", label: "Factions", Icon: Component },
  { path: "/items", label: "Items", Icon: Backpack },
  { path: "/tier-list", label: "Tier List", Icon: ChartNoAxesColumn },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-bg-sidebar/90 backdrop-blur-md rounded-xl border border-border hover:bg-bg-elevated/90 transition-all duration-200"
        aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {sidebarOpen ? <X size={24} className="text-text-primary" /> : <Menu size={24} className="text-text-primary" />}
      </button>

      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed lg:sticky lg:top-0 left-0 z-40 h-screen
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64 flex flex-col bg-bg-sidebar border-r border-border
        `}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-purple text-text-primary rounded-lg flex items-center justify-center shadow-lg shadow-accent-cyan/20">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                HSR Wiki
              </h2>
              <p className="text-xs text-text-muted">v4.2</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((navItem) => {
              const IconComponent = navItem.Icon;
              const active = isActive(navItem.path);
              return (
                <button
                  key={navItem.path}
                  onClick={() => {
                    navigate(navItem.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200
                    ${active
                      ? "bg-accent-cyan/10 border-accent-cyan/50 text-accent-cyan shadow-lg shadow-accent-cyan/5"
                      : "bg-transparent border-border text-text-secondary hover:bg-bg-elevated hover:border-accent-cyan/30 hover:text-text-primary"
                    }
                  `}
                  aria-label={`Navigate to ${navItem.label}`}
                  aria-current={active ? "page" : undefined}
                >
                  <IconComponent size={20} className={active ? "text-accent-cyan" : ""} />
                  <span className="font-medium">{navItem.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse-glow" />}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-text-muted text-center">
            Honkai: Star Rail Wiki
          </p>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-bg-primary/60 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default memo(Sidebar);
