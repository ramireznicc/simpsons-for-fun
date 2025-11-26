import React from "react";
import { X, Calendar, Star, Tv, Clock } from "lucide-react";
import type { Episode } from "../types";

type EpisodeDetailModalProps = {
  episode: Episode;
  onClose: () => void;
};

const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  onClose,
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

          {/* Acciones futuras (placeholder simple por ahora) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Temporada {episode.season} · Episodio {episode.episode}
              </span>
            </div>

            {/* Botón básico de cerrar para mobile a mano */}
            <button
              onClick={onClose}
              className="ml-auto px-3 py-1.5 rounded-full bg-simpsonSky text-white text-xs font-semibold shadow-soft active:scale-95 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetailModal;
