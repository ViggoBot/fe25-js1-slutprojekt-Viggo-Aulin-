const API_KEY = "6e753d412728f776ff6e03a127b09896";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
  return axios.get(url);
};

export const getBestOatMovies = async () => {
  const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`;
  return axios.get(url);
};

export const findActor = async (actorName) => {
  const url = `${BASE_URL}/search/person?api_key=${API_KEY}&query=${actorName}&include_adult=false&language=en-US&page=1`;
  return axios.get(url);
};

export const findMovie = async (movieName) => {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${movieName}&language=en-US&page=1`;
  return axios.get(url);
};
