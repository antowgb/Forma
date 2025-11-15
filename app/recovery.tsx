import { Ionicons } from "@expo/vector-icons";
import BannerAdView from "components/ads/Banner";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  _getRecoveryMap,
  isMuscleReady,
  loadRecovery,
  resetRecovery,
} from "assets/Recovery";

import { COLORS } from "constants/Colors";

const MUSCLES = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

type RecoveryInfo = {
  ready: boolean;
  progress: number;
  hoursLeft: number;
  multiplier: number;
};

type SortMode = "alpha" | "readySoon";

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: "alpha", label: "A → Z" },
  { key: "readySoon", label: "Ready Soon" },
];

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
  const refreshData = useCallback(() => setData(buildRecoverySnapshot()), []);

  // Charger la recovery au montage
  useEffect(() => {
    loadRecovery().then(() => refreshData());
  }, [refreshData]);

  async function onReset() {
    await resetRecovery();
    refreshData();
  }

  const sortedData = useMemo(() => {
    const base = [...data];
    if (sortMode === "readySoon") {
      return base.sort((a, b) => {
        if (a.ready !== b.ready) {
          return Number(a.ready) - Number(b.ready);
        }
        return a.hoursLeft - b.hoursLeft;
      });
    }
    return base.sort((a, b) => a.muscle.localeCompare(b.muscle));
  }, [data, sortMode]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Recovery</Text>

          <Pressable
            style={({ pressed }) => [
              styles.reloadButton,
              pressed && styles.pressablePressed,
            ]}
            onPress={onReset}
          >
            <Ionicons name="reload" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        <View style={styles.sortRow}>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              onPress={() => setSortMode(option.key)}
              style={({ pressed }) => [
                styles.sortChip,
                sortMode === option.key && styles.sortChipActive,
                pressed && styles.pressablePressed,
              ]}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortMode === option.key && styles.sortChipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <ScrollView>
            {sortedData.map((item) => {
              const days = Math.floor(item.hoursLeft / 24);
              const hours = Math.round(item.hoursLeft % 24);

              let statusText = "Ready";
              if (!item.ready && item.hoursLeft > 0) {
                statusText =
                  days > 0
                    ? `${days}d ${hours}h remaining`
                    : `${hours}h remaining`;
              }

              return (
                <View key={item.muscle} style={styles.state}>
                  <View style={styles.rowHeader}>
                    <Text style={styles.muscle}>{item.muscle}</Text>
                    <Text style={[styles.status, item.ready && styles.ready]}>
                      {statusText}
                    </Text>
                  </View>

                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.round(item.progress * 100)}%`,
                          opacity: item.ready ? 1 : 0.7,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.row}>
          <Link href="/workouts" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.pressablePressed,
              ]}
            >
              <Text style={styles.linkText}>Workouts</Text>
            </Pressable>
          </Link>
          <Link href="/" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.pressablePressed,
              ]}
            >
              <Text style={styles.linkText}>Home</Text>
            </Pressable>
          </Link>
        </View>

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
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "800",
  },
  reloadButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  debugText: {
    color: COLORS.text,
    fontSize: 14,
  },
  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "40",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  sortChipActive: {
    backgroundColor: COLORS.accent,
  },
  sortChipText: {
    color: COLORS.text,
    fontSize: 13,
  },
  sortChipTextActive: {
    color: COLORS.background,
    fontWeight: "700",
  },
  card: {
    marginVertical: 12,
    maxHeight: 380,
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "55",
    padding: 16,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  state: {
    marginBottom: 14,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  muscle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
  status: {
    color: COLORS.subtext,
    fontSize: 13,
  },
  ready: {
    color: COLORS.accent,
    fontWeight: "600",
  },
  barBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.panel,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.accent,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  linkButton: {
    width: "48%",
    marginTop: 10,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  linkText: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  pressablePressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },
  bannerPlaceholder: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.accent,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.panel + "40",
  },
  bannerText: {
    color: COLORS.text + "99",
    fontSize: 14,
    letterSpacing: 0.6,
  },
});
