import { useState, useEffect } from "react";

const STORAGE_KEY = "simpsons-watch-later-episodes";

export const useWatchLaterEpisodes = () => {
  const [watchLaterEpisodes, setWatchLaterEpisodes] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading watch later episodes from localStorage:", error);
    }
    return new Set();
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(watchLaterEpisodes))
      );
    } catch (error) {
      console.error("Error saving watch later episodes to localStorage:", error);
    }
  }, [watchLaterEpisodes]);

  const toggleWatchLater = (episodeId: string) => {
    setWatchLaterEpisodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  const isWatchLater = (episodeId: string) => {
    return watchLaterEpisodes.has(episodeId);
  };

  const clearAll = () => {
    setWatchLaterEpisodes(new Set());
  };

  return { toggleWatchLater, isWatchLater, watchLaterEpisodes, clearAll };
};
