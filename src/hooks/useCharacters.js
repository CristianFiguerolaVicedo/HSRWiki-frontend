import { useState, useEffect } from "react";
import { fetchJson } from "../services/apiClient";

let cachedCharacters = null;

export const useCharacters = () => {
  const [state, setState] = useState(() => ({
    characters: cachedCharacters || [],
    loading: !cachedCharacters,
    error: null,
  }));

  useEffect(() => {
    if (cachedCharacters) return;

    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchJson("/characters");
        if (!cancelled) {
          cachedCharacters = data;
          setState({ characters: data, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ characters: [], loading: false, error: err });
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return state;
};
