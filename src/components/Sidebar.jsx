import { Backpack, Component, GalleryVertical, Gamepad2, Menu, Orbit, Shirt, Swords, Users, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700 hover:bg-gray-700/90 transition-colors"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex">
                <aside
                    className={`
                            fixed lg:sticky lg:top-0 left-0 z-40 h-screen
                            transition-transform duration-300 ease-in-out
                            ${
                            sidebarOpen
                                ? "translate-x-0"
                                : "-translate-x-full lg:translate-x-0"
                            }
                            w-64
                            flex flex-col`}
                >
                <div className="p-6">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E1D9BC] text-[#30364F] rounded-lg flex items-center justify-center">
                        <Gamepad2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#E1D9BC]">
                        HSR Wiki
                        </h2>
                        <p className="text-xs text-[#E1D9BC]">v3.8</p>
                    </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#E1D9BC] text-[#30364F] hover:cursor-pointer hover:bg-[#30364F] hover:text-[#E1D9BC] hover:border-[#E1D9BC]"
                        >
                            <Users size={20} />
                            <span className="font-medium">Characters</span>
                        </button>

                        <button
                            onClick={() => navigate("/lightcones")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#E1D9BC] text-[#30364F] hover:cursor-pointer hover:bg-[#30364F] hover:text-[#E1D9BC] hover:border-[#E1D9BC]"
                        >
                            <Swords size={20} />
                            <span className="font-medium">Light Cones</span>
                        </button>

                        <button
                            onClick={() => navigate("/relics")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#E1D9BC] text-[#30364F] hover:cursor-pointer hover:bg-[#30364F] hover:text-[#E1D9BC] hover:border-[#E1D9BC]"
                        >
                            <Shirt size={20} />
                            <span className="font-medium">Relics</span>
                        </button>
                        <button
                            onClick={() => navigate("/planets")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#E1D9BC] text-[#30364F] hover:cursor-pointer hover:bg-[#30364F] hover:text-[#E1D9BC] hover:border-[#E1D9BC]"
                        >
                            <Orbit size={20}/>
                            <span className="font-medium">Planets</span>
                        </button>
                        <button
                            onClick={() => navigate("/factions")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#E1D9BC] text-[#30364F] hover:cursor-pointer hover:bg-[#30364F] hover:text-[#E1D9BC] hover:border-[#E1D9BC]"
                        >
                            <Component size={20}/>
                            <span className="font-medium">Factions</span>
                        </button>
                        <button
                            onClick={() => navigate("/items")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#E1D9BC] text-[#30364F] hover:cursor-pointer hover:bg-[#30364F] hover:text-[#E1D9BC] hover:border-[#E1D9BC]"
                        >
                            <Backpack size={20} />
                            <span className="font-medium">Items</span>
                        </button>
                    </div>

                    <div className="my-6"></div>
                </nav>
                </aside>

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-30"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default Sidebar;