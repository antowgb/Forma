import { usePrefs } from "assets/Store/Preferences";
import { useRecovery } from "assets/Store/Recovery";
import { Exercise, Modality, Muscle } from "assets/Types";

const MUSCLES: Muscle[] = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
];

const scoreExercise = (
  e: Exercise,
  readySet: Set<Muscle>,
  modalityPref: Modality,
  favorites: Record<string, true>
) => {
  let s = 0;
  // 1) disponibilité du muscle
  s += readySet.has(e.muscle) ? 100 : 0;
  // 2) favori
  s += favorites[e.id] ? 30 : 0;
  // 3) modalité
  if (modalityPref === "auto" || e.modality === "both") s += 10;
  else if (e.modality === modalityPref) s += 20;
  // 4) compacité (exos courts)
  s += Math.max(0, 30 - Math.min(30, e.estMinutes));
  return s;
};

export function generateWorkout(all: Exercise[]) {
  const { modalityPref, favorites, hidden, durationPref, equipment } =
    usePrefs.getState();
  const rec = useRecovery.getState();

  // filtrage équipement & hidden
  const cands = all.filter((e) => {
    if (hidden[e.id]) return false;
    if (equipment === "none" && e.equipment !== "none") return false;
    if (equipment === "basic" && e.equipment === "gym") return false;
    return true;
  });

  const ready = new Set<Muscle>(MUSCLES.filter((m) => rec.isReady(m)));

  const scored = cands
    .map((e) => ({
      e,
      score: scoreExercise(e, ready, modalityPref, favorites),
    }))
    .sort((a, b) => b.score - a.score);

  // Glouton + diversité (max 2 par muscle)
  const picks: Exercise[] = [];
  let total = 0;
  const perMuscle: Record<Muscle, number> = {
    Chest: 0,
    Back: 0,
    Legs: 0,
    Shoulders: 0,
    Arms: 0,
    Core: 0,
  };

  for (const { e } of scored) {
    if (total + e.estMinutes > durationPref) continue;
    if (!ready.has(e.muscle) && ready.size > 0) continue; // privilégier muscles prêts
    if (perMuscle[e.muscle] >= 2) continue; // diversité
    picks.push(e);
    total += e.estMinutes;
    perMuscle[e.muscle]++;
    if (total >= durationPref - 5) break;
  }

  let notice: string | undefined;

  // Fallback : aucun muscle prêt → on prend ceux qui seront prêts plus tôt
  if (picks.length === 0) {
    const near = cands
      .map((e) => ({ e, rest: rec.restHoursRemaining(e.muscle) }))
      .sort((a, b) => a.rest - b.rest);
    for (const { e } of near) {
      if (total + e.estMinutes > durationPref) continue;
      if (perMuscle[e.muscle] >= 2) continue;
      picks.push(e);
      total += e.estMinutes;
      perMuscle[e.muscle]++;
      if (total >= durationPref - 5) break;
    }
    notice = "Repos conseillé, aucun muscle prêt";
  }

  return { exercises: picks, totalMinutes: total, notice };
}
