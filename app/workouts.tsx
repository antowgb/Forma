import { EXERCISES } from "assets/Exercises";
import { loadFavorites, toggleFavorite } from "assets/Favorites"; // �Y'^ import
import { Exercise } from "assets/Types";
import BannerAdView from "components/ads/Banner";
import NavLinkRow from "components/common/NavLinkRow";
import ScreenHeader from "components/common/ScreenHeader";
import Filters from "components/workouts/Filters";
import WorkoutGroups from "components/workouts/WorkoutGroups";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MUSCLES = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"] as const;
type FilterMode = "all" | "weight lifting" | "calisthenics";

export default function WorkoutsScreen() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // �Y"� charger les favoris au montage
  useEffect(() => {
    loadFavorites().then((f) => setFavorites({ ...f }));
  }, []);

  // �Y"� basculer un favori + mettre �� jour le state
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <ScreenHeader title="Workouts" />

        {/* Filtres */}
        <Filters active={filter} onChange={setFilter} />

        {/* Liste des exercices */}
        <WorkoutGroups
          muscles={MUSCLES}
          groups={groups}
          favorites={favorites}
          onToggle={onToggle}
        />

        <NavLinkRow
          links={[
            { href: "/", label: "Home" },
            { href: "/recovery", label: "Recovery" },
          ]}
        />

        <BannerAdView />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
    paddingBottom: 48,
  },
});
