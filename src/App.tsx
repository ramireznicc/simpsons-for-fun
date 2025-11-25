import React, { useEffect, useState } from "react";
import {
  fetchShowDetails,
  fetchSeasonEpisodes,
  mapTMDBEpisodeToEpisode,
} from "./api/tmdb";
import type { Episode } from "./types";

type GlobalStats = {
  totalEpisodes: number;
  totalSeasons: number;
  bestEpisode?: Episode;
  worstEpisode?: Episode;
  bestSeason?: number;
};

const App: React.FC = () => {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para búsqueda, filtro y episodio destacado
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<number | "all">("all");
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

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
        const episodesWithScore = allEpisodes.map((ep) => {
          const v = ep.voteCount;
          const R = ep.rating;
          const score = (v / (v + m)) * R + (m / (v + m)) * C;
          return { ...ep, bayesianScore: score };
        });

        // Ordenar por score bayesiano desc
        const sortedByScore = [...episodesWithScore].sort(
          (a, b) => b.bayesianScore - a.bayesianScore
        );

        // Calcular mejor/peor episodio (por score)
        const bestEpisode = sortedByScore[0];
        const worstEpisode = sortedByScore[sortedByScore.length - 1];

        // Agrupar por temporada para mejor temporada (sigue siendo por promedio simple de rating)
        const seasonGroups = new Map<number, Episode[]>();
        for (const ep of allEpisodes) {
          if (!seasonGroups.has(ep.season)) {
            seasonGroups.set(ep.season, []);
          }
          seasonGroups.get(ep.season)!.push(ep);
        }

        let bestSeason: number | undefined;
        let bestSeasonAvg = -Infinity;

        for (const [season, eps] of seasonGroups.entries()) {
          const avg = eps.reduce((sum, ep) => sum + ep.rating, 0) / eps.length;
          if (avg > bestSeasonAvg) {
            bestSeasonAvg = avg;
            bestSeason = season;
          }
        }

        // Episodio destacado por defecto = mejor episodio
        setCurrentEpisode(bestEpisode || null);

        setEpisodes(sortedByScore);
        setStats((prev) => ({
          ...(prev || {
            totalEpisodes,
            totalSeasons: show.number_of_seasons,
          }),
          bestEpisode,
          worstEpisode,
          bestSeason,
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

  // Lista filtrada según búsqueda y temporada
  const filteredEpisodes = episodes.filter((ep) => {
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

  // Función para seleccionar un capítulo random de la lista filtrada
  const pickRandomEpisode = () => {
    if (filteredEpisodes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredEpisodes.length);
    setCurrentEpisode(filteredEpisodes[randomIndex]);
    // Opcional: hacer scroll arriba al destacar el episodio
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-simpsonSky flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-white/30 bg-simpsonYellow/90 backdrop-blur-sm shadow-soft">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-simpsonSky flex items-center justify-center shadow-soft">
              <span className="text-2xl">🍩</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Simpsons Episode Finder
              </h1>
              <p className="text-xs sm:text-sm text-slate-800/80">
                Descubre, explora y encuentra tu próximo capítulo de Springfield
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-900/80">
            <span>Modo claro</span>
            <div className="w-10 h-5 rounded-full bg-white/70 flex items-center px-1">
              <div className="w-4 h-4 rounded-full bg-simpsonOrange shadow-soft" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="bg-simpsonCream/95 rounded-2xl sm:rounded-3xl shadow-soft p-4 sm:p-6 lg:p-8 border border-white/70">
            {/* Sección de stats */}
            <section className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                Estadísticas generales
                <span className="text-xl">📊</span>
              </h2>

              {error && (
                <div className="text-sm text-simpsonRed bg-white/80 border border-simpsonRed/40 rounded-xl px-3 py-2 mb-3">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-white/80 rounded-xl p-3 shadow-soft border border-simpsonSky/40">
                  <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
                    Total episodios
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {loadingStats || !stats ? "…" : stats.totalEpisodes}
                  </p>
                </div>
                <div className="bg-white/80 rounded-xl p-3 shadow-soft border border-simpsonSky/40">
                  <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
                    Temporadas
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {loadingStats || !stats ? "…" : stats.totalSeasons}
                  </p>
                </div>

                <div className="bg-white/80 rounded-xl p-3 shadow-soft border border-simpsonSky/40">
                  <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
                    Mejor episodio
                  </p>
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {loadingEpisodes || !stats?.bestEpisode
                      ? "Cargando…"
                      : `${stats.bestEpisode.name}`}
                  </p>
                  {stats?.bestEpisode && (
                    <p className="text-[0.7rem] text-simpsonGreen mt-1">
                      ⭐ {stats.bestEpisode.rating.toFixed(1)}
                    </p>
                  )}
                </div>

                <div className="bg-white/80 rounded-xl p-3 shadow-soft border border-simpsonSky/40">
                  <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
                    Temporada mejor valorada
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {loadingEpisodes || !stats?.bestSeason
                      ? "…"
                      : `T${stats.bestSeason}`}
                  </p>
                </div>
              </div>
            </section>

            {/* Episodio destacado + buscador + filtros + random */}
            <section className="mt-4 mb-4 space-y-3">
              {/* Episodio destacado (incluye el random que elijamos) */}
              {currentEpisode && (
                <div className="bg-white rounded-2xl shadow-soft border border-simpsonSky/40 p-3 sm:p-4 flex gap-3 sm:gap-4">
                  {currentEpisode.imageUrl && (
                    <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-simpsonSky/20">
                      <img
                        src={currentEpisode.imageUrl}
                        alt={currentEpisode.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
                          Episodio destacado
                        </p>
                        <h2 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                          {currentEpisode.name}
                        </h2>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 bg-simpsonYellow/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                        T{currentEpisode.season.toString().padStart(2, "0")} · E
                        {currentEpisode.episode.toString().padStart(2, "0")}
                      </span>
                    </div>

                    <p className="text-[0.75rem] text-slate-600 line-clamp-3">
                      {currentEpisode.overview ||
                        "Sinopsis no disponible en español."}
                    </p>

                    <div className="flex items-center justify-between mt-1 gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            currentEpisode.rating >= 8
                              ? "bg-simpsonGreen/15 text-simpsonGreen"
                              : currentEpisode.rating >= 7
                              ? "bg-simpsonOrange/10 text-simpsonOrange"
                              : "bg-simpsonRed/10 text-simpsonRed"
                          }`}
                        >
                          ⭐ {currentEpisode.rating.toFixed(1)}
                        </span>
                        <span className="text-[0.65rem] text-slate-500">
                          ({currentEpisode.voteCount.toLocaleString("es-ES")}{" "}
                          votos)
                        </span>
                      </div>
                      {currentEpisode.airDate && (
                        <span className="text-[0.65rem] text-slate-500 whitespace-nowrap">
                          {currentEpisode.airDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Buscador + botón random */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-soft border border-simpsonSky/40">
                  <span className="text-slate-400 text-lg">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o sinopsis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={pickRandomEpisode}
                  disabled={filteredEpisodes.length === 0}
                  className="flex items-center justify-center gap-2 bg-simpsonOrange text-white text-sm font-semibold px-4 py-2 rounded-full shadow-soft disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] transition-transform"
                >
                  <span>Capítulo random</span>
                  <span>🎲</span>
                </button>
              </div>

              {/* Filtro por temporada (simple y mobile-first) */}
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="hidden sm:inline">Filtrar por temporada:</span>
                <select
                  value={selectedSeason}
                  onChange={(e) =>
                    setSelectedSeason(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    )
                  }
                  className="text-xs bg-white rounded-full px-3 py-1 border border-simpsonSky/40 shadow-soft focus:outline-none"
                >
                  <option value="all">Todas las temporadas</option>
                  {stats &&
                    Array.from(
                      {
                        length: stats.totalSeasons,
                      },
                      (_, i) => i + 1
                    ).map((season) => (
                      <option key={season} value={season}>
                        Temporada {season}
                      </option>
                    ))}
                </select>

                <span className="ml-auto text-[0.7rem] text-slate-500">
                  {filteredEpisodes.length} episodio
                  {filteredEpisodes.length === 1 ? "" : "s"} encontrados
                </span>
              </div>
            </section>

            {/* Lista de episodios */}
            <section className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  Episodios (ordenados por rating)
                </h2>
                <p className="text-[0.7rem] text-slate-500">
                  Vista mobile‑first
                </p>
              </div>

              {loadingEpisodes && (
                <div className="text-sm text-slate-600 animate-pulse">
                  Cargando episodios desde TMDB…
                </div>
              )}

              {!loadingEpisodes && filteredEpisodes.length === 0 && !error && (
                <p className="text-sm text-slate-600">
                  No se encontraron episodios. Revisa tu conexión o la API key.
                </p>
              )}

              {!loadingEpisodes && filteredEpisodes.length > 0 && (
                <ul className="space-y-3 max-h-[70vh] overflow-y-auto -mx-2 px-2">
                  {filteredEpisodes.slice(0, 50).map((ep) => (
                    <li
                      key={ep.id}
                      className="bg-white rounded-2xl shadow-soft border border-simpsonSky/30 p-3 flex gap-3"
                    >
                      {/* Imagen en móvil pequeña al lado */}
                      {ep.imageUrl && (
                        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-simpsonSky/20">
                          <img
                            src={ep.imageUrl}
                            alt={ep.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {ep.name}
                          </h3>
                          <span className="text-xs font-semibold text-slate-700 bg-simpsonYellow/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                            T{ep.season.toString().padStart(2, "0")} · E
                            {ep.episode.toString().padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-[0.7rem] text-slate-600 line-clamp-2">
                          {ep.overview || "Sinopsis no disponible en español."}
                        </p>
                        <div className="flex items-center justify-between mt-2 gap-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                ep.rating >= 8
                                  ? "bg-simpsonGreen/15 text-simpsonGreen"
                                  : ep.rating >= 7
                                  ? "bg-simpsonOrange/10 text-simpsonOrange"
                                  : "bg-simpsonRed/10 text-simpsonRed"
                              }`}
                            >
                              ⭐ {ep.rating.toFixed(1)}
                            </span>
                            <span className="text-[0.65rem] text-slate-500">
                              ({ep.voteCount.toLocaleString("es-ES")} votos)
                            </span>
                          </div>

                          {ep.airDate && (
                            <span className="text-[0.65rem] text-slate-500 whitespace-nowrap">
                              {ep.airDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
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
