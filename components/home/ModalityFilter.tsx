import { WorkoutModality } from "assets/GenerateWorkout";
import { pressableStyles } from "components/common/PressableStyles";
import { COLORS } from "constants/Colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
    <View style={styles.filters}>
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
  filters: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "40",
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
