import { EXERCISES } from "assets/Exercises";
import { getFavorites } from "assets/Favorites";
import { isMuscleReady } from "assets/Recovery";
import { Exercise } from "./Types";

const favs = getFavorites();

// modalité préférée (simple pour l’instant)
export const userModality = "muscu"; // plus tard: réglage utilisateur

// ---------------------------
//  Génère les reps pour un exercice
// ---------------------------
export function generateReps(ex: Exercise) {
  if (ex.muscle === "Core") {
    return "3 × 30 sec";
  }

  if (ex.intensity === 3) {
    return "4 × 8";
  }

  if (ex.modality === "calisthenics") {
    return "3 × 12";
  }

  if (ex.modality === "muscu") {
    return "3 × 10";
  }

  return "3 × 12";
}

// ---------------------------
//  Algorithme intelligent
// ---------------------------
export function generateWorkout(durationMinutes: number) {
  // Étape 1 : noter les muscles prêts
  const readyMuscles = [
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core",
  ].filter(isMuscleReady);

  const noMuscleReady = readyMuscles.length === 0;

  // Étape 2 : attribuer un score à chaque exercice
  const scored = EXERCISES.map((ex: Exercise) => {
    // 👈 type ici
    let s = 0;

    if (readyMuscles.includes(ex.muscle)) s += 100;
    if (ex.modality === userModality || ex.modality === "both") s += 20;
    s += Math.max(0, 20 - ex.estMinutes);
    // 4. Favoris → priorité très haute
    if (favs[ex.id]) s += 80;

    // 5. Bonus léger random (= variété)
    s += Math.random() * 10;

    return { ex, score: s };
  });

  // Étape 3 : trier par score
  scored.sort((a, b) => b.score - a.score);

  // Étape 4 : remplir jusqu’à la durée demandée
  const chosen: Exercise[] = [];
  const usedMuscles: Set<string> = new Set(); // 👈 muscles déjà utilisés
  let total = 0;

  for (const { ex } of scored) {
    if (total + ex.estMinutes > durationMinutes) continue;

    // Vérifier si on peut ajouter ce muscle
    const muscle = ex.muscle;

    // Si nouveau muscle mais on en a déjà 3 → on skip
    if (!usedMuscles.has(muscle) && usedMuscles.size >= 3) continue;

    // Si muscle pas prêt → skip (sauf fallback)
    if (!noMuscleReady && !readyMuscles.includes(muscle)) continue;

    // Ajouter l'exercice
    chosen.push(ex);
    usedMuscles.add(muscle);
    total += ex.estMinutes;

    // Arrêter si la durée est quasi remplie
    if (total >= durationMinutes - 5) break;
  }

  // Fallback : rien n'est prêt → proposer le top 3
  if (chosen.length === 0) {
    return {
      exercises: scored.slice(0, 3).map((x) => x.ex),
      notice: "Repos conseillé — aucun muscle prêt",
    };
  }

  return { exercises: chosen, notice: "" };
}

// même type que le retour de generateWorkout
type WorkoutResult = {
  exercises: Exercise[];
  notice: string;
};

// 🧠 petit cache en mémoire : clé = durée, valeur = (date + workout)
const dailyCache: Record<number, { date: string; result: WorkoutResult }> = {};

// retourne la date du jour au format "YYYY-MM-DD"
function todayKey() { 
  return new Date().toISOString().slice(0, 10);
}

// 👉 fonction à utiliser dans l'app
export function getDailyWorkout(
  durationMinutes: number,
  forceNew: boolean = false
): WorkoutResult {
  const key = durationMinutes;
  const today = todayKey();

  const cached = dailyCache[key];

  // si on NE force PAS et qu'on a un cache pour aujourd'hui → on le réutilise
  if (!forceNew && cached && cached.date === today) {
    return cached.result;
  }

  // sinon on génère un nouveau workout et on écrase le cache du jour
  const result = generateWorkout(durationMinutes);
  dailyCache[key] = { date: today, result };

  return result;
}
