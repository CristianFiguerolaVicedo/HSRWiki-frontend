import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const TierList = () => {
    const [chars, setChars] = useState([]);
    const [tierGroups, setTierGroups] = useState({});

    const tierColors = {
        'T0': 'red-600',
        'T0.5': 'red-400',
        'T1': 'orange-400',
        'T1.5': 'orange-300',
        'T2': 'orange-200',
        'T3': 'lime-200',
        'T4': 'lime-400',
        'T5': 'cyan-300'
    };

    const groupByTier = (chars) => {
        const tiers = {
            'T0': ['Anaxa', 'Castorice', 'Hysilens', 'Evernight', 'Phainon', 'Kafka', 'Cerydra', 'Cyrene', 'Sunday', 'TrailblazerRemembrance#F', 'TrailblazerRemembrance#M', 'Tribbie', 'Dan Heng • Permansor Terrae', 'Hyacine'],
            'T0.5': ['Aglaea', 'Archer', 'Firefly', 'Mydei', 'Saber', 'The Herta', 'Black Swan', 'Bronya', 'Cipher', 'Robin', 'Ruan Mei', 'Sparkle', 'The Dahlia', 'Aventurine', 'Gallagher', 'Huohuo', 'Lingsha'],
            'T1': ['Acheron', 'Boothill', 'Feixiao', 'Rappa', 'Jade', 'Jiaoqiu', 'Silver Wolf', 'Tingyun', 'Fugue', 'Luocha'],
            'T1.5': ['Blade', 'Jingliu', 'Yunli', 'Argenti', 'Herta', 'March 7th', 'Topaz', 'TrailblazerHarmony#F', 'TrailblazerHarmony#M', 'Fu Xuan'],
            'T2': ['Jing Yuan', 'Moze', 'Serval', 'Pela'],
            'T3': ['Clara', 'Himeko', 'Bailu', 'Lynx'],
            'T4': ['Dr. Ratio', 'Seele', 'Dan Heng • Imbibitor Lunae', 'Gepard'],
            'T5': ['Arlan', 'Dan Heng', 'Hook', 'Luka', 'Misha', 'Qingque', 'Sushang', 'TrailblazerDestruction#F', 'TrailblazerDestruction#M', 'Xueyi', 'Yanqing', 'Sampo', 'Welt', 'Asta', 'Guinaifen', 'Hanya', 'Yukong', 'Natasha', 'TrailblazerPreservation#F', 'TrailblazerPreservation#M']
        };

        const grouped = {};

        for (const tier in tiers) {
            grouped[tier] = chars.filter(char =>
                tiers[tier].includes(char.name)
            );
        }

        return grouped;
    }

    useEffect(() => {
        const fetchChars = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/characters");
                if (response.status === 200) {
                    const sortedChars = [...response.data].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setChars(sortedChars);

                    const grouped = groupByTier(sortedChars);
                    setTierGroups(grouped);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            }
        };

        fetchChars();
    }, []);

    return (
        <div className="text-white rounded-xl">
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto bg-[#E1D9BC] px-8 py-5 rounded-lg">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-[#30364F] mb-2">
                                Tier List
                            </h1>
                            <p className="text-[#30364F]">
                                See the better and most useful characters in the current patch.
                            </p>
                            <p className="text-[#30364F]">
                                The tiers go from T0 being the best to T5 being the worst.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <table className="table-auto w-full text-[#30364F]">
                                    <thead>
                                        <tr>
                                            <th>Tiers</th>
                                            <th>Characters</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(tierGroups).map(([tier, chars]) => (
                                            <tr key={tier}>
                                                <td className={`bg-${tierColors[tier]} text-white font-bold rounded-xl px-3 py-2`}>
                                                    {tier}
                                                </td>

                                                <td>
                                                    <div className="flex flex-wrap gap-2">
                                                        {chars.map(char => (
                                                            <img 
                                                                key={char.name}
                                                                src={char.miniIcon}
                                                                alt={char.name}
                                                                className="h-20 w-20 rounded-md" 
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default TierList;