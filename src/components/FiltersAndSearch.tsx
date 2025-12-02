import React from "react";
import { Search } from "lucide-react";

type FiltersAndSearchProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedSeason: number | "all";
  setSelectedSeason: (value: number | "all") => void;
  statsTotalSeasons?: number;
  filteredCount: number;
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
  sortMode,
  setSortMode,
}) => {
  return (
    <section className="bg-simpsonCream/95 rounded-2xl sm:rounded-3xl shadow-soft p-4 sm:p-6 border border-white/70 space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
        🔍 Buscar episodios
      </h2>

      {/* Buscador */}
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-soft border border-simpsonSky/40">
        <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar por nombre o sinopsis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Filtro por temporada */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="text-xs font-medium text-slate-600 sm:min-w-fit">
            Filtrar por temporada:
          </label>
          <select
            value={selectedSeason}
            onChange={(e) =>
              setSelectedSeason(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="flex-1 sm:flex-initial text-sm bg-white rounded-xl px-4 py-2.5 border border-simpsonSky/40 shadow-soft focus:outline-none focus:ring-2 focus:ring-simpsonSky/50 focus:border-simpsonSky cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
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

        {/* Selector de orden */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <label className="text-xs font-medium text-slate-600 sm:min-w-fit">
            Ordenar por:
          </label>
          <div className="inline-flex rounded-xl bg-white border border-simpsonSky/40 p-1 shadow-soft">
            <button
              type="button"
              onClick={() => setSortMode("airDate")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                sortMode === "airDate"
                  ? "bg-simpsonSky text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Fecha de emisión
            </button>
            <button
              type="button"
              onClick={() => setSortMode("rating")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                sortMode === "rating"
                  ? "bg-simpsonSky text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Rating
            </button>
          </div>
        </div>

        {/* Contador de episodios */}
        <div className="text-center sm:text-left">
          <span className="text-xs text-slate-500 bg-white/60 px-3 py-1.5 rounded-full border border-simpsonSky/20">
            {filteredCount} episodio{filteredCount === 1 ? "" : "s"} encontrado{filteredCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default FiltersAndSearch;
