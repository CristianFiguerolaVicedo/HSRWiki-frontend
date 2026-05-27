import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Backpack, ChartNoAxesColumn, Component, Gamepad2, Menu, Orbit, Search, Shirt, Swords, Users, X } from "lucide-react";
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
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("sidebar-collapsed") === "true"; } catch { return false; }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem("sidebar-collapsed", next); } catch {}
      return next;
    });
  }, []);

  const isActive = useCallback((path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const filteredNavItems = useMemo(() => {
    if (!searchQuery) return NAV_ITEMS;
    return NAV_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
    setSidebarOpen(false);
  }, [navigate]);

  const sidebarWidth = collapsed ? "w-16" : "w-64";

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
          ${sidebarWidth}
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col bg-bg-sidebar border-r border-border overflow-hidden
        `}
      >
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 min-w-[40px] bg-gradient-to-br from-accent-cyan to-accent-purple text-text-primary rounded-lg flex items-center justify-center shadow-lg shadow-accent-cyan/20 flex-shrink-0">
              <Gamepad2 size={20} />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-text-primary truncate">
                  HSR Wiki
                </h2>
                <p className="text-xs text-text-muted">v4.2</p>
              </div>
            )}
          </div>
        </div>

        {!collapsed && (
          <div className="flex-shrink-0 px-4 pt-3 pb-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-card border border-border text-text-primary text-sm rounded-lg pl-9 pr-3 py-2 placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent-cyan/50 focus:border-accent-cyan/50 transition-all"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
          <div className="flex flex-col gap-1">
            {filteredNavItems.map((navItem) => {
              const IconComponent = navItem.Icon;
              const active = isActive(navItem.path);
              return (
                <button
                  key={navItem.path}
                  onClick={() => handleNavigate(navItem.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 relative
                    ${active
                      ? "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan"
                      : "bg-transparent border-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                    }
                  `}
                  aria-label={`Navigate to ${navItem.label}`}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-cyan rounded-r-full shadow-sm shadow-accent-cyan/50" />
                  )}
                  <IconComponent size={20} className="min-w-[20px] flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="font-medium text-sm truncate">{navItem.label}</span>
                      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse-glow flex-shrink-0" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
          {!collapsed && filteredNavItems.length === 0 && (
            <div className="text-xs text-text-muted text-center py-8">
              No pages found
            </div>
          )}
        </nav>

        <div className="flex-shrink-0 p-3 border-t border-border">
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all duration-200"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <Menu size={16} className="rotate-90" />
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
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
  );
};

export default memo(Sidebar);
