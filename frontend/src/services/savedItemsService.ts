/**
 * CineVantaara Saved Bookmarks Service (Phase 5: Item 30)
 * Manages persistent bookmarks for Talents, Production Opportunities, and Movies.
 */

import { User, Opportunity } from '../types';
import { Movie } from './movieService';

const SAVED_TALENTS_KEY = 'cv_saved_talents';
const SAVED_OPPS_KEY = 'cv_saved_opportunities';
const SAVED_MOVIES_KEY = 'cv_saved_movies';

export function getSavedTalents(): User[] {
  try {
    const raw = localStorage.getItem(SAVED_TALENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isTalentSaved(userId: string): boolean {
  const talents = getSavedTalents();
  return talents.some(t => t.id === userId);
}

export function toggleSaveTalent(user: User): boolean {
  const talents = getSavedTalents();
  const exists = talents.some(t => t.id === user.id);
  let updated: User[];
  if (exists) {
    updated = talents.filter(t => t.id !== user.id);
  } else {
    updated = [user, ...talents];
  }
  localStorage.setItem(SAVED_TALENTS_KEY, JSON.stringify(updated));
  return !exists;
}

export function getSavedOpportunities(): Opportunity[] {
  try {
    const raw = localStorage.getItem(SAVED_OPPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isOpportunitySaved(oppId: string): boolean {
  const opps = getSavedOpportunities();
  return opps.some(o => o.id === oppId);
}

export function toggleSaveOpportunity(opp: Opportunity): boolean {
  const opps = getSavedOpportunities();
  const exists = opps.some(o => o.id === opp.id);
  let updated: Opportunity[];
  if (exists) {
    updated = opps.filter(o => o.id !== opp.id);
  } else {
    updated = [opp, ...opps];
  }
  localStorage.setItem(SAVED_OPPS_KEY, JSON.stringify(updated));
  return !exists;
}

export function getSavedMovies(): Movie[] {
  try {
    const raw = localStorage.getItem(SAVED_MOVIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isMovieSaved(movieId: string): boolean {
  const movies = getSavedMovies();
  return movies.some(m => m.id === movieId);
}

export function toggleSaveMovie(movie: Movie): boolean {
  const movies = getSavedMovies();
  const exists = movies.some(m => m.id === movie.id);
  let updated: Movie[];
  if (exists) {
    updated = movies.filter(m => m.id !== movie.id);
  } else {
    updated = [movie, ...movies];
  }
  localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updated));
  return !exists;
}
