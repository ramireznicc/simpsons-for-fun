import type { Episode } from "../types";

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w780"; // tamaño medio
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

export const SIMPSONS_TV_ID = 456; // The Simpsons

if (!TMDB_API_KEY) {
  console.warn(
    "⚠️ VITE_TMDB_API_KEY no está definida. Configura tu API key de TMDB en el archivo .env"
  );
}

export type TMDBEpisode = {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  season_number: number;
  episode_number: number;
  air_date: string | null;
};

type TMDBSeason = {
  id: number;
  season_number: number;
  episode_count: number;
};

type TMDBShowDetails = {
  id: number;
  name: string;
  number_of_seasons: number;
  seasons: TMDBSeason[];
};

export async function fetchShowDetails(): Promise<TMDBShowDetails> {
  const res = await fetch(
    `${TMDB_API_BASE}/tv/${SIMPSONS_TV_ID}?api_key=${TMDB_API_KEY}&language=es-ES`
  );

  if (!res.ok) {
    throw new Error("Error al obtener detalles de la serie desde TMDB");
  }

  return res.json();
}

export async function fetchSeasonEpisodes(
  seasonNumber: number
): Promise<TMDBEpisode[]> {
  const res = await fetch(
    `${TMDB_API_BASE}/tv/${SIMPSONS_TV_ID}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=es-ES`
  );

  if (!res.ok) {
    throw new Error(
      `Error al obtener los episodios de la temporada ${seasonNumber}`
    );
  }

  const data = await res.json();
  return data.episodes as TMDBEpisode[];
}

export function mapTMDBEpisodeToEpisode(ep: TMDBEpisode): Episode {
  return {
    id: ep.id,
    name: ep.name,
    overview: ep.overview,
    season: ep.season_number,
    episode: ep.episode_number,
    airDate: ep.air_date,
    rating: ep.vote_average,
    voteCount: ep.vote_count,
    imageUrl: ep.still_path ? `${TMDB_IMAGE_BASE}${ep.still_path}` : null,
  };
}
