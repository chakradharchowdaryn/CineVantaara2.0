export interface MovieCastMember {
  actorName: string;
  characterName: string;
  avatarUrl: string;
  profileId?: string;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string; // YouTube embed or video URL
  rating: number;
  votes: number;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'UPCOMING_PREMIERE' | 'FESTIVAL_SELECTION' | 'OTT_EXCLUSIVE';
  genres: string[];
  languages: string[];
  durationMinutes: number;
  censorRating: string;
  format: 'IMAX 70MM' | '4K DOLBY CINEMA' | '35MM FILM VAULT' | 'STANDARD DIGITAL';
  director: {
    name: string;
    profileId?: string;
    avatarUrl?: string;
  };
  producer: {
    name: string;
    studio: string;
    profileId?: string;
  };
  cinematographer?: {
    name: string;
    rig: string;
  };
  musicDirector?: {
    name: string;
    soundFormat: string;
  };
  leadCast: MovieCastMember[];
  boxOfficeForecast?: string;
  associatedEventId?: string;
}

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'mv-001',
    title: 'Kalki 2898 AD: Chapter 2',
    tagline: 'When the prophecy wakes, the cosmic war begins.',
    synopsis: 'In a dystopian mythological future where water and resources are monopolized by the Supreme Complex, Bhairava and Ashwatthama unite across time cycles to protect the divine heir and reclaim humanity’s freedom.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    rating: 9.6,
    votes: 48200,
    releaseDate: '2026-12-18',
    status: 'UPCOMING_PREMIERE',
    genres: ['Sci-Fi', 'Mythology', 'Action', 'Epic'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'English'],
    durationMinutes: 182,
    censorRating: 'U/A 16+',
    format: 'IMAX 70MM',
    director: {
      name: 'Nag Ashwin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    producer: {
      name: 'Vyjayanthi Movies',
      studio: 'Vyjayanthi Cinematic Citadel'
    },
    cinematographer: {
      name: 'Djordje Stojiljkovic',
      rig: 'ARRI Alexa 65 Large Format'
    },
    musicDirector: {
      name: 'Santhosh Narayanan',
      soundFormat: '7.1.4 Dolby Atmos Surround'
    },
    leadCast: [
      {
        actorName: 'Prabhas',
        characterName: 'Bhairava',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
      },
      {
        actorName: 'Amitabh Bachchan',
        characterName: 'Ashwatthama',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
      },
      {
        actorName: 'Kamal Haasan',
        characterName: 'Supreme Yaskin',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
      }
    ],
    boxOfficeForecast: '₹1,500 Cr Global Projection',
    associatedEventId: 'evt-kalki-premiere'
  },
  {
    id: 'mv-002',
    title: 'Vantaara: Whispers of the Blackwood',
    tagline: 'Some forests do not welcome cinema crews.',
    synopsis: 'A maverick documentary crew ventures into the forbidden rain-canopy of Western Ghats to investigate vanishing tribal legends, only to find the forest rearranging its topography around their camera lenses.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    rating: 9.2,
    votes: 14500,
    releaseDate: '2026-11-28',
    status: 'FESTIVAL_SELECTION',
    genres: ['Psychological Thriller', 'Folk Horror', 'Mystery'],
    languages: ['Telugu', 'Malayalam', 'Kannada'],
    durationMinutes: 144,
    censorRating: 'A',
    format: '35MM FILM VAULT',
    director: {
      name: 'Kiran Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    },
    producer: {
      name: 'CineVantaara Studio Originals',
      studio: 'CineVantaara Pictures'
    },
    cinematographer: {
      name: 'Ravi Varma',
      rig: 'RED V-Raptor 8K VV'
    },
    musicDirector: {
      name: 'AR Rahman Sound Labs',
      soundFormat: 'Acoustic Foley & Binaural Spatial'
    },
    leadCast: [
      {
        actorName: 'Aditi Rao',
        characterName: 'Meera (Field Director)',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
      },
      {
        actorName: 'Vikram Menon',
        characterName: 'Eshwar (Sound Recordist)',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80'
      }
    ],
    boxOfficeForecast: 'Cannes Critic’s Week Award Winner',
    associatedEventId: 'evt-vantaara-launch'
  },
  {
    id: 'mv-003',
    title: 'Salaar Part 2: Shouryaanga Parvam',
    tagline: 'Bloodlines forgotten. Crowns claimed in ash.',
    synopsis: 'The tribal lords of Khansaar prepare for the ultimate civil conflict as Deva uncovers the ancient deception that eradicated the Shouryaanga dynasty.',
    posterUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    rating: 9.4,
    votes: 39100,
    releaseDate: '2026-11-20',
    status: 'NOW_SHOWING',
    genres: ['Action', 'Crime Drama', 'Noir'],
    languages: ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'],
    durationMinutes: 175,
    censorRating: 'A',
    format: '4K DOLBY CINEMA',
    director: {
      name: 'Prashanth Neel',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
    },
    producer: {
      name: 'Hombale Films',
      studio: 'Hombale Cinematic Escrow'
    },
    cinematographer: {
      name: 'Bhuvan Gowda',
      rig: 'Arri Alexa Mini LF'
    },
    musicDirector: {
      name: 'Ravi Basrur',
      soundFormat: 'Heavy Percussion Atmos Mix'
    },
    leadCast: [
      {
        actorName: 'Prabhas',
        characterName: 'Deva / Shouryaanga',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
      },
      {
        actorName: 'Prithviraj Sukumaran',
        characterName: 'Varadha Raja Mannar',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
      }
    ],
    boxOfficeForecast: 'Day 1 All-Time Record ₹175 Cr',
    associatedEventId: 'evt-salaar-fanmeet'
  },
  {
    id: 'mv-004',
    title: 'Neon Varanasi: 2077',
    tagline: 'Ancient ghats. Cybernetic souls.',
    synopsis: 'A rogue neural archivist unearths an encrypted Vedic algorithm beneath the ancient Manikarnika ghat, triggering a manhunt across high-altitude flying barges and subterranean cyber corridors.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1800&q=80',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    rating: 8.9,
    votes: 9800,
    releaseDate: '2027-01-15',
    status: 'UPCOMING_PREMIERE',
    genres: ['Cyberpunk', 'Sci-Fi', 'Philosophical Noir'],
    languages: ['Hindi', 'English', 'Telugu'],
    durationMinutes: 135,
    censorRating: 'U/A 16+',
    format: '4K DOLBY CINEMA',
    director: {
      name: 'Anand Gandhi',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    producer: {
      name: 'MemeSys Studio Lab',
      studio: 'MemeSys Culture Lab'
    },
    leadCast: [
      {
        actorName: 'Jim Sarbh',
        characterName: 'Dr. Kabir Sen',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
      },
      {
        actorName: 'Sobhita Dhulipala',
        characterName: 'Tara (Replicant Priestess)',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
      }
    ],
    boxOfficeForecast: 'Venice Film Festival Golden Lion Contender'
  }
];

export function getStoredMovies(): Movie[] {
  try {
    const raw = localStorage.getItem('cv_platform_movies');
    if (!raw) {
      localStorage.setItem('cv_platform_movies', JSON.stringify(INITIAL_MOVIES));
      return INITIAL_MOVIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOVIES;
  } catch (e) {
    return INITIAL_MOVIES;
  }
}

export function saveMovie(movie: Movie): Movie {
  const current = getStoredMovies();
  const existingIdx = current.findIndex(m => m.id === movie.id);
  let updated: Movie[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = movie;
  } else {
    updated = [movie, ...current];
  }
  try {
    localStorage.setItem('cv_platform_movies', JSON.stringify(updated));
  } catch (e) {}
  return movie;
}

export function deleteMovie(id: string): boolean {
  const current = getStoredMovies();
  const next = current.filter(m => m.id !== id);
  try {
    localStorage.setItem('cv_platform_movies', JSON.stringify(next));
    return true;
  } catch (e) {
    return false;
  }
}
