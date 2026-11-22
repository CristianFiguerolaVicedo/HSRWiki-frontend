import { fetchJson } from "./apiClient";

export const getRelicSetByName = async (setName) => {
    try {
        return await fetchJson(`/relics/${encodeURIComponent(setName)}`);
    } catch (error) {
        return null;
    }
};

export const getPlanarSetByName = async (setName) => {
    try {
        return await fetchJson(`/relics/${encodeURIComponent(setName)}`);
    } catch (error) {
        return null;
    }
};
