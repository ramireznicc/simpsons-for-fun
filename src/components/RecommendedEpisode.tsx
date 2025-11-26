import React from "react";
import { Star, Shuffle } from "lucide-react";
import type { Episode } from "../types";

type RecommendedEpisodeProps = {
  episode: Episode | null;
  onEpisodeClick?: (episode: Episode) => void;
  onRandomClick: () => void;
  randomDisabled: boolean;
};

const RecommendedEpisode: React.FC<RecommendedEpisodeProps> = ({
  episode,
  onEpisodeClick,
  onRandomClick,
  randomDisabled,
}) => {
  if (!episode) return null;

  return (
    <section className="bg-simpsonCream/95 rounded-2xl sm:rounded-3xl shadow-soft p-4 sm:p-6 border border-white/70 space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
        ⭐ Episodio recomendado
      </h2>

      <div
        key={episode.id}
        onClick={() => onEpisodeClick?.(episode)}
        className="bg-gradient-to-br from-simpsonYellow/5 to-simpsonSky/5 rounded-xl shadow-soft border border-simpsonYellow/30 p-3 flex gap-3 cursor-pointer hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-out animate-episode-change"
      >
        {episode.imageUrl && (
          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-simpsonSky/20">
            <img
              src={episode.imageUrl}
              alt={episode.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 line-clamp-2 mb-2">
              {episode.name}
            </h3>
            <span className="inline-flex text-xs font-semibold text-slate-700 bg-simpsonYellow/90 px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm">
              T{episode.season.toString().padStart(2, "0")} · E
              {episode.episode.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  episode.rating >= 8
                    ? "bg-simpsonGreen/15 text-simpsonGreen"
                    : episode.rating >= 7
                    ? "bg-simpsonOrange/10 text-simpsonOrange"
                    : "bg-simpsonRed/10 text-simpsonRed"
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                {episode.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">
                ({episode.voteCount.toLocaleString("es-ES")} votos)
              </span>
            </div>
            {episode.airDate && (
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {episode.airDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botón random */}
      <button
        type="button"
        onClick={onRandomClick}
        disabled={randomDisabled}
        className="w-full flex items-center justify-center gap-2 bg-simpsonOrange text-white text-base font-semibold px-6 py-3.5 rounded-xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-simpsonOrange/90 hover:shadow-xl active:scale-[0.98] transition-all duration-150"
      >
        <Shuffle className="w-5 h-5" />
        <span>Sorpréndeme con otro capítulo</span>
      </button>
    </section>
  );
};

export default RecommendedEpisode;
