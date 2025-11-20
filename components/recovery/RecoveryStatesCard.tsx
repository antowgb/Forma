import { COLORS, SHADOWS } from "constants/Colors";
import { SPACING } from "constants/Spacing";
import { StyleSheet, Text, View } from "react-native";

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
  return (
    <View style={styles.card}>
      {data.map((item) => {
        const days = Math.floor(item.hoursLeft / 24);
        const hours = Math.round(item.hoursLeft % 24);
        let statusText = "Ready";

        if (!item.ready && item.hoursLeft > 0) {
          statusText =
            days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`;
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: SPACING.md,
    maxHeight: "70%",
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    padding: SPACING.lg,
    ...SHADOWS.floating,
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
    backgroundColor: COLORS.subtext + "40", // muted track so progress is visible
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    opacity: 0.9,
  },
});
