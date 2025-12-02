import React, { useState } from "react";
import { X, Calendar, Star, Tv, Check, Clock } from "lucide-react";
import type { Episode } from "../types";

type EpisodeDetailModalProps = {
  episode: Episode;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatched: () => void;
  isWatchLater: boolean;
  onToggleWatchLater: () => void;
  userRating?: number;
  onRatingChange: (rating: number) => void;
  onRatingRemove: () => void;
};

const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  onClose,
  isWatched,
  onToggleWatched,
  isWatchLater,
  onToggleWatchLater,
  userRating,
  onRatingChange,
  onRatingRemove,
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [showFullOverview, setShowFullOverview] = useState(false);

  return (
    <>
      {/* Modal de descripción completa */}
      {showFullOverview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowFullOverview(false)}
        >
          <div
            className="w-full max-w-lg bg-simpsonCream rounded-2xl shadow-xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Sinopsis</h3>
              <button
                onClick={() => setShowFullOverview(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {episode.overview || "Sinopsis no disponible en español."}
            </p>
            <button
              onClick={() => setShowFullOverview(false)}
              className="w-full mt-4 px-4 py-2 rounded-xl bg-simpsonYellow text-slate-900 text-sm font-semibold hover:bg-simpsonYellow/90 active:scale-[0.98] transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal principal */}
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

          {/* Sinopsis - clickeable para expandir */}
          <button
            onClick={() => setShowFullOverview(true)}
            className="w-full bg-white/90 rounded-xl p-3 border border-simpsonSky/20 hover:border-simpsonSky/40 hover:bg-white transition-all text-left group"
          >
            <p className="text-xs text-slate-700 leading-relaxed line-clamp-2 group-hover:text-slate-900 transition-colors">
              {episode.overview || "Sinopsis no disponible en español."}
            </p>
            <p className="text-[0.65rem] text-simpsonSky font-semibold mt-1.5 group-hover:underline">
              Ver descripción completa →
            </p>
          </button>

          {/* Checkbox de episodio visto */}
          <button
            onClick={onToggleWatched}
            className={`w-full rounded-xl p-2.5 border-2 transition-all duration-200 flex items-center gap-2.5 group ${
              isWatched
                ? "bg-simpsonGreen/10 border-simpsonGreen hover:bg-simpsonGreen/15"
                : "bg-white/90 border-simpsonSky/30 hover:border-simpsonSky/50 hover:bg-white"
            }`}
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isWatched
                  ? "bg-simpsonGreen shadow-soft"
                  : "bg-slate-100 group-hover:bg-slate-200"
              }`}
            >
              {isWatched && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                isWatched
                  ? "text-simpsonGreen"
                  : "text-slate-700 group-hover:text-slate-900"
              }`}
            >
              {isWatched ? "Ya viste este episodio" : "Marcar como visto"}
            </span>
          </button>

          {/* Sistema de valoración - solo se muestra si el episodio está marcado como visto */}
          {isWatched && (
            <div className="bg-white/90 rounded-xl p-3 border border-simpsonYellow/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Tu valoración
                </h3>
                {userRating && (
                  <button
                    onClick={onRatingRemove}
                    className="text-[0.65rem] text-slate-500 hover:text-simpsonRed transition-colors"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {/* Estrellas de valoración */}
              <div className="flex items-center justify-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
                  const displayRating = hoveredRating ?? userRating ?? 0;
                  const isFilled = value <= displayRating;
                  const isHalf = value - 0.5 === displayRating;

                  return (
                    <div key={value} className="relative">
                      {/* Estrella completa */}
                      <button
                        onClick={() => onRatingChange(value)}
                        onMouseEnter={() => setHoveredRating(value)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 transition-all ${
                            isFilled
                              ? "text-simpsonYellow fill-simpsonYellow"
                              : "text-slate-300"
                          }`}
                        />
                      </button>

                      {/* Media estrella (mitad izquierda) */}
                      <button
                        onClick={() => onRatingChange(value - 0.5)}
                        onMouseEnter={() => setHoveredRating(value - 0.5)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="absolute inset-0 w-1/2 p-0.5 hover:scale-110 transition-transform"
                        style={{ zIndex: 1 }}
                      >
                        <div className="overflow-hidden w-2.5">
                          <Star
                            className={`w-5 h-5 transition-all ${
                              isHalf || isFilled
                                ? "text-simpsonYellow fill-simpsonYellow"
                                : "text-slate-300"
                            }`}
                          />
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Valor numérico */}
              <div className="text-center">
                <span className="text-base font-bold text-simpsonYellow">
                  {userRating ? userRating.toFixed(1) : "—"}
                </span>
                <span className="text-[0.65rem] text-slate-500 ml-1">/ 10</span>
              </div>

              {!userRating && (
                <p className="text-[0.65rem] text-slate-500 text-center mt-1">
                  Haz clic en las estrellas para valorar
                </p>
              )}
            </div>
          )}

          {/* Botón para ver después */}
          <button
            onClick={onToggleWatchLater}
            className={`w-full rounded-xl p-2.5 border-2 transition-all duration-200 flex items-center gap-2.5 group ${
              isWatchLater
                ? "bg-simpsonOrange/10 border-simpsonOrange hover:bg-simpsonOrange/15"
                : "bg-white/90 border-simpsonSky/30 hover:border-simpsonSky/50 hover:bg-white"
            }`}
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isWatchLater
                  ? "bg-simpsonOrange shadow-soft"
                  : "bg-slate-100 group-hover:bg-slate-200"
              }`}
            >
              {isWatchLater && <Clock className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
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
            className="w-full px-4 py-2 rounded-xl bg-simpsonSky text-white text-xs font-semibold shadow-soft hover:bg-simpsonSky/90 active:scale-[0.98] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EpisodeDetailModal;
