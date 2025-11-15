import { COLORS } from "constants/Colors";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
      <ScrollView>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
