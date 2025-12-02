import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface UserEpisodes {
  watchedEpisodes: string[];
  watchLaterEpisodes: string[];
  episodeRatings?: Record<string, number>; // episodeId -> rating (1-10 con intervalos de 0.5)
}

/**
 * Obtiene los episodios de un usuario (vistos y para ver después)
 */
export const getUserEpisodes = async (
  userId: string
): Promise<UserEpisodes> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        watchedEpisodes: data.watchedEpisodes || [],
        watchLaterEpisodes: data.watchLaterEpisodes || [],
        episodeRatings: data.episodeRatings || {},
      };
    }

    // Si no existe el documento, crear uno vacío
    await setDoc(userDocRef, {
      watchedEpisodes: [],
      watchLaterEpisodes: [],
      episodeRatings: {},
    });

    return {
      watchedEpisodes: [],
      watchLaterEpisodes: [],
      episodeRatings: {},
    };
  } catch (error: any) {
    console.error("Error al obtener episodios del usuario:", error);
    throw new Error(`Error al cargar episodios: ${error.message}`);
  }
};

/**
 * Agrega un episodio a la lista de vistos
 */
export const addWatchedEpisode = async (
  userId: string,
  episodeId: string
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      watchedEpisodes: arrayUnion(episodeId),
    });
  } catch (error: any) {
    console.error("Error al agregar episodio visto:", error);
    throw new Error(`Error al marcar episodio como visto: ${error.message}`);
  }
};

/**
 * Elimina un episodio de la lista de vistos
 */
export const removeWatchedEpisode = async (
  userId: string,
  episodeId: string
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      watchedEpisodes: arrayRemove(episodeId),
    });
  } catch (error: any) {
    console.error("Error al quitar episodio visto:", error);
    throw new Error(`Error al desmarcar episodio: ${error.message}`);
  }
};

/**
 * Agrega un episodio a la lista de ver después
 */
export const addWatchLaterEpisode = async (
  userId: string,
  episodeId: string
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      watchLaterEpisodes: arrayUnion(episodeId),
    });
  } catch (error: any) {
    console.error("Error al agregar episodio para ver después:", error);
    throw new Error(`Error al guardar episodio: ${error.message}`);
  }
};

/**
 * Elimina un episodio de la lista de ver después
 */
export const removeWatchLaterEpisode = async (
  userId: string,
  episodeId: string
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      watchLaterEpisodes: arrayRemove(episodeId),
    });
  } catch (error: any) {
    console.error("Error al quitar episodio de ver después:", error);
    throw new Error(`Error al quitar episodio: ${error.message}`);
  }
};

/**
 * Limpia todos los episodios vistos de un usuario
 */
export const clearAllWatchedEpisodes = async (
  userId: string
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      watchedEpisodes: [],
    });
  } catch (error: any) {
    console.error("Error al limpiar episodios vistos:", error);
    throw new Error(`Error al limpiar episodios: ${error.message}`);
  }
};

/**
 * Limpia todos los episodios para ver después de un usuario
 */
export const clearAllWatchLaterEpisodes = async (
  userId: string
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      watchLaterEpisodes: [],
    });
  } catch (error: any) {
    console.error("Error al limpiar episodios para ver después:", error);
    throw new Error(`Error al limpiar episodios: ${error.message}`);
  }
};

/**
 * Establece o actualiza la valoración de un episodio (1-10 con intervalos de 0.5)
 */
export const setEpisodeRating = async (
  userId: string,
  episodeId: string,
  rating: number
): Promise<void> => {
  try {
    // Validar que el rating esté en el rango correcto
    if (rating < 1 || rating > 10 || (rating * 2) % 1 !== 0) {
      throw new Error("La valoración debe estar entre 1 y 10 con intervalos de 0.5");
    }

    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      [`episodeRatings.${episodeId}`]: rating,
    });
  } catch (error: any) {
    console.error("Error al guardar valoración:", error);
    throw new Error(`Error al guardar valoración: ${error.message}`);
  }
};

/**
 * Elimina la valoración de un episodio
 */
export const removeEpisodeRating = async (
  userId: string,
  episodeId: string
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);

    // Obtener el documento actual
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      const ratings = data.episodeRatings || {};

      // Eliminar la valoración específica
      delete ratings[episodeId];

      // Actualizar el documento
      await updateDoc(userDocRef, {
        episodeRatings: ratings,
      });
    }
  } catch (error: any) {
    console.error("Error al eliminar valoración:", error);
    throw new Error(`Error al eliminar valoración: ${error.message}`);
  }
};
