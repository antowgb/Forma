import { COLORS } from "constants/Colors";
import { SPACING } from "constants/Spacing";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

type FilterMode = "all" | "weight lifting" | "calisthenics";

type FiltersProps = {
  active: FilterMode;
  onChange: (mode: FilterMode) => void;
};

const FILTERS: FilterMode[] = ["all", "weight lifting", "calisthenics"];

export default function Filters({ active, onChange }: FiltersProps) {
  return (
    <View style={styles.filters}>
      {FILTERS.map((mode) => (
        <Pressable
          key={mode}
          onPress={() => onChange(mode)}
          style={({ pressed }) => [
            styles.chip,
            active === mode && styles.chipActive,
            pressed && pressableStyles.pressed,
          ]}
        >
          <Text
            style={[styles.chipText, active === mode && styles.chipTextActive]}
          >
            {mode === "all"
              ? "All"
              : mode === "weight lifting"
              ? "Weight Lifting"
              : "Calisthenics"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    shadowColor: COLORS.background,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
