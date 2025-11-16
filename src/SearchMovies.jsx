import  { useState } from "react";
import "./SearchMovies.css";


export default function SearchMovies() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = async (e) => {
    e.preventDefault();
    const q = query.trim();

 
    if (!q) {
      setError("Please enter a movie name.");
      setMovies([]);
      return;
    }

    setError(null);
    setLoading(true);
    setMovies([]);

    const url = `https://api.themoviedb.org/3/search/movie?api_key={apikey}&language=en-US&query=${encodeURIComponent(q)}&page=1&include_adult=false`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setMovies(Array.isArray(data.results) ? data.results : []);
      if (!data.results || data.results.length === 0) {
        setError("No movies found for that query.");
      }
    } catch (err) {
      setError("Failed to fetch movies. Try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form className="form" onSubmit={searchMovies} aria-label="Search movies">
        <label className="label" htmlFor="query">
          Movie Name
        </label>

        <div className="input-row">
          <input
            id="query"
            className="input"
            type="text"
            name="query"
            placeholder="e.g. Jurassic Park"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Movie name"
            aria-invalid={!!error}
          />

          <button
            className="button"
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            title={loading ? "Searching…" : "Search"}
          >
            {loading ? <span className="spinner" aria-hidden="true" /> : "Search"}
          </button>
        </div>

        {error && <p className="message message--error" role="alert">{error}</p>}
      </form>

      <section className="card-list" aria-live="polite">
        {movies.length === 0 && !loading && !error && (
          <p className="message">Try searching for a movie above.</p>
        )}

        {movies
          .filter((movie) => movie.poster_path) 
          .map((movie) => (
            <article className="card" key={movie.id}>
              <img
                className="card--image"
                src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
                alt={`${movie.title} poster`}
                loading="lazy"
              />
              <div className="card--content">
                <h3 className="card--title">{movie.title}</h3>
                <p className="meta">
                  <small>Release: {movie.release_date || "N/A"}</small>
                  <small> • Rating: {movie.vote_average ?? "N/A"}</small>
                </p>
                <p className="card--desc">{movie.overview || "No description available."}</p>
              </div>
            </article>
          ))}
      </section>
    </main>
  );
}
