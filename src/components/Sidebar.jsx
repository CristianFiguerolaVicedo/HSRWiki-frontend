import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Backpack, ChartNoAxesColumn, Component, Gamepad2, Menu, Orbit, Search, Shirt, Swords, Users, X, UserRound, ClipboardList, Calculator } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchJson } from "../services/apiClient";

const NAV_ITEMS = [
  { path: "/", label: "Characters", Icon: Users },
  { path: "/lightcones", label: "Light Cones", Icon: Swords },
  { path: "/relics", label: "Relics", Icon: Shirt },
  { path: "/planets", label: "Planets", Icon: Orbit },
  { path: "/factions", label: "Factions", Icon: Component },
  { path: "/items", label: "Items", Icon: Backpack },
  { path: "/tier-list", label: "Tier List", Icon: ChartNoAxesColumn },
  { path: "/planner", label: "Planner", Icon: ClipboardList },
  { path: "/calculator", label: "Stat Calculator", Icon: Calculator },
  { path: "/account", label: "My Account", Icon: UserRound },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("sidebar-collapsed") === "true"; } catch { return false; }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [gameVersion, setGameVersion] = useState(null);

  // Show the game version the backend data was generated from instead of a hard-coded label
  useEffect(() => {
    fetchJson("/version")
      .then((data) => setGameVersion(data?.gameVersion))
      .catch(() => setGameVersion(null));
  }, []);
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

  // Index page of the journal: every row sits on one ruled line (44px), icons live in the
  // margin like doodles and the current page is marked with a highlighter stroke.
  return (
    <div>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-bg-card border border-border rounded-xl shadow-md transition-colors duration-150"
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
          flex flex-col notebook-page
        `}
      >
        {/* header: three ruled lines tall */}
        <div className="flex-shrink-0 h-[132px] flex items-end">
          <div className="w-full h-[88px] flex items-center">
            <div className="margin-cell">
              <Gamepad2 size={20} className="text-accent-red -rotate-12" aria-hidden="true" />
            </div>
            {!collapsed && (
              <div className="min-w-0 pl-3 pr-4">
                <h2 className="flex items-baseline gap-2 text-2xl font-extrabold tracking-tight text-text-primary leading-none">
                  HSR Wiki
                  {gameVersion && (
                    <span className="font-hand text-xl font-bold tracking-normal text-accent-red -rotate-3" title="Game data version">
                      v{gameVersion}
                    </span>
                  )}
                </h2>
                <p className="font-hand text-[1.4rem] leading-tight text-text-secondary truncate">
                  Express journal
                </p>
              </div>
            )}
          </div>
        </div>

        {!collapsed && (
          <label className="ruled-row flex-shrink-0 flex items-end pb-[3px]">
            <span className="margin-cell self-center pt-[3px]">
              <Search size={16} className="text-text-muted" aria-hidden="true" />
            </span>
            <span className="sr-only">Search pages</span>
            <input
              type="text"
              placeholder="look something up..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 mx-3 bg-transparent font-hand text-[1.4rem] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </label>
        )}

        <nav className="flex-1 overflow-y-auto scrollbar-none">
          {filteredNavItems.map((navItem) => {
            const IconComponent = navItem.Icon;
            const active = isActive(navItem.path);
            return (
              <button
                key={navItem.path}
                onClick={() => handleNavigate(navItem.path)}
                className="ruled-row group w-full flex items-end pb-[5px] text-left cursor-pointer"
                aria-label={`Navigate to ${navItem.label}`}
                aria-current={active ? "page" : undefined}
                title={collapsed ? navItem.label : undefined}
              >
                <span className="margin-cell self-center pt-[5px]">
                  <IconComponent
                    size={19}
                    className={active ? "text-text-primary" : "text-text-muted group-hover:text-text-primary transition-colors"}
                    aria-hidden="true"
                  />
                </span>
                {!collapsed && (
                  <span
                    className={`ml-3 font-hand text-[1.6rem] leading-none truncate transition-colors
                      ${active ? "highlighter text-text-primary" : "text-text-secondary group-hover:text-text-primary"}`}
                  >
                    {navItem.label}
                  </span>
                )}
              </button>
            );
          })}
          {!collapsed && filteredNavItems.length === 0 && (
            <p className="ruled-row flex items-center pl-[52px] pr-4 font-hand text-xl text-text-muted">
              nothing by that name here
            </p>
          )}
        </nav>

        <div className="flex-shrink-0">
          <button
            onClick={toggleCollapse}
            className="ruled-row group w-full flex items-center text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <span className="margin-cell">
              <Menu size={16} className="rotate-90" aria-hidden="true" />
            </span>
            {!collapsed && <span className="ml-3 font-hand text-xl">fold the page</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-text-primary/30 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default memo(Sidebar);
