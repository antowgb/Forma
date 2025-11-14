import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RECOVERY_TIME, isMuscleReady, lastWorked } from "assets/Recovery";
import { COLORS } from "constants/Colors";

const MUSCLES = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

function computeRecovery(muscle: string) {
  const base = RECOVERY_TIME[muscle] ?? 48;
  const last = lastWorked[muscle];

  if (!last) {
    return {
      ready: true,
      progress: 1, // 100%
      hoursLeft: 0,
    };
  }

  const hoursSince = (Date.now() - last) / 36e5;
  const ratio = Math.min(hoursSince / base, 1);
  const hoursLeft = Math.max(0, base - hoursSince);

  return {
    ready: isMuscleReady(muscle),
    progress: ratio, // entre 0 et 1
    hoursLeft,
  };
}

export default function RecoveryScreen() {
  const data = useMemo(
    () =>
      MUSCLES.map((m) => ({
        muscle: m,
        ...computeRecovery(m),
      })),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#060708", "#0B0F12", "#120606"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Recovery</Text>
        <Text style={styles.subtitle}>Based on your last workouts</Text>

        <View style={styles.card}>
          <ScrollView>
            {data.map((item) => {
              const days = Math.floor(item.hoursLeft / 24);
              const hours = Math.round(item.hoursLeft % 24);

              let statusText = "Ready";
              if (!item.ready && item.hoursLeft > 0) {
                if (days > 0) {
                  statusText = `${days} j ${hours} h restants`;
                } else {
                  statusText = `${hours} h restantes`;
                }
              }

              return (
                <View key={item.muscle} style={styles.state}>
                  {/* Titre muscle + statut */}
                  <View style={styles.rowHeader}>
                    <Text style={styles.muscle}>{item.muscle}</Text>
                    <Text style={[styles.status, item.ready && styles.ready]}>
                      {statusText}
                    </Text>
                  </View>

                  {/* Barre de progression */}
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
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>Workouts</Text>
            </Pressable>
          </Link>
          <Link href="/" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>Home</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  card: {
    marginVertical: 12,
    maxHeight: 350,
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "55",
    padding: 16,
  },
  state: {
    marginBottom: 14,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
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
    marginVertical: 12,
  },
  linkButton: {
    width: "48%",
    marginTop: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  linkText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
  },
});
