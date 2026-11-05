import { createContext, useContext, useEffect, useRef, useState, memo, useCallback, useSyncExternalStore } from "react";
import { ChevronUp } from "lucide-react";
import Sidebar from "./Sidebar";
import { isServerWaking, onServerWakingChange } from "../services/apiClient";

const SectionContext = createContext();

export const useSectionReveal = () => useContext(SectionContext);

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top ${visible ? "visible" : ""}`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

/** Shown while requests are slow: on the free plan the API sleeps and takes about a minute to wake up. */
const WakingBanner = () => {
  const waking = useSyncExternalStore(onServerWakingChange, isServerWaking);
  if (!waking) return null;
  return (
    <div
      role="status"
      className="fixed bottom-24 md:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md glass-panel px-4 py-3 flex items-center gap-3 shadow-lg"
    >
      <span className="w-4 h-4 shrink-0 rounded-full border-2 border-accent-red border-t-transparent animate-spin" aria-hidden="true" />
      <p className="text-sm leading-snug">
        <span className="font-semibold">Waking up the server…</span>{" "}
        <span className="text-text-secondary">It sleeps when nobody visits, so the first load can take up to a minute.</span>
      </p>
    </div>
  );
};

const SectionReveal = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${revealed ? "stagger-enter-active" : "stagger-enter"}`}
    >
      {children}
    </div>
  );
};

const Layout = ({ children, title, description, hero, breadcrumbs }) => {
  return (
    <SectionContext.Provider value={{ SectionReveal }}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-x-clip transition-all duration-300">
          {hero && (
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-accent-purple/5 to-transparent" />
              <div className="absolute inset-0 backdrop-shimmer" />
              <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8 md:pt-20 md:pb-12 animate-fade-in">
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
                    {breadcrumbs.map((crumb, i) => (
                      <span key={i} className="flex items-center gap-2">
                        {i > 0 && <span className="text-border">/</span>}
                        {crumb.path ? (
                          <a
                            href={crumb.path}
                            className="hover:text-accent-cyan transition-colors"
                          >
                            {crumb.label}
                          </a>
                        ) : (
                          <span className="text-text-secondary">{crumb.label}</span>
                        )}
                      </span>
                    ))}
                  </nav>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                  {title}
                </h1>
                {description && (
                  <p className="text-text-secondary text-lg max-w-2xl">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-6 lg:py-8">
            {children}
          </div>
        </main>
        <BackToTop />
        <WakingBanner />
      </div>
    </SectionContext.Provider>
  );
};

export default memo(Layout);
