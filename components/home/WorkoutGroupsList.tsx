import { generateReps } from "assets/GenerateWorkout";
import { Exercise } from "assets/Types";
import { COLORS } from "constants/Colors";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type WorkoutGroupsListProps = {
  groups: Record<string, Exercise[]>;
};

export default function WorkoutGroupsList({
  groups,
}: WorkoutGroupsListProps) {
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
    marginVertical: 8,
    height: 300,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.panel + "50",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  group: {
    marginBottom: 14,
  },
  muscleTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  item: {
    color: COLORS.text,
    fontSize: 16,
    marginVertical: 2,
  },
});
