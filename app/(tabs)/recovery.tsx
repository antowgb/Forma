import { useFocusEffect } from "@react-navigation/native";
import Dropdown, { DropdownOption } from "components/common/Dropdown";
import ScreenHeader from "components/common/ScreenHeader";
import RecoveryStatesCard from "components/recovery/RecoveryStatesCard";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SPACING } from "constants/Spacing";

import {
  _getRecoveryMap,
  isMuscleReady,
  loadRecovery,
  resetRecovery,
} from "assets/Recovery";

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
];
const CLUSTERS = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core"] as const;
type ClusterFilter = (typeof CLUSTERS)[number] | "All";
const ALL = "All";

type RecoveryInfo = {
  ready: boolean;
  progress: number;
  hoursLeft: number;
  multiplier: number;
};

type SortMode = "alpha" | "readySoon";
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

const SORT_OPTIONS: DropdownOption<SortMode>[] = [
  { value: "alpha", label: "A - Z" },
  { value: "readySoon", label: "Ready Soon" },
];

const REFRESH_INTERVAL_MS = 30_000;

function computeRecovery(muscle: string): RecoveryInfo {
  const entry = _getRecoveryMap()[muscle];
  const multiplier = entry?.multiplier ?? 1;
  const start = entry?.start ?? 0;
  const end = entry?.end ?? 0;
  const now = Date.now();

  if (!start || !end || end <= now) {
    return {
      ready: true,
      progress: 1,
      hoursLeft: 0,
      multiplier,
    };
  }

  const duration = Math.max(end - start, 1);
  const elapsed = Math.min(Math.max(0, now - start), duration);
  const progress = Math.min(1, elapsed / duration);
  const hoursLeft = Math.max(0, (end - now) / 36e5);

  return {
    ready: isMuscleReady(muscle),
    progress,
    hoursLeft,
    multiplier,
  };
}

const buildRecoverySnapshot = () =>
  MUSCLES.map((muscle) => ({
    muscle,
    ...computeRecovery(muscle),
  }));

export default function RecoveryScreen() {
  const [data, setData] = useState(buildRecoverySnapshot);
  const [sortMode, setSortMode] = useState<SortMode>("alpha");
  const [clusterFilter, setClusterFilter] = useState<ClusterFilter>(ALL);
  const refreshData = useCallback(() => setData(buildRecoverySnapshot()), []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadRecovery().then(() => {
        if (active) {
          refreshData();
        }
      });

      return () => {
        active = false;
      };
    }, [refreshData])
  );

  useFocusEffect(
    useCallback(() => {
      const id = setInterval(() => {
        refreshData();
      }, REFRESH_INTERVAL_MS);
      return () => clearInterval(id);
    }, [refreshData])
  );

  async function onReset() {
    await resetRecovery();
    refreshData();
  }

  const filteredData = useMemo(() => {
    if (clusterFilter === ALL) return data;
    return data.filter(
      (entry) => muscleCluster(entry.muscle) === clusterFilter
    );
  }, [data, clusterFilter]);

  const sortedData = useMemo(() => {
    const base = [...filteredData];
    if (sortMode === "readySoon") {
      return base.sort((a, b) => {
        if (a.ready !== b.ready) {
          return Number(a.ready) - Number(b.ready);
        }
        return a.hoursLeft - b.hoursLeft;
      });
    }
    return base.sort((a, b) => a.muscle.localeCompare(b.muscle));
  }, [filteredData, sortMode]);

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
        <ScreenHeader title="Recovery" onReload={onReset} />

        <Dropdown
          label="Sort by"
          value={sortMode}
          options={SORT_OPTIONS}
          onSelect={setSortMode}
        />
        <Dropdown
          label="Muscle group"
          value={clusterFilter}
          options={clusterOptions}
          onSelect={setClusterFilter}
        />

        <RecoveryStatesCard data={sortedData} />
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
