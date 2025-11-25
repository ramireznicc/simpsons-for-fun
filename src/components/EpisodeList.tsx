import React from "react";
import type { Episode } from "../types";
import EpisodeCard from "./EpisodeCard";

type EpisodeListProps = {
  episodes: Episode[];
  loading: boolean;
  error: string | null;
  onEpisodeClick?: (episode: Episode) => void;
};

const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  loading,
  error,
  onEpisodeClick,
}) => {
  return (
    <section className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Episodios (ordenados por rating)
        </h2>
        <p className="text-[0.7rem] text-slate-500">Vista mobile‑first</p>
      </div>

      {loading && (
        <ul className="space-y-3 max-h-[70vh] overflow-y-auto -mx-2 px-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <li
              key={idx}
              className="bg-white rounded-2xl shadow-soft border border-simpsonSky/20 p-3 flex gap-3 animate-pulse"
            >
              <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-slate-200" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-4 w-32 bg-slate-200 rounded-md" />
                  <div className="h-4 w-16 bg-slate-200 rounded-full" />
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-md" />
                <div className="h-3 w-4/5 bg-slate-200 rounded-md" />
                <div className="flex items-center justify-between mt-2 gap-2">
                  <div className="h-4 w-20 bg-slate-200 rounded-full" />
                  <div className="h-3 w-16 bg-slate-200 rounded-md" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && episodes.length === 0 && !error && (
        <p className="text-sm text-slate-600">
          No se encontraron episodios. Revisa tu conexión o la API key.
        </p>
      )}

      {!loading && episodes.length > 0 && (
        <ul className="space-y-3 max-h-[70vh] overflow-y-auto -mx-2 px-2">
          {episodes.slice(0, 50).map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} onClick={onEpisodeClick} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default EpisodeList;
