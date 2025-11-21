import { generateReps } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
import { COLORS, SHADOWS } from "constants/Colors";
import { RADIUS } from "constants/Radius";
import { SPACING } from "constants/Spacing";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type WorkoutGroupsListProps = {
  groups: Record<string, Exercise[]>;
};

export default function WorkoutGroupsList({ groups }: WorkoutGroupsListProps) {
  return (
    <View style={styles.exerciseList}>
      <ScrollView>
        {Object.entries(groups).map(([muscle, list]) => (
          <View key={muscle} style={styles.group}>
            <Text style={styles.muscleTitle}>{muscle}</Text>

            {list.map((exercise) => (
              <Text key={exercise.id} style={styles.item}>
                {exercise.name} : {generateReps(exercise)}
              </Text>
            ))}
          </View>
        ))}
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
  muscleTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  item: {
    color: COLORS.text,
    fontSize: 16,
    marginVertical: SPACING.xs,
  },
});
