import { useState, useEffect } from "react";

const STORAGE_KEY = "simpsons-watched-episodes";

export const useWatchedEpisodes = () => {
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading watched episodes from localStorage:", error);
    }
    return new Set();
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(watchedEpisodes))
      );
    } catch (error) {
      console.error("Error saving watched episodes to localStorage:", error);
    }
  }, [watchedEpisodes]);

  const toggleWatched = (episodeId: string) => {
    setWatchedEpisodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  const isWatched = (episodeId: string) => {
    return watchedEpisodes.has(episodeId);
  };

  const clearAll = () => {
    setWatchedEpisodes(new Set());
  };

  return { toggleWatched, isWatched, watchedEpisodes, clearAll };
};
