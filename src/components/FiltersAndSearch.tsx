import React from "react";
import type { Episode } from "../types";
import { Shuffle, Search, Star } from "lucide-react";

type FiltersAndSearchProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedSeason: number | "all";
  setSelectedSeason: (value: number | "all") => void;
  statsTotalSeasons?: number;
  filteredCount: number;
  onRandomClick: () => void;
  randomDisabled: boolean;
  currentEpisode: Episode | null;
  sortMode: "rating" | "airDate";
  setSortMode: (mode: "rating" | "airDate") => void;
};

const FiltersAndSearch: React.FC<FiltersAndSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSeason,
  setSelectedSeason,
  statsTotalSeasons,
  filteredCount,
  onRandomClick,
  randomDisabled,
  currentEpisode,
  sortMode,
  setSortMode,
}) => {
  return (
    <section className="mt-4 mb-4 space-y-3">
      {/* Episodio destacado */}
      {currentEpisode && (
        <div className="bg-white rounded-2xl shadow-soft border border-simpsonSky/40 p-3 sm:p-4 flex gap-3 sm:gap-4 transition-all duration-200 ease-out animate-[fadeInUp_0.2s_ease-out]">
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
              {currentEpisode.overview || "Sinopsis no disponible en español."}
            </p>

            <div className="flex items-center justify-between mt-1 gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    currentEpisode.rating >= 8
                      ? "bg-simpsonGreen/15 text-simpsonGreen"
                      : currentEpisode.rating >= 7
                      ? "bg-simpsonOrange/10 text-simpsonOrange"
                      : "bg-simpsonRed/10 text-simpsonRed"
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  {currentEpisode.rating.toFixed(1)}
                </span>
                <span className="text-[0.65rem] text-slate-500">
                  ({currentEpisode.voteCount.toLocaleString("es-ES")} votos)
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
          <Search className="w-4 h-4 text-slate-400" />
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
          onClick={onRandomClick}
          disabled={randomDisabled}
          className="flex items-center justify-center gap-2 bg-simpsonOrange text-white text-sm font-semibold px-4 py-2 rounded-full shadow-soft disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.96] transition-all duration-150"
        >
          <span>Capítulo random</span>
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      {/* Filtro por temporada + selector de orden */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2">
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
            {statsTotalSeasons &&
              Array.from({ length: statsTotalSeasons }, (_, i) => i + 1).map(
                (season) => (
                  <option key={season} value={season}>
                    Temporada {season}
                  </option>
                )
              )}
          </select>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="hidden sm:inline text-slate-500">Ordenar por:</span>
          <div className="inline-flex rounded-full bg-white/80 border border-simpsonSky/30 p-0.5 text-[0.7rem]">
            <button
              type="button"
              onClick={() => setSortMode("rating")}
              className={`px-2 py-0.5 rounded-full transition text-xs ${
                sortMode === "rating"
                  ? "bg-simpsonSky text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Rating
            </button>
            <button
              type="button"
              onClick={() => setSortMode("airDate")}
              className={`px-2 py-0.5 rounded-full transition text-xs ${
                sortMode === "airDate"
                  ? "bg-simpsonSky text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Emisión
            </button>
          </div>
        </div>

        <span className="text-[0.7rem] text-slate-500 sm:ml-2">
          {filteredCount} episodio
          {filteredCount === 1 ? "" : "s"} encontrados
        </span>
      </div>
    </section>
  );
};

export default FiltersAndSearch;
