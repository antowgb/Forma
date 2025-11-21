import { COLORS, SHADOWS } from "constants/Colors";
import { RADIUS } from "constants/Radius";
import { SPACING } from "constants/Spacing";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const MUSCLE_TO_CLUSTER: Record<string, string> = {
  Quads: "Legs",
  Hamstrings: "Legs",
  Calves: "Legs",
  "Upper Back": "Back",
  Lats: "Back",
  "Lower Back": "Back",
  "Upper Chest": "Chest",
  "Lower Chest": "Chest",
  "Front Deltoid": "Shoulders",
  "Lateral Deltoid": "Shoulders",
  "Rear Deltoid": "Shoulders",
  Biceps: "Arms",
  Triceps: "Arms",
  Forearms: "Arms",
  Glutes: "Core",
  Abs: "Core",
};

const CLUSTER_ORDER = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core"];

type RecoveryState = {
  muscle: string;
  ready: boolean;
  progress: number;
  hoursLeft: number;
};

type RecoveryStatesCardProps = {
  data: RecoveryState[];
};

export default function RecoveryStatesCard({ data }: RecoveryStatesCardProps) {
  const clustersWithItems = CLUSTER_ORDER.filter((cluster) =>
    data.some((item) => MUSCLE_TO_CLUSTER[item.muscle] === cluster)
  );

  return (
    <View style={styles.card}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {clustersWithItems.map((cluster, index) => {
          const items = data.filter(
            (item) => MUSCLE_TO_CLUSTER[item.muscle] === cluster
          );

          return (
            <View key={cluster} style={styles.clusterWrapper}>
              <View style={styles.clusterSection}>
                <Text style={styles.clusterTitle}>{cluster}</Text>
                {items.map((item) => {
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
                        <Text
                          style={[styles.status, item.ready && styles.ready]}
                        >
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
              </View>
              {index < clustersWithItems.length - 1 ? (
                <View style={styles.clusterDivider} />
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: SPACING.md,
    maxHeight: "65%",
    flex: 1,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    padding: SPACING.lg,
    ...SHADOWS.floating,
  },
  clusterSection: {
    marginBottom: SPACING.xl,
  },
  clusterWrapper: {
    marginBottom: SPACING.lg,
  },
  clusterDivider: {
    height: 2,
    backgroundColor: COLORS.text + "20",
    marginVertical: SPACING.sm,
  },
  clusterTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  state: {
    marginBottom: SPACING.lg,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: SPACING.lg,
  },
  muscle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "600",
  },
  status: {
    color: COLORS.subtext,
    fontSize: 14,
  },
  ready: {
    color: COLORS.accent,
    fontWeight: "600",
  },
  barBackground: {
    height: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.subtext + "40",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.accent,
    opacity: 0.9,
  },
});
