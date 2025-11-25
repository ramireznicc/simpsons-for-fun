export type Episode = {
  id: number;
  name: string;
  overview: string;
  season: number;
  episode: number;
  airDate: string | null;
  rating: number;
  voteCount: number;
  imageUrl: string | null;
};
