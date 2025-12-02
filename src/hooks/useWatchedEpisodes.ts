import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserEpisodes,
  addWatchedEpisode,
  removeWatchedEpisode,
  clearAllWatchedEpisodes,
} from "../services/episodesService";

export const useWatchedEpisodes = () => {
  const { userId, isAuthenticated } = useAuth();
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Cargar episodios desde Firestore cuando el usuario esté autenticado
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setWatchedEpisodes(new Set());
      setLoading(false);
      return;
    }

    const loadEpisodes = async () => {
      try {
        setLoading(true);
        const data = await getUserEpisodes(userId);
        setWatchedEpisodes(new Set(data.watchedEpisodes));
      } catch (error) {
        console.error("Error loading watched episodes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEpisodes();
  }, [userId, isAuthenticated]);

  const toggleWatched = async (episodeId: string) => {
    if (!userId) return;

    const isCurrentlyWatched = watchedEpisodes.has(episodeId);

    // Actualizar UI inmediatamente (optimistic update)
    setWatchedEpisodes((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyWatched) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });

    // Actualizar en Firestore
    try {
      if (isCurrentlyWatched) {
        await removeWatchedEpisode(userId, episodeId);
      } else {
        await addWatchedEpisode(userId, episodeId);
      }
    } catch (error) {
      console.error("Error toggling watched episode:", error);
      // Revertir en caso de error
      setWatchedEpisodes((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyWatched) {
          newSet.add(episodeId);
        } else {
          newSet.delete(episodeId);
        }
        return newSet;
      });
    }
  };

  const isWatched = (episodeId: string) => {
    return watchedEpisodes.has(episodeId);
  };

  const clearAll = async () => {
    if (!userId) return;

    // Guardar el estado anterior por si hay error
    const previousState = new Set(watchedEpisodes);
    setWatchedEpisodes(new Set());

    try {
      await clearAllWatchedEpisodes(userId);
    } catch (error) {
      console.error("Error clearing watched episodes:", error);
      // Revertir en caso de error
      setWatchedEpisodes(previousState);
    }
  };

  return { toggleWatched, isWatched, watchedEpisodes, clearAll, loading };
};
