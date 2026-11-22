import { fetchJson } from "./apiClient";

export const getLightConeByName = async (name) => {
    try {
        return await fetchJson(`/lightcones/name/${encodeURIComponent(name)}`);
    } catch (error) {
        return null;
    }
};

export const getLightConesByNames = async (names) => {
    const promises = names.map(name => getLightConeByName(name));
    const results = await Promise.all(promises);
    return results.filter(cone => cone !== null);
};
