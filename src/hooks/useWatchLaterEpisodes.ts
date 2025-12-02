import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserEpisodes,
  addWatchLaterEpisode,
  removeWatchLaterEpisode,
  clearAllWatchLaterEpisodes,
} from "../services/episodesService";

export const useWatchLaterEpisodes = () => {
  const { userId, isAuthenticated } = useAuth();
  const [watchLaterEpisodes, setWatchLaterEpisodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Cargar episodios desde Firestore cuando el usuario esté autenticado
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setWatchLaterEpisodes(new Set());
      setLoading(false);
      return;
    }

    const loadEpisodes = async () => {
      try {
        setLoading(true);
        const data = await getUserEpisodes(userId);
        setWatchLaterEpisodes(new Set(data.watchLaterEpisodes));
      } catch (error) {
        console.error("Error loading watch later episodes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEpisodes();
  }, [userId, isAuthenticated]);

  const toggleWatchLater = async (episodeId: string) => {
    if (!userId) return;

    const isCurrentlyWatchLater = watchLaterEpisodes.has(episodeId);

    // Actualizar UI inmediatamente (optimistic update)
    setWatchLaterEpisodes((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyWatchLater) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });

    // Actualizar en Firestore
    try {
      if (isCurrentlyWatchLater) {
        await removeWatchLaterEpisode(userId, episodeId);
      } else {
        await addWatchLaterEpisode(userId, episodeId);
      }
    } catch (error) {
      console.error("Error toggling watch later episode:", error);
      // Revertir en caso de error
      setWatchLaterEpisodes((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyWatchLater) {
          newSet.add(episodeId);
        } else {
          newSet.delete(episodeId);
        }
        return newSet;
      });
    }
  };

  const isWatchLater = (episodeId: string) => {
    return watchLaterEpisodes.has(episodeId);
  };

  const clearAll = async () => {
    if (!userId) return;

    // Guardar el estado anterior por si hay error
    const previousState = new Set(watchLaterEpisodes);
    setWatchLaterEpisodes(new Set());

    try {
      await clearAllWatchLaterEpisodes(userId);
    } catch (error) {
      console.error("Error clearing watch later episodes:", error);
      // Revertir en caso de error
      setWatchLaterEpisodes(previousState);
    }
  };

  return { toggleWatchLater, isWatchLater, watchLaterEpisodes, clearAll, loading };
};
