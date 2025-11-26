import React from "react";
import { X, Trash2, ListCheck, Star } from "lucide-react";
import type { Episode } from "../types";

type WatchedDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  watchedEpisodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
  onToggleWatched: (episodeId: string) => void;
  onClearAll: () => void;
  totalEpisodes: number;
};

const WatchedDrawer: React.FC<WatchedDrawerProps> = ({
  isOpen,
  onClose,
  watchedEpisodes,
  onEpisodeClick,
  onToggleWatched,
  onClearAll,
  totalEpisodes,
}) => {
  const watchedCount = watchedEpisodes.length;
  const percentage = totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-[fadeIn_0.2s_ease-out]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-simpsonCream shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-simpsonSky/20 bg-simpsonYellow/90">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-simpsonSky flex items-center justify-center">
                <ListCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Mis episodios
                </h2>
                <p className="text-xs text-slate-700">
                  {watchedCount} de {totalEpisodes} vistos
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/50 active:scale-95 transition-all"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Stats */}
          <div className="px-4 py-4 bg-white/50 border-b border-simpsonSky/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Progreso</span>
                <span className="text-slate-900 font-bold">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-simpsonOrange to-simpsonGreen transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lista de episodios */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {watchedCount === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-full bg-simpsonSky/10 flex items-center justify-center mb-3">
                  <ListCheck className="w-8 h-8 text-simpsonSky/40" />
                </div>
                <p className="text-sm text-slate-600 mb-1">
                  No has marcado ningún episodio
                </p>
                <p className="text-xs text-slate-500">
                  Empieza a marcar episodios como vistos para verlos aquí
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {watchedEpisodes
                  .sort((a, b) => {
                    if (a.season !== b.season) return a.season - b.season;
                    return a.episode - b.episode;
                  })
                  .map((episode) => (
                    <div
                      key={`${episode.season}-${episode.episode}`}
                      className="bg-white rounded-xl border border-simpsonSky/20 overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <div
                        className="flex gap-3 p-2 cursor-pointer"
                        onClick={() => onEpisodeClick(episode)}
                      >
                        {episode.imageUrl && (
                          <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-simpsonSky/20">
                            <img
                              src={episode.imageUrl}
                              alt={episode.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">
                              {episode.name}
                            </h3>
                            <span className="text-[0.65rem] font-semibold text-slate-700 bg-simpsonYellow/60 px-1.5 py-0.5 rounded whitespace-nowrap">
                              S{episode.season.toString().padStart(2, "0")}E
                              {episode.episode.toString().padStart(2, "0")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-0.5 text-[0.65rem]">
                              <Star className="w-2.5 h-2.5 text-simpsonGreen fill-current" />
                              <span className="font-semibold text-slate-700">
                                {episode.rating.toFixed(1)}
                              </span>
                            </span>
                            {episode.airDate && (
                              <span className="text-[0.65rem] text-slate-500">
                                {episode.airDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatched(
                            `S${episode.season}E${episode.episode}`
                          );
                        }}
                        className="w-full px-3 py-1.5 text-[0.7rem] font-medium text-simpsonRed hover:bg-simpsonRed/5 active:bg-simpsonRed/10 transition-colors border-t border-simpsonSky/10"
                      >
                        Desmarcar
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer con botón limpiar */}
          {watchedCount > 0 && (
            <div className="px-4 py-3 border-t border-simpsonSky/20 bg-white/50">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que quieres borrar todos los episodios marcados? Esta acción no se puede deshacer."
                    )
                  ) {
                    onClearAll();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-simpsonRed text-white text-sm font-semibold shadow-soft hover:bg-simpsonRed/90 active:scale-[0.98] transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar todo el historial
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WatchedDrawer;
