import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getStoredMovies, Movie } from '../services/movieService';
import {
  Film,
  Play,
  Star,
  Calendar,
  Clock,
  Sparkles,
  Ticket,
  Search,
  Filter,
  X,
  Volume2,
  Award,
  Video,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

export const MovieDiscoveryPage: React.FC = () => {
  const { currentSkinConfig } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>(() => getStoredMovies());
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [genreFilter, setGenreFilter] = useState<string>('ALL');
  const [languageFilter, setLanguageFilter] = useState<string>('ALL');

  // Hero featured film (e.g. first movie)
  const heroMovie = movies[0] || null;

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      const matchSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.director.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.leadCast.some(c => c.actorName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
      const matchGenre = genreFilter === 'ALL' || m.genres.includes(genreFilter);
      const matchLang = languageFilter === 'ALL' || m.languages.includes(languageFilter);

      return matchSearch && matchStatus && matchGenre && matchLang;
    });
  }, [movies, searchQuery, statusFilter, genreFilter, languageFilter]);

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach(m => m.genres.forEach(g => set.add(g)));
    return Array.from(set);
  }, [movies]);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    movies.forEach(m => m.languages.forEach(l => set.add(l)));
    return Array.from(set);
  }, [movies]);

  return (
    <div className="min-h-screen pb-24 text-gray-100 space-y-10">
      
      {/* 1. CINEMATIC HERO SPOTLIGHT */}
      {heroMovie && (
        <div className="relative min-h-[550px] sm:min-h-[620px] flex items-end overflow-hidden border-b border-white/10">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.backdropUrl}
              alt={heroMovie.title}
              className="w-full h-full object-cover filter brightness-[0.55] contrast-125 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-transparent to-transparent hidden md:block" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono shadow-md"
                style={{
                  backgroundColor: `${currentSkinConfig.primary}25`,
                  color: currentSkinConfig.primary,
                  borderColor: `${currentSkinConfig.primary}60`,
                  borderWidth: 1
                }}
              >
                ★ FEATURED SPOTLIGHT • {heroMovie.format}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-xs text-gray-300 font-mono">
                {heroMovie.censorRating} • {heroMovie.durationMinutes} MIN
              </span>
            </div>

            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-cinematic uppercase tracking-wider text-white drop-shadow-lg leading-tight">
                {heroMovie.title}
              </h1>
              <p className="text-sm sm:text-base italic text-amber-300/90 font-serif">
                "{heroMovie.tagline}"
              </p>
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed max-w-2xl">
                {heroMovie.synopsis}
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTrailerMovie(heroMovie)}
                className="px-6 py-3 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md flex items-center space-x-2 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Watch Trailer</span>
              </button>

              <button
                onClick={() => setSelectedMovie(heroMovie)}
                className="px-6 py-3 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider text-black flex items-center space-x-2 transition-all hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: currentSkinConfig.primary,
                  boxShadow: `0 0 20px ${currentSkinConfig.primary}50`
                }}
              >
                <Eye className="w-4 h-4" />
                <span>Inspect Film Reel</span>
              </button>

              {heroMovie.associatedEventId && (
                <Link
                  to={`/events?eventId=${heroMovie.associatedEventId}`}
                  className="px-6 py-3 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 text-white hover:brightness-110 flex items-center space-x-2 transition-all shadow-md"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Premiere Passes</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. DISCOVERY CONTROLS & FILTER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by film title, director, or star..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
              style={{
                borderColor: searchQuery ? currentSkinConfig.primary : undefined
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Status Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { id: 'ALL', label: 'All Catalog' },
              { id: 'UPCOMING_PREMIERE', label: 'Upcoming Premieres' },
              { id: 'NOW_SHOWING', label: 'Now Showing' },
              { id: 'FESTIVAL_SELECTION', label: 'Festival Laureates' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all text-xs ${
                  statusFilter === tab.id
                    ? 'text-black font-bold shadow-md'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
                style={{
                  backgroundColor: statusFilter === tab.id ? currentSkinConfig.primary : undefined
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Genre & Language Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] uppercase mr-1 flex items-center gap-1 text-gray-300">
              <Filter className="w-3.5 h-3.5" /> Genres:
            </span>
            <button
              onClick={() => setGenreFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                genreFilter === 'ALL'
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            {allGenres.map(g => (
              <button
                key={g}
                onClick={() => setGenreFilter(g)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                  genreFilter === g
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[11px] uppercase mr-1 text-gray-300">
              Language:
            </span>
            <button
              onClick={() => setLanguageFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                languageFilter === 'ALL'
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            {allLanguages.map(l => (
              <button
                key={l}
                onClick={() => setLanguageFilter(l)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                  languageFilter === l
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* 3. MOVIE CARDS SHOWCASE GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-cinematic font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" />
              <span>Cinema Showcase ({filteredMovies.length} Titles)</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">
              Live Studio Releases
            </span>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMovies.map(movie => (
                <div
                  key={movie.id}
                  className="group relative rounded-3xl bg-[#0c0d12] border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
                  style={{
                    boxShadow: `0 10px 30px -10px ${currentSkinConfig.primary}20`
                  }}
                >
                  {/* Poster Thumbnail */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-black">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1 shadow">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {movie.rating.toFixed(1)}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-lg font-mono text-[9px] font-bold uppercase tracking-wider text-black shadow"
                        style={{ backgroundColor: currentSkinConfig.primary }}
                      >
                        {movie.format.split(' ')[0]}
                      </span>
                    </div>

                    {/* Quick Trailer Play Overlay */}
                    <button
                      onClick={() => setActiveTrailerMovie(movie)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
                      title="Play Trailer"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-white" />
                      </div>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                        {movie.languages.slice(0, 2).join(' • ')} • {movie.genres[0]}
                      </div>
                      <h3 className="text-base font-bold text-white font-cinematic uppercase tracking-wide truncate group-hover:text-amber-300 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {movie.synopsis}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>Dir. {movie.director.name}</span>
                        <span className="font-mono text-[10px]">{movie.releaseDate}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => setSelectedMovie(movie)}
                          className="py-2 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition text-center"
                        >
                          Details
                        </button>

                        {movie.associatedEventId ? (
                          <Link
                            to={`/events?eventId=${movie.associatedEventId}`}
                            className="py-2 rounded-xl text-[11px] font-bold text-black text-center transition shadow-sm hover:brightness-110 flex items-center justify-center gap-1"
                            style={{ backgroundColor: currentSkinConfig.primary }}
                          >
                            <Ticket className="w-3 h-3" />
                            <span>Passes</span>
                          </Link>
                        ) : (
                          <button
                            onClick={() => setSelectedMovie(movie)}
                            className="py-2 rounded-xl text-[11px] font-bold text-gray-400 bg-white/5 border border-white/10 text-center"
                          >
                            Premiere
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-black/40 border border-white/10 space-y-2">
              <Film className="w-10 h-10 text-gray-600 mx-auto" />
              <div className="text-base font-bold text-white">No Movies Match These Filters</div>
              <p className="text-xs text-gray-400">Try selecting a different genre or clearing the search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setGenreFilter('ALL');
                  setLanguageFilter('ALL');
                }}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black uppercase"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. DEEP-DIVE MOVIE DETAILS MODAL */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e0f14] border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            
            {/* Modal Header Backdrop */}
            <div className="relative h-60 sm:h-72 w-full overflow-hidden">
              <img
                src={selectedMovie.backdropUrl}
                alt={selectedMovie.title}
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f14] via-[#0e0f14]/50 to-transparent" />
              
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 border border-white/20 text-white hover:bg-black transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase"
                    style={{
                      backgroundColor: currentSkinConfig.primary,
                      color: '#000'
                    }}
                  >
                    {selectedMovie.format}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-cinematic uppercase tracking-wide text-white mt-1">
                    {selectedMovie.title}
                  </h2>
                  <p className="text-xs italic text-amber-300">"{selectedMovie.tagline}"</p>
                </div>

                <div className="flex items-center gap-1.5 bg-black/80 px-3 py-1.5 rounded-xl border border-white/20 text-amber-300 font-mono text-sm font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{selectedMovie.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">({selectedMovie.votes.toLocaleString()} votes)</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 pt-0 space-y-6">
              
              {/* Synopsis */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                  Narrative Logline & Synopsis
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {selectedMovie.synopsis}
                </p>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 text-xs">
                <div>
                  <span className="text-gray-500 font-mono block text-[10px] uppercase">Director</span>
                  <span className="font-bold text-white">{selectedMovie.director.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-mono block text-[10px] uppercase">Studio / Escrow</span>
                  <span className="font-bold text-white">{selectedMovie.producer.studio}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-mono block text-[10px] uppercase">Camera Package</span>
                  <span className="font-bold text-white">{selectedMovie.cinematographer?.rig || 'ARRI 65 Cinema'}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-mono block text-[10px] uppercase">Sound Master</span>
                  <span className="font-bold text-white">{selectedMovie.musicDirector?.soundFormat || 'Dolby Atmos'}</span>
                </div>
              </div>

              {/* Lead Cast Ensemble */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                  Lead Cast & Character Profiles
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedMovie.leadCast.map(actor => (
                    <div
                      key={actor.actorName}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3"
                    >
                      <img
                        src={actor.avatarUrl}
                        alt={actor.actorName}
                        className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{actor.actorName}</div>
                        <div className="text-[10px] text-amber-400 truncate font-mono">as {actor.characterName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer CTAs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    const m = selectedMovie;
                    setSelectedMovie(null);
                    setActiveTrailerMovie(m);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Trailer</span>
                </button>

                {selectedMovie.associatedEventId ? (
                  <Link
                    to={`/events?eventId=${selectedMovie.associatedEventId}`}
                    onClick={() => setSelectedMovie(null)}
                    className="px-6 py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider text-black flex items-center gap-2 transition hover:brightness-110 shadow-lg"
                    style={{ backgroundColor: currentSkinConfig.primary }}
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Book Pre-Release Tickets</span>
                  </Link>
                ) : (
                  <span className="text-xs text-gray-500 font-mono">
                    Theatrical Release: {selectedMovie.releaseDate}
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. CINEMATIC VIDEO TRAILER PLAYER MODAL */}
      {activeTrailerMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#070709] border border-white/20 rounded-3xl max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest">
                  Official Cinema Preview
                </span>
                <h3 className="text-lg font-cinematic font-bold text-white uppercase">
                  {activeTrailerMovie.title} — Official Teaser
                </h3>
              </div>
              <button
                onClick={() => setActiveTrailerMovie(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated 16:9 Cinema Player with high-definition styling */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
              <iframe
                src={activeTrailerMovie.trailerUrl}
                title={activeTrailerMovie.title}
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-1">
              <span>Projection: 4K HDR • 2.39:1 Cinemascope</span>
              <span>Audio: 7.1.4 Dolby Atmos Stem Preview</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
