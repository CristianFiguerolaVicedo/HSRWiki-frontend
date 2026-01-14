import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getRelicSetByName = async (setName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/relics/${encodeURIComponent(setName)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching relic set ${setName}:`, error);
        return null;
    }
};

export const getPlanarSetByName = async (setName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/planars/${encodeURIComponent(setName)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching planar set ${setName}:`, error);
        return null;
    }
};