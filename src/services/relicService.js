import apiClient from "./apiClient";

export const getRelicSetByName = async (setName) => {
    try {
        const response = await apiClient.get(`/relics/${encodeURIComponent(setName)}`);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getPlanarSetByName = async (setName) => {
    try {
        const response = await apiClient.get(`/planars/${encodeURIComponent(setName)}`);
        return response.data;
    } catch (error) {
        return null;
    }
};
