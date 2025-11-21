import { generateReps } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
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

type WorkoutGroupsListProps = {
  groups: Record<string, Exercise[]>;
};

export default function WorkoutGroupsList({ groups }: WorkoutGroupsListProps) {
  const clusterMap = Object.entries(groups).reduce(
    (acc: Record<string, { muscle: string; list: Exercise[] }[]>, [muscle, list]) => {
      if (list.length === 0) return acc;
      const cluster = MUSCLE_TO_CLUSTER[muscle] ?? muscle;
      (acc[cluster] ||= []).push({ muscle, list });
      return acc;
    },
    {}
  );

  const orderedClusters = [
    ...CLUSTER_ORDER.filter((cluster) => (clusterMap[cluster] ?? []).length > 0),
    ...Object.keys(clusterMap).filter(
      (cluster) => !CLUSTER_ORDER.includes(cluster) && (clusterMap[cluster]?.length ?? 0) > 0
    ),
  ];

  return (
    <View style={styles.exerciseList}>
      <ScrollView>
        {orderedClusters.map((cluster) => {
          const muscles = clusterMap[cluster] ?? [];
          if (muscles.length === 0) return null;

          return (
            <View key={cluster} style={styles.group}>
              <Text style={styles.clusterTitle}>{cluster}</Text>

              {muscles.map(({ muscle, list }) => (
                <View key={muscle} style={styles.muscleSection}>
                  <Text style={styles.muscleTitle}>{muscle}</Text>
                  {list.map((exercise) => (
                    <Text key={exercise.id} style={styles.item}>
                      {exercise.name} : {generateReps(exercise)}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseList: {
    height: 300,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    backgroundColor: COLORS.panel,
    ...SHADOWS.floating,
  },
  group: {
    marginBottom: SPACING.lg,
  },
  muscleSection: {
    marginBottom: SPACING.sm,
  },
  clusterTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  muscleTitle: {
    color: COLORS.subtext,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  item: {
    color: COLORS.text,
    fontSize: 15,
    marginVertical: SPACING.xs,
  },
});
