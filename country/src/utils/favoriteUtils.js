const FAVORITES_KEY_PREFIX = "favoriteCountries_";

function getCurrentUsername() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.username || null;
}

export function getFavoriteCountries() {
  const username = getCurrentUsername();
  if (!username) return [];

  const stored = localStorage.getItem(FAVORITES_KEY_PREFIX + username);
  return stored ? JSON.parse(stored) : [];
}

export function toggleFavoriteCountry(code) {
  const username = getCurrentUsername();
  if (!username) return [];

  const key = FAVORITES_KEY_PREFIX + username;
  const current = getFavoriteCountries();
  let updated;

  if (current.includes(code)) {
    updated = current.filter(c => c !== code);
  } else {
    updated = [...current, code];
  }

  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}

export function isFavorite(code) {
  return getFavoriteCountries().includes(code);
}
