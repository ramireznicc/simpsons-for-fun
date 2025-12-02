import { useState, useEffect } from "react";
import {
  getUserEpisodes,
  setEpisodeRating,
  removeEpisodeRating,
} from "../services/episodesService";
import { useAuth } from "../context/AuthContext";

export const useEpisodeRatings = () => {
  const { userId } = useAuth();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRatings = async () => {
      if (!userId) {
        setRatings({});
        setLoading(false);
        return;
      }

      try {
        const userEpisodes = await getUserEpisodes(userId);
        setRatings(userEpisodes.episodeRatings || {});
      } catch (error) {
        console.error("Error al cargar valoraciones:", error);
        setRatings({});
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [userId]);

  const setRating = async (episodeId: string, rating: number) => {
    if (!userId) return;

    try {
      await setEpisodeRating(userId, episodeId, rating);
      setRatings((prev) => ({ ...prev, [episodeId]: rating }));
    } catch (error) {
      console.error("Error al guardar valoración:", error);
      throw error;
    }
  };

  const removeRating = async (episodeId: string) => {
    if (!userId) return;

    try {
      await removeEpisodeRating(userId, episodeId);
      setRatings((prev) => {
        const newRatings = { ...prev };
        delete newRatings[episodeId];
        return newRatings;
      });
    } catch (error) {
      console.error("Error al eliminar valoración:", error);
      throw error;
    }
  };

  const getRating = (episodeId: string): number | undefined => {
    return ratings[episodeId];
  };

  return {
    ratings,
    loading,
    setRating,
    removeRating,
    getRating,
  };
};
