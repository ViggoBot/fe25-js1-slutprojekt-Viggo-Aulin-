import { findMovie, findActor, getBestOatMovies, getPopularMovies } from "./api.js";

// variabler där datan sparas. Så jag bara hämtar det en gång
let top10OatResults = null;
let top10NowResults = null;

const POSTER_BASE_PATH = "https://media.themoviedb.org/t/p/w440_and_h660_face";

const appendMovieData = (movieData) => {
  // Hämtar ut gallery och tömmer den
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  // Loopar genom alla filmer
  movieData.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Image
    const img = document.createElement("img");
    img.src = POSTER_BASE_PATH + movie.poster_path;
    img.classList.add("poster");
    // title
    const title = document.createElement("h2");
    title.textContent = movie.title;
    title.classList.add("title");

    // date
    const release = document.createElement("h6");
    release.textContent = movie.release_date;
    release.classList.add("date");

    // lägger till allt på sidan
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(release);

    gallery.appendChild(card);
  });
};

// hämtar datan ifrån apiet och skriver ut det på sidan
const fetchTop10Oat = async () => {
  // döljer actor sidan
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.add("hidden");
  });
  // den visar top 10 sidan
  const top10Page = document.getElementById("top10Page");
  top10Page.classList.remove("hidden");

  // fetchar datan från apiet om det inte redan har gjort det
  if (!top10OatResults) {
    // försök att hämta datan
    try {
      
      top10OatResults = await getBestOatMovies();
    } catch (error) {
      // skriv ut felet i console
      console.log("error", error);

      // skriv ut felet på sidan
      const serverError = document.createElement("p");
      serverError.innerHTML = `${error.status} - ${error.code}`;

      // Hämtar ut gallery och tömmer den
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
      gallery.appendChild(serverError);

      // sätt till null så vi kan försöka igen om man trycker på knappen
      top10OatResults = null;
      return;
    }
  }

  // Plocka ut top 10 filmer
  const top10 = top10OatResults.data.results.slice(0, 10);

  appendMovieData(top10);
};

const fetchTop10Now = async () => {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.add("hidden");
  });

  const top10Page = document.getElementById("top10Page");
  top10Page.classList.remove("hidden");

  // fetchar datan från apiet om det inte redan har gjort det
  if (!top10NowResults) {
    // försök att hämta datan
    try {
      top10NowResults = await getPopularMovies();
    } catch (error) {
      // skriv ut felet i console
      console.log("error", error);

      // skriv ut felet på sidan
      const serverError = document.createElement("p");
      serverError.innerHTML = `${error.status} - ${error.code}`;

      // Hämtar ut gallery och tömmer den
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
      gallery.appendChild(serverError);

      // sätt till null så vi kan försöka igen om man trycker på knappen
      top10NowResults = null;
      return;
    }
  }

  // Plocka ut top 10 filmer
  const top10 = top10NowResults.data.results.slice(0, 10);

  appendMovieData(top10);
};

