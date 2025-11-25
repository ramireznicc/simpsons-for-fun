import React from "react";
import { Tv, Layers, Star } from "lucide-react";

export type GlobalStats = {
  totalEpisodes: number;
  totalSeasons: number;
  globalAverageRating?: number;
};

type StatsSectionProps = {
  stats: GlobalStats | null;
  loadingStats: boolean;
  loadingEpisodes: boolean;
  error: string | null;
};

const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  loadingStats,
  loadingEpisodes,
  error,
}) => {
  const isLoading = loadingStats || !stats;

  return (
    <section className="mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
        Estadísticas generales
        <Tv className="w-5 h-5 text-slate-700" />
      </h2>

      {error && (
        <div className="text-sm text-simpsonRed bg-white/80 border border-simpsonRed/40 rounded-xl px-3 py-2 mb-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-sm">
        {/* Total episodios */}
        <div className="bg-white/80 rounded-xl p-3 shadow-soft border border-simpsonSky/40">
          <div className="flex items-center gap-1.5 mb-1">
            <Tv className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
              Total episodios
            </p>
          </div>
          {isLoading ? (
            <div className="mt-1 h-6 w-16 rounded-md bg-slate-200 animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-slate-900">
              {stats.totalEpisodes}
            </p>
          )}
        </div>

        {/* Temporadas */}
        <div className="bg-white/80 rounded-xl p-3 shadow-soft border border-simpsonSky/40">
          <div className="flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
              Temporadas
            </p>
          </div>
          {isLoading ? (
            <div className="mt-1 h-6 w-10 rounded-md bg-slate-200 animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-slate-900">
              {stats.totalSeasons}
            </p>
          )}
        </div>

        {/* Rating promedio global */}
        <div className="bg-white/80 rounded-xl p-3 shadow-soft border border-simpsonSky/40">
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">
              Rating promedio
            </p>
          </div>
          {loadingEpisodes || !stats?.globalAverageRating ? (
            <div className="mt-1 h-6 w-12 rounded-md bg-slate-200 animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-slate-900">
              {stats.globalAverageRating.toFixed(1)}
              <span className="text-sm font-normal text-slate-500">/10</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
