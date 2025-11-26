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
    <section>
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
        📊 Estadísticas generales
      </h2>

      {error && (
        <div className="text-sm text-simpsonRed bg-white/80 border border-simpsonRed/40 rounded-xl px-3 py-2 mb-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total episodios */}
        <div className="bg-white/90 rounded-xl p-4 shadow-soft border border-simpsonSky/40 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-simpsonSky/20 flex items-center justify-center">
              <Tv className="w-6 h-6 text-simpsonSky" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">
                Total episodios
              </p>
              {isLoading ? (
                <div className="h-7 w-16 rounded-md bg-slate-200 animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalEpisodes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Temporadas */}
        <div className="bg-white/90 rounded-xl p-4 shadow-soft border border-simpsonOrange/40 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-simpsonOrange/20 flex items-center justify-center">
              <Layers className="w-6 h-6 text-simpsonOrange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">
                Temporadas
              </p>
              {isLoading ? (
                <div className="h-7 w-10 rounded-md bg-slate-200 animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalSeasons}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rating promedio global */}
        <div className="bg-white/90 rounded-xl p-4 shadow-soft border border-simpsonGreen/40 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-simpsonGreen/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-simpsonGreen fill-simpsonGreen" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-0.5">
                Rating promedio
              </p>
              {loadingEpisodes || !stats?.globalAverageRating ? (
                <div className="h-7 w-12 rounded-md bg-slate-200 animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  {stats.globalAverageRating.toFixed(1)}
                  <span className="text-base font-normal text-slate-500">/10</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