async function actorSearch(event) {
  // hindrar formuläret att skickas och laddar om sidan
  event.preventDefault();
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.add("hidden");
  });

  const searchActorPage = document.getElementById("searchActorPage");
  searchActorPage.classList.remove("hidden");

  // tömmer actor container
  const actorContainer = document.getElementById("actorContainer");
  actorContainer.innerHTML = "";
  // läser av inputen i forumet
  const actorStr = document.querySelector("input").value;
  // tömmer texten
  event.target.reset();
  
  let personResponse = null;
  // loggar felet i consolen
  try {
    personResponse = await findActor(actorStr);
  } catch (error) {
    console.log("error", error);
    // skriver upp felet på sidan
    const serverError = document.createElement("p");
    serverError.innerHTML = `${error.status} - ${error.code}`;
    actorContainer.appendChild(serverError);
    return;
  }
  // väljer första träffen av actors
  const actor = personResponse?.data?.results?.[0];
  // om det inte finns någon actor så skriver den ut det på sidan
  if (!actor) {
    const noActorFound = document.createElement("p");
    noActorFound.innerHTML = "Inget resultat";
    actorContainer.appendChild(noActorFound);
    return;
  }
  // om den hittar en actor så tar den fram en bild på hen om det finns
  if (actor.profile_path) {
    const actorimg = document.createElement("img");
    actorimg.src =
      "https://media.themoviedb.org/t/p/w235_and_h235_face" +
      actor.profile_path;
    actorimg.classList.add("actorimg");
    actorContainer.appendChild(actorimg);
  }
  // actor namn
  const name = document.createElement("h2");
  name.textContent = actor.name;
  name.classList.add("name");
  // actor känd för
  const known_for_department = document.createElement("p");
  known_for_department.textContent = actor.known_for_department;
  known_for_department.classList.add("known_for_department");
  // lägger upp det till sidan
  actorContainer.appendChild(name);
  actorContainer.appendChild(known_for_department);
  // actors movies
  actor.known_for.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("actorMoviecard");
    // poster på filmerna
    const ActorMovieimg = document.createElement("img");
    ActorMovieimg.src = POSTER_BASE_PATH + movie.poster_path;
    ActorMovieimg.classList.add("actorMovieposter");

    // movie titel
    const actorTitle = document.createElement("h2");
    actorTitle.textContent = movie.title;
    actorTitle.classList.add("actorMovieTitle");
    // TV show namn
    const actorTvName = document.createElement("h2");
    actorTvName.textContent = movie.name;
    actorTvName.classList.add("actorTvName");
    // Movie plot
    const actorOverview = document.createElement("p");
    actorOverview.textContent = movie.overview;
    actorOverview.classList.add("actorMovieOverview");
    // movie release date
    const actorRelease = document.createElement("h6");
    actorRelease.textContent = movie.release_date;
    actorRelease.classList.add("actorMovieDate");
    // TV show first air
    const actorTvRelease = document.createElement("h6");
    actorTvRelease.textContent = movie.first_air_date;
    actorTvRelease.classList.add("actorTvDate");
    // lägger upp allt till sidan
    actorContainer.appendChild(ActorMovieimg);
    actorContainer.appendChild(actorTitle);
    actorContainer.appendChild(actorTvName);
    actorContainer.appendChild(actorOverview);
    actorContainer.appendChild(actorRelease);
    actorContainer.appendChild(actorTvRelease);
  });
}
async function movieSearch(event) {
  event.preventDefault();

  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.add("hidden");
  });

  const searchMoviePage = document.getElementById("searchMoviePage");
  searchMoviePage.classList.remove("hidden");

  const searchMovieContainer = document.getElementById("searchMovieContainer");
  searchMovieContainer.innerHTML = "";

  const movieStr = document.querySelector("#movie_name").value;
  event.target.reset();
  

  let movieResponse;
  try {
    movieResponse = await findMovie(movieStr);
  } catch (error) {
    const serverError = document.createElement("p");
    serverError.textContent = "Server error";
    searchMovieContainer.appendChild(serverError);
    return;
  }

  const movies = movieResponse?.data?.results;

  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movieDiv");

    const searchMovieImg = document.createElement("img");
    searchMovieImg.src = POSTER_BASE_PATH + movie.poster_path;
    searchMovieImg.classList.add("searchMovieposter");

    // title
    const searchMovieTitle = document.createElement("h2");
    searchMovieTitle.textContent = movie.title;
    searchMovieTitle.classList.add("title");

    // date
    const searchMovieRelease = document.createElement("h6");
    searchMovieRelease.textContent = movie.release_date;
    searchMovieRelease.classList.add("date");

    // name
    const searchMovieName = document.createElement("h2");
    searchMovieName.textContent = movie.name;
    searchMovieName.classList.add("searchMovieName");

    // overview
    const searchMovieOverview = document.createElement("p");
    searchMovieOverview.textContent = movie.overview;
    searchMovieOverview.classList.add("searchMovieoverview");

    // lägger till allt på sidan
    searchMovieContainer.appendChild(searchMovieImg);
    searchMovieContainer.appendChild(searchMovieTitle);
    searchMovieContainer.appendChild(searchMovieName);
    searchMovieContainer.appendChild(searchMovieOverview);
    searchMovieContainer.appendChild(searchMovieRelease);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  // När sidan är laddad körs denna koden
  // Koppla top 10 nu knappen
  const top10NowBtn = document.getElementById("top10NowBtn");
  top10NowBtn.addEventListener("click", fetchTop10Now);

  // koppla top 10 oat knappen
  const top10OatBtn = document.getElementById("top10OatBtn");
  top10OatBtn.addEventListener("click", fetchTop10Oat);

  // Koppla sök knappen
  const actorform = document.querySelector(".actorform");
  actorform.addEventListener("submit", actorSearch);

  const movieform = document.querySelector(".movieform");
  movieform.addEventListener("submit", movieSearch);
});
