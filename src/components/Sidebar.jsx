import { Component, GalleryVertical, Gamepad2, Menu, Orbit, Swords, Users, X } from "lucide-react";
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
                            border-r border-gray-800
                            transition-transform duration-300 ease-in-out
                            ${
                            sidebarOpen
                                ? "translate-x-0"
                                : "-translate-x-full lg:translate-x-0"
                            }
                            w-64
                            flex flex-col`}
                >
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-900 rounded-lg flex items-center justify-center">
                        <Gamepad2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gray-400 bg-clip-text text-transparent">
                        HSR Wiki
                        </h2>
                        <p className="text-xs text-gray-400">v3.8</p>
                    </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-700 border border-blue-500/20 text-white hover:cursor-pointer hover:bg-gray-800"
                        >
                            <Users size={20} />
                            <span className="font-medium">Characters</span>
                        </button>

                        <button
                            onClick={() => navigate("/lightcones")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-700 border border-blue-500/20 text-white hover:cursor-pointer hover:bg-gray-800"
                        >
                            <Swords size={20} />
                            <span className="font-medium">Light Cones</span>
                        </button>

                        <button
                            onClick={() => navigate("/relics")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-700 border border-blue-500/20 text-white hover:cursor-pointer hover:bg-gray-800"
                        >
                            <GalleryVertical size={20} />
                            <span className="font-medium">Relics</span>
                        </button>
                        <button
                            onClick={() => navigate("/planets")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-700 border border-blue-500/20 text-white hover:cursor-pointer hover:bg-gray-800"
                        >
                            <Orbit size={20}/>
                            <span className="font-medium">Planets</span>
                        </button>
                        <button
                            onClick={() => navigate("/factions")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-700 border border-blue-500/20 text-white hover:cursor-pointer hover:bg-gray-800"
                        >
                            <Component size={20}/>
                            <span className="font-medium">Factions</span>
                        </button>
                    </div>

                    <div className="my-6 border-t border-gray-800"></div>
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