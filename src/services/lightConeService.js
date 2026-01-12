import axios from "axios";

const API_URL = 'http://localhost:8080/api';

export const getLightConeByName = async (name) => {
    try {
        const response = await axios.get(`${API_URL}/lightcones/name/${encodeURIComponent(name)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching light cone ${name}:`, error);
        return null;
    }
};

export const getLightConesByNames = async (names) => {
    const promises = names.map(name => getLightConeByName(name));
    const results = await Promise.all(promises);
    return results.filter(cone => cone !== null);
}