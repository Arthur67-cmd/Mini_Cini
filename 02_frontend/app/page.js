"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Page() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    year: "",
    genre: "",
    poster_url: "",
    rating: "",
  });

  const apiHost = process.env.NEXT_PUBLIC_API_HOST;

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      setLoading(true);
      const res = await fetch(`${apiHost}/movies`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addMovie(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${apiHost}/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });
      if (!res.ok) throw new Error("Failed to add movie");
      await fetchMovies();
      setNewMovie({ title: "", year: "", genre: "", poster_url: "", rating: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleWatched(id, currentStatus) {
    try {
      const res = await fetch(`${apiHost}/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watched: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update movie");
      await fetchMovies();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteMovie(id) {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
      const res = await fetch(`${apiHost}/movies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete movie");
      await fetchMovies();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <main className="container">
        <div className="empty">🎬 Loading movies...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="empty error">❌ Error: {error}</div>
      </main>
    );
  }

  const watchedMovies = movies.filter(m => m.watched);
  const unwatchedMovies = movies.filter(m => !m.watched);

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">🎬 Mini_Cini</h1>
        <p className="subtitle">Your Personal Movie Watchlist</p>
        <div className="stats">
          <span>Total: {movies.length}</span>
          <span>Watched: {watchedMovies.length}</span>
          <span>To Watch: {unwatchedMovies.length}</span>
        </div>
      </header>

      <button 
        className="btn-add"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "✕ Cancel" : "+ Add Movie"}
      </button>

      {showForm && (
        <form className="movie-form" onSubmit={addMovie}>
          <h2>Add New Movie</h2>
          <input
            type="text"
            placeholder="Movie Title *"
            value={newMovie.title}
            onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={newMovie.year}
            onChange={(e) => setNewMovie({...newMovie, year: e.target.value})}
          />
          <input
            type="text"
            placeholder="Genre"
            value={newMovie.genre}
            onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
          />
          <input
            type="text"
            placeholder="Poster URL"
            value={newMovie.poster_url}
            onChange={(e) => setNewMovie({...newMovie, poster_url: e.target.value})}
          />
          <input
            type="number"
            step="0.1"
            max="10"
            placeholder="Rating (0-10)"
            value={newMovie.rating}
            onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
          />
          <button type="submit" className="btn-submit">Add to Watchlist</button>
        </form>
      )}

      {movies.length === 0 ? (
        <div className="empty">No movies in your watchlist yet. Add your first movie!</div>
      ) : (
        <>
          <section className="section">
            <h2 className="section-title"> To Watch ({unwatchedMovies.length})</h2>
            <div className="grid">
              {unwatchedMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onToggle={toggleWatched}
                  onDelete={deleteMovie}
                />
              ))}
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">✅ Watched ({watchedMovies.length})</h2>
            <div className="grid">
              {watchedMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onToggle={toggleWatched}
                  onDelete={deleteMovie}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function MovieCard({ movie, onToggle, onDelete }) {
  return (
    <article className={`card ${movie.watched ? 'watched' : ''}`}>
      {movie.poster_url && (
        <div className="media">
          <Image
            src={movie.poster_url}
            alt={movie.title}
            width={300}
            height={450}
            className="poster"
          />
        </div>
      )}
      <div className="body">
        <h3 className="card-title">{movie.title}</h3>
        {movie.year && <p className="year">{movie.year}</p>}
        {movie.genre && <span className="genre">{movie.genre}</span>}
        {movie.rating && (
          <div className="rating">
             {parseFloat(movie.rating).toFixed(1)}/10
          </div>
        )}
        <div className="actions">
          <button 
            className="btn-watch"
            onClick={() => onToggle(movie.id, movie.watched)}
          >
            {movie.watched ? "↩️ Mark Unwatched" : "✓ Mark Watched"}
          </button>
          <button 
            className="btn-delete"
            onClick={() => onDelete(movie.id)}
          >
             Delete
          </button>
        </div>
      </div>
    </article>
  );
}