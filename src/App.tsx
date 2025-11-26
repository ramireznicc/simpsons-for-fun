import React, { useEffect, useState } from "react";
import {
  fetchShowDetails,
  fetchSeasonEpisodes,
  mapTMDBEpisodeToEpisode,
} from "./api/tmdb";
import type { Episode } from "./types";
import { Tv } from "lucide-react";

// Componentes
import StatsSection, { type GlobalStats } from "./components/StatsSection";
import RecommendedEpisode from "./components/RecommendedEpisode";
import FiltersAndSearch from "./components/FiltersAndSearch";
import EpisodeList from "./components/EpisodeList";
import EpisodeDetailModal from "./components/EpisodeDetailModal";
import WatchedDrawer from "./components/WatchedDrawer";

// Hooks
import { useWatchedEpisodes } from "./hooks/useWatchedEpisodes";
import { useWatchLaterEpisodes } from "./hooks/useWatchLaterEpisodes";

// Tipo extendido con bayesianScore
type EpisodeWithScore = Episode & {
  bayesianScore: number;
};

const App: React.FC = () => {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeWithScore[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para búsqueda, filtro, orden y episodios destacados
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<number | "all">("all");
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeWithScore | null>(
    null
  );
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [sortMode, setSortMode] = useState<"rating" | "airDate">("airDate");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hook para episodios vistos
  const { toggleWatched, isWatched, watchedEpisodes, clearAll } =
    useWatchedEpisodes();

  // Hook para episodios para ver después
  const {
    toggleWatchLater,
    isWatchLater,
    watchLaterEpisodes,
    clearAll: clearAllWatchLater,
  } = useWatchLaterEpisodes();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingStats(true);
        setLoadingEpisodes(true);
        setError(null);

        const show = await fetchShowDetails();

        // Stats básicos
        let totalEpisodes = 0;
        const seasonNumbers: number[] = [];
        for (const season of show.seasons) {
          if (season.season_number === 0) continue; // ignorar specials
          totalEpisodes += season.episode_count;
          seasonNumbers.push(season.season_number);
        }

        setStats((prev) => ({
          ...(prev || {}),
          totalEpisodes,
          totalSeasons: show.number_of_seasons,
        }));

        setLoadingStats(false);

        // Cargar episodios de todas las temporadas (en paralelo)
        const seasonPromises = seasonNumbers.map((sn) =>
          fetchSeasonEpisodes(sn)
        );
        const seasonsEpisodes = await Promise.all(seasonPromises);

        const allEpisodes = seasonsEpisodes.flat().map(mapTMDBEpisodeToEpisode);

        // Calcular rating medio global C
        const totalRating = allEpisodes.reduce((sum, ep) => sum + ep.rating, 0);
        const C = totalRating / allEpisodes.length || 0;

        // Umbral de votos m (ajustable)
        const m = 100;

        // Score bayesiano por episodio
        const episodesWithScore: EpisodeWithScore[] = allEpisodes.map((ep) => {
          const v = ep.voteCount;
          const R = ep.rating;
          const score = (v / (v + m)) * R + (m / (v + m)) * C;
          return { ...ep, bayesianScore: score };
        });

        // Ordenar por score bayesiano desc
        const sortedByScore = [...episodesWithScore].sort(
          (a, b) => b.bayesianScore - a.bayesianScore
        );

        // Rating promedio global
        const globalAverageRating = C;

        // Episodio destacado por defecto = mejor episodio según score
        const bestEpisode = sortedByScore[0];
        setCurrentEpisode(bestEpisode || null);

        setEpisodes(sortedByScore);
        setStats((prev) => ({
          ...(prev || {
            totalEpisodes,
            totalSeasons: show.number_of_seasons,
          }),
          globalAverageRating,
        }));
      } catch (err) {
        console.error(err);
        const message =
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los datos desde TMDB";
        setError(message);
      } finally {
        setLoadingEpisodes(false);
      }
    };

    loadData();
  }, []);

  // Episodios filtrados y ordenados según modo
  const filteredAndSortedEpisodes = React.useMemo(() => {
    const filtered = episodes.filter((ep) => {
      const matchesSeason =
        selectedSeason === "all" ? true : ep.season === selectedSeason;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0
          ? true
          : ep.name.toLowerCase().includes(q) ||
            ep.overview.toLowerCase().includes(q);

      return matchesSeason && matchesSearch;
    });

    if (sortMode === "rating") {
      return [...filtered].sort((a, b) => b.bayesianScore - a.bayesianScore);
    }

    // Orden por fecha de emisión (ascendente)
    return [...filtered].sort((a, b) => {
      const da = a.airDate;
      const db = b.airDate;

      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;

      // Convertir DD/MM/YYYY a Date para comparar correctamente
      const [dayA, monthA, yearA] = da.split("/").map(Number);
      const [dayB, monthB, yearB] = db.split("/").map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateA.getTime() - dateB.getTime();
    });
  }, [episodes, selectedSeason, searchQuery, sortMode]);

  // Función para seleccionar un capítulo random de la lista filtrada
  const pickRandomEpisode = () => {
    if (filteredAndSortedEpisodes.length === 0) return;
    const randomIndex = Math.floor(
      Math.random() * filteredAndSortedEpisodes.length
    );
    setCurrentEpisode(filteredAndSortedEpisodes[randomIndex]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Obtener episodios vistos completos
  const watchedEpisodesList = episodes.filter((ep) =>
    watchedEpisodes.has(`S${ep.season}E${ep.episode}`)
  );

  // Obtener episodios para ver después
  const watchLaterEpisodesList = episodes.filter((ep) =>
    watchLaterEpisodes.has(`S${ep.season}E${ep.episode}`)
  );

  return (
    <div className="min-h-screen bg-simpsonSky flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-white/30 bg-simpsonYellow/90 backdrop-blur-sm shadow-soft">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between gap-4">
          <h1 className="font-rock tracking-wide text-slate-900 drop-shadow-sm flex items-center gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl md:text-5xl">🍩</span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="text-2xl sm:text-3xl md:text-4xl">Simpsons</span>
              <span className="text-base sm:text-lg md:text-xl text-slate-700 font-normal">(for fun)</span>
            </div>
          </h1>

          {/* Botón para abrir drawer */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-simpsonSky text-white font-semibold shadow-lg hover:bg-simpsonSky/90 hover:shadow-xl active:scale-95 transition-all group flex-shrink-0"
          >
            <Tv className="w-5 h-5 sm:w-6 sm:h-6" />
            {watchedEpisodes.size > 0 && (
              <span className="min-w-[1.5rem] h-6 flex items-center justify-center px-1.5 rounded-full bg-simpsonOrange text-white text-xs font-bold shadow-md group-hover:scale-110 transition-transform">
                {watchedEpisodes.size}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
          {/* Tarjeta 1: Estadísticas */}
          <div className="bg-simpsonCream/95 rounded-2xl sm:rounded-3xl shadow-soft p-4 sm:p-6 border border-white/70">
            <StatsSection
              stats={stats}
              loadingStats={loadingStats}
              loadingEpisodes={loadingEpisodes}
              error={error}
            />
          </div>

          {/* Tarjeta 2: Episodio recomendado */}
          <RecommendedEpisode
            episode={currentEpisode}
            onEpisodeClick={(episode) => setSelectedEpisode(episode)}
            onRandomClick={pickRandomEpisode}
            randomDisabled={filteredAndSortedEpisodes.length === 0}
          />

          {/* Tarjeta 3: Búsqueda, filtros y lista */}
          <FiltersAndSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            statsTotalSeasons={stats?.totalSeasons}
            filteredCount={filteredAndSortedEpisodes.length}
            sortMode={sortMode}
            setSortMode={setSortMode}
          />

          <div className="bg-simpsonCream/95 rounded-2xl sm:rounded-3xl shadow-soft p-4 sm:p-6 border border-white/70">
            <EpisodeList
              episodes={filteredAndSortedEpisodes}
              loading={loadingEpisodes}
              error={error}
              onEpisodeClick={(episode) => setSelectedEpisode(episode)}
            />
          </div>
        </div>

        {/* Modal de detalle */}
        {selectedEpisode && (
          <EpisodeDetailModal
            episode={selectedEpisode}
            onClose={() => setSelectedEpisode(null)}
            isWatched={isWatched(
              `S${selectedEpisode.season}E${selectedEpisode.episode}`
            )}
            onToggleWatched={() =>
              toggleWatched(`S${selectedEpisode.season}E${selectedEpisode.episode}`)
            }
            isWatchLater={isWatchLater(
              `S${selectedEpisode.season}E${selectedEpisode.episode}`
            )}
            onToggleWatchLater={() =>
              toggleWatchLater(
                `S${selectedEpisode.season}E${selectedEpisode.episode}`
              )
            }
          />
        )}

        {/* Drawer de episodios vistos */}
        <WatchedDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          watchedEpisodes={watchedEpisodesList}
          watchLaterEpisodes={watchLaterEpisodesList}
          onEpisodeClick={(episode) => {
            setSelectedEpisode(episode);
            setIsDrawerOpen(false);
          }}
          onToggleWatched={toggleWatched}
          onToggleWatchLater={toggleWatchLater}
          onClearAll={clearAll}
          onClearAllWatchLater={clearAllWatchLater}
          totalEpisodes={episodes.length}
        />
      </main>

      {/* Footer */}
      <footer className="w-full py-4 mt-2 text-center text-xs text-white/90">
        <p>
          Hecho con cariño por <span className="font-semibold">Nico</span>.
          Datos proporcionados por{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/70 hover:decoration-white"
          >
            TMDB
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default App;
