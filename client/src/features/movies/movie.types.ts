export type Movie = {
  id: number;
  title: string;
  vote_average: number;
  backdrop_path: string | null;
  poster_path?: string | null;
};

export type MovieDetails = Movie & {
  overview: string;
  poster_path: string | null;
  release_date: string;
  runtime: number | null;
  tagline: string;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  videos: {
    results: {
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
};

export type MovieList = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};
