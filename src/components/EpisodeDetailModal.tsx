import React from "react";
import { X, Calendar, Star, Tv, Check, Clock } from "lucide-react";
import type { Episode } from "../types";

type EpisodeDetailModalProps = {
  episode: Episode;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatched: () => void;
  isWatchLater: boolean;
  onToggleWatchLater: () => void;
};

const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  onClose,
  isWatched,
  onToggleWatched,
  isWatchLater,
  onToggleWatchLater,
}) => {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl bg-simpsonCream shadow-xl border border-simpsonSky/40 max-h-[90vh] overflow-hidden animate-[fadeInUp_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-simpsonSky/20">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-simpsonSky" />
            <p className="text-[0.7rem] uppercase tracking-wide text-slate-600">
              Detalle de episodio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Imagen */}
        {episode.imageUrl && (
          <div className="w-full h-44 sm:h-56 bg-simpsonSky/20 overflow-hidden">
            <img
              src={episode.imageUrl}
              alt={episode.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Contenido */}
        <div className="px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
          {/* Título + meta */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                {episode.name}
              </h2>
              <span className="text-xs font-semibold text-slate-700 bg-simpsonYellow/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                T{episode.season.toString().padStart(2, "0")} · E
                {episode.episode.toString().padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              {episode.airDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {episode.airDate}
                </span>
              )}

              <span className="inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-simpsonGreen fill-current" />
                <span className="font-semibold">
                  {episode.rating.toFixed(1)}
                </span>
                <span className="text-[0.7rem] text-slate-500">
                  ({episode.voteCount.toLocaleString("es-ES")} votos)
                </span>
              </span>
            </div>
          </div>

          {/* Sinopsis */}
          <div className="bg-white/90 rounded-xl p-3 border border-simpsonSky/20">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {episode.overview || "Sinopsis no disponible en español."}
            </p>
          </div>

          {/* Checkbox de episodio visto */}
          <button
            onClick={onToggleWatched}
            className={`w-full rounded-xl p-3 border-2 transition-all duration-200 flex items-center gap-3 group ${
              isWatched
                ? "bg-simpsonGreen/10 border-simpsonGreen hover:bg-simpsonGreen/15"
                : "bg-white/90 border-simpsonSky/30 hover:border-simpsonSky/50 hover:bg-white"
            }`}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isWatched
                  ? "bg-simpsonGreen shadow-soft"
                  : "bg-slate-100 group-hover:bg-slate-200"
              }`}
            >
              {isWatched && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                isWatched
                  ? "text-simpsonGreen"
                  : "text-slate-700 group-hover:text-slate-900"
              }`}
            >
              {isWatched ? "Ya viste este episodio" : "Marcar como visto"}
            </span>
          </button>

          {/* Botón para ver después */}
          <button
            onClick={onToggleWatchLater}
            className={`w-full rounded-xl p-3 border-2 transition-all duration-200 flex items-center gap-3 group ${
              isWatchLater
                ? "bg-simpsonOrange/10 border-simpsonOrange hover:bg-simpsonOrange/15"
                : "bg-white/90 border-simpsonSky/30 hover:border-simpsonSky/50 hover:bg-white"
            }`}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isWatchLater
                  ? "bg-simpsonOrange shadow-soft"
                  : "bg-slate-100 group-hover:bg-slate-200"
              }`}
            >
              {isWatchLater && <Clock className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                isWatchLater
                  ? "text-simpsonOrange"
                  : "text-slate-700 group-hover:text-slate-900"
              }`}
            >
              {isWatchLater ? "Guardado para ver después" : "Guardar para ver después"}
            </span>
          </button>

          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-simpsonSky text-white text-sm font-semibold shadow-soft hover:bg-simpsonSky/90 active:scale-[0.98] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetailModal;
