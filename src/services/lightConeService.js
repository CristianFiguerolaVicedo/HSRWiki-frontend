import apiClient from "./apiClient";

export const getLightConeByName = async (name) => {
    try {
        const response = await apiClient.get(`/lightcones/name/${encodeURIComponent(name)}`);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getLightConesByNames = async (names) => {
    const promises = names.map(name => getLightConeByName(name));
    const results = await Promise.all(promises);
    return results.filter(cone => cone !== null);
};
