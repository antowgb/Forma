import AsyncStorage from "@react-native-async-storage/async-storage";

// Temps de repos (heures)
export const RECOVERY_TIME: Record<string, number> = {
  Chest: 36, // récup moyenne, adaptés aux novices
  Back: 48, // gros groupe, mais pas besoin de 60h
  Legs: 60, // gros groupe + DOMS fréquents
  Shoulders: 36, // petite articulation
  Arms: 30, // récup très rapide
  Core: 24, // on peut travailler le core tous les jours
};

// Stockage interne en mémoire
let lastWorked: Record<string, number> = {};

const KEY = "recovery_last_worked";

// ----------------------------
// Charger depuis AsyncStorage
// ----------------------------
export async function loadRecovery() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      lastWorked = JSON.parse(raw);
    }
  } catch (e) {
    console.log("Error loading recovery:", e);
  }
  return lastWorked;
}

// Sauvegarde
async function saveRecovery() {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(lastWorked));
  } catch (e) {
    console.log("Error saving recovery:", e);
  }
}

// ----------------------------
// Vérifie si le muscle est prêt
// ----------------------------
export function isMuscleReady(muscle: string): boolean {
  const last = lastWorked[muscle];
  if (!last) return true;

  const hoursSince = (Date.now() - last) / 36e5;
  const required = RECOVERY_TIME[muscle] ?? 48;

  return hoursSince >= required;
}

// ----------------------------
// Temps restant en heures
// ----------------------------
export function recoveryRemaining(muscle: string): number {
  const last = lastWorked[muscle];
  if (!last) return 0;

  const hoursSince = (Date.now() - last) / 36e5;
  return Math.max(0, (RECOVERY_TIME[muscle] ?? 48) - hoursSince);
}

// ----------------------------
// Marquer un muscle comme travaillé
// ----------------------------
export async function markMuscleWorked(muscle: string) {
  lastWorked[muscle] = Date.now();
  await saveRecovery();
}

// Pour debug
export function _getRecoveryMap() {
  return lastWorked;
}

export async function resetRecovery() {
  Object.keys(RECOVERY_TIME).forEach((m) => {
    lastWorked[m] = 0;
  });
  await AsyncStorage.setItem(KEY, JSON.stringify(lastWorked));
}
