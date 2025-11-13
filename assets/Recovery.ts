// Temps de repos (heures) par muscle — simple
export const RECOVERY_TIME: Record<string, number> = {
  Chest: 48,
  Back: 60,
  Legs: 72,
  Shoulders: 48,
  Arms: 36,
  Core: 36,
};

// Stockage simple en mémoire (pas de base de données)
export const lastWorked: Record<string, number> = {};
// Exemple: lastWorked["Chest"] = 1699657234231

// Vérifie si le muscle est prêt
export function isMuscleReady(muscle: string): boolean {
  const last = lastWorked[muscle];
  if (!last) return true; // jamais travaillé → prêt
  const hoursSince = (Date.now() - last) / 36e5;
  return hoursSince >= (RECOVERY_TIME[muscle] ?? 48);
}

// Marque un muscle comme travaillé
export function markMuscleWorked(muscle: string) {
  lastWorked[muscle] = Date.now();
}
