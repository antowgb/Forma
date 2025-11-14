import AsyncStorage from "@react-native-async-storage/async-storage";

let favorites: Record<string, boolean> = {};

const KEY = "favorites_exercises";

// Charger depuis AsyncStorage
export async function loadFavorites() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) favorites = JSON.parse(raw);
  } catch (e) {
    console.log("Failed to load favorites", e);
  }
  return favorites;
}

// Sauvegarder
async function saveFavorites() {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(favorites));
  } catch (e) {
    console.log("Failed to save favorites", e);
  }
}

// Getter simple
export function getFavorites() {
  return favorites;
}

// Basculer un favori
export async function toggleFavorite(id: string) {
  favorites[id] = !favorites[id];
  await saveFavorites();
  return favorites;
}
