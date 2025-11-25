import React from "react";
import { Star } from "lucide-react";
import type { Episode } from "../types";

type EpisodeCardProps = {
  episode: Episode;
  onClick?: (episode: Episode) => void;
};

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onClick }) => {
  return (
    <li
      className="bg-white rounded-2xl shadow-soft border border-simpsonSky/30 p-3 flex gap-3 cursor-pointer hover:shadow-lg hover:-translate-y-[1px] active:scale-[0.99] transition-all duration-150"
      onClick={() => onClick?.(episode)}
    >
      {episode.imageUrl && (
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-simpsonSky/20">
          <img
            src={episode.imageUrl}
            alt={episode.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-slate-900 truncate">
            {episode.name}
          </h3>
          <span className="text-xs font-semibold text-slate-700 bg-simpsonYellow/80 px-2 py-0.5 rounded-full whitespace-nowrap">
            T{episode.season.toString().padStart(2, "0")} · E
            {episode.episode.toString().padStart(2, "0")}
          </span>
        </div>
        <p className="text-[0.7rem] text-slate-600 line-clamp-2">
          {episode.overview || "Sinopsis no disponible en español."}
        </p>
        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                episode.rating >= 8
                  ? "bg-simpsonGreen/15 text-simpsonGreen"
                  : episode.rating >= 7
                  ? "bg-simpsonOrange/10 text-simpsonOrange"
                  : "bg-simpsonRed/10 text-simpsonRed"
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              {episode.rating.toFixed(1)}
            </span>
            <span className="text-[0.65rem] text-slate-500">
              ({episode.voteCount.toLocaleString("es-ES")} votos)
            </span>
          </div>

          {episode.airDate && (
            <span className="text-[0.65rem] text-slate-500 whitespace-nowrap">
              {episode.airDate}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default EpisodeCard;
