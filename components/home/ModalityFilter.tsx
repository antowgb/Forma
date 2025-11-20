import { WorkoutModality } from "assets/GenerateWorkout";
import { pressableStyles } from "components/common/PressableStyles";
import { COLORS } from "constants/Colors";
import { Pressable, View, StyleSheet, Text } from "react-native";

type ModalityFilterProps = {
  value: WorkoutModality;
  onChange: (value: WorkoutModality) => void;
};

const OPTIONS: { value: WorkoutModality; label: string }[] = [
  { value: "both", label: "Both" },
  { value: "weight lifting", label: "Weight Lifting" },
  { value: "calisthenics", label: "Calisthenics" },
];

export default function ModalityFilter({
  value,
  onChange,
}: ModalityFilterProps) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={({ pressed }) => [
            styles.chip,
            value === option.value && styles.chipActive,
            pressed && pressableStyles.pressed,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              value === option.value && styles.chipTextActive,
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
  },
  chipActive: {
    backgroundColor: COLORS.accent,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 13,
  },
  chipTextActive: {
    color: COLORS.text,
    fontWeight: "700",
  },
});
