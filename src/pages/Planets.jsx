import { GalleryVertical, Gamepad2, Menu, Orbit, Swords, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLANETS_DATA } from "../util/util";
import axios from "axios";
import PlanetInfoCard from "../components/PlanetInfoCard";

const Planets = () => {
    const [planets] = useState(PLANETS_DATA);
    const [characters, setCharacters] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchChars = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/characters"
                );
                if (response.status === 200) {
                    const sortedChars = [...response.data].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setCharacters(sortedChars);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChars();
    }, []);

    const trailblazers = characters.filter((char) =>
        char.name.includes("Trailblazer")
    );

    const regularChars = characters.filter(
        (char) => !char.name.includes("Trailblazer")
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading characters...</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
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
                            bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800
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
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Gamepad2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
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
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white hover:cursor-pointer"
                        >
                            <Users size={20} />
                            <span className="font-medium">Characters</span>
                        </button>

                        <button
                            onClick={() => navigate("/lightcones")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white hover:cursor-pointer"
                        >
                            <Swords size={20} />
                            <span className="font-medium">Light Cones</span>
                        </button>

                        <button
                            onClick={() => navigate("/relics")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white hover:cursor-pointer"
                        >
                            <GalleryVertical size={20} />
                            <span className="font-medium">Relics</span>
                        </button>
                        <button
                            onClick={() => navigate("/planets")}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white hover:cursor-pointer"
                        >
                            <Orbit size={20}/>
                            <span className="font-medium">Planets</span>
                            <span className="ml-auto bg-gray-800 text-sm px-2 py-1 rounded">
                            {planets.length}
                            </span>
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

                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        {planets.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <span className="text-white bg-clip-text text-transparent">
                                            Planets
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            ({planets.length} planets)
                                        </span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {planets.map((pl) => (
                                        <PlanetInfoCard key={pl.id} planet={pl}/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Planets;