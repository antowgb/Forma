import { EXERCISES } from "assets/Exercises";
import { loadFavorites, toggleFavorite } from "assets/Favorites";
import { Exercise } from "assets/Types";
import Dropdown, { DropdownOption } from "components/common/Dropdown";
import ScreenHeader from "components/common/ScreenHeader";
import WorkoutGroups from "components/workouts/WorkoutGroups";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SPACING } from "constants/Spacing";

const MUSCLES = [
  "Quads",
  "Hamstrings",
  "Calves",
  "Upper Back",
  "Lats",
  "Lower Back",
  "Upper Chest",
  "Lower Chest",
  "Front Deltoid",
  "Lateral Deltoid",
  "Rear Deltoid",
  "Biceps",
  "Triceps",
  "Forearms",
  "Core",
] as const;
const CLUSTERS = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core"] as const;
type ClusterFilter = (typeof CLUSTERS)[number] | "All";
const ALL = "All";
type FilterMode = "all" | "weight lifting" | "calisthenics";
const FILTER_OPTIONS: DropdownOption<FilterMode>[] = [
  { value: "all", label: "All" },
  { value: "weight lifting", label: "Weight Lifting" },
  { value: "calisthenics", label: "Calisthenics" },
];

function muscleCluster(muscle: string) {
  if (["Quads", "Hamstrings", "Calves"].includes(muscle)) return "Legs";
  if (["Upper Back", "Lats", "Lower Back"].includes(muscle)) return "Back";
  if (["Upper Chest", "Lower Chest"].includes(muscle)) return "Chest";
  if (
    ["Front Deltoid", "Lateral Deltoid", "Rear Deltoid"].includes(muscle)
  )
    return "Shoulders";
  if (["Biceps", "Triceps", "Forearms"].includes(muscle)) return "Arms";
  return "Core";
}

export default function WorkoutsScreen() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [clusterFilter, setClusterFilter] = useState<ClusterFilter>(ALL);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Charger les favoris au montage
  useEffect(() => {
    loadFavorites().then((f) => setFavorites({ ...f }));
  }, []);

  // Toggle favorite
  async function onToggle(id: string) {
    const updated = await toggleFavorite(id);
    setFavorites({ ...updated });
  }

  // Filtrage simple
  const filtered = useMemo(() => {
    return EXERCISES.filter((ex) => {
      if (filter === "all") return true;
      if (filter === "weight lifting") return ex.modality === "weight lifting";
      if (filter === "calisthenics")
        return ex.modality === "calisthenics" || ex.modality === "both";
      return true;
    });
  }, [filter]);

  // Groupé par muscle
  const groups = useMemo(() => {
    const acc: Record<string, Exercise[]> = {};
    filtered.forEach((ex) => {
      if (!acc[ex.muscle]) acc[ex.muscle] = [];
      acc[ex.muscle].push(ex);
    });
    return acc;
  }, [filtered]);

  const filteredMuscles = useMemo(() => {
    if (clusterFilter === ALL) return MUSCLES;
    return MUSCLES.filter((muscle) => muscleCluster(muscle) === clusterFilter);
  }, [clusterFilter]);

  const clusterOptions: DropdownOption<ClusterFilter>[] = [
    { value: ALL, label: "All groups" },
    ...CLUSTERS.map((c) => ({ value: c, label: c })),
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <ScreenHeader title="Workouts" />

        {/* Filtres */}
        <Dropdown
          label="Modality"
          value={filter}
          options={FILTER_OPTIONS}
          onSelect={setFilter}
        />
        <Dropdown
          label="Muscle group"
          value={clusterFilter}
          options={clusterOptions}
          onSelect={setClusterFilter}
        />

        {/* Liste des exercices */}
        <WorkoutGroups
          muscles={filteredMuscles}
          groups={groups}
          favorites={favorites}
          onToggle={onToggle}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    gap: SPACING.md,
  },
});
