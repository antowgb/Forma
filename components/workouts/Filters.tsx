import { COLORS } from "constants/Colors";
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
            style={[
              styles.chipText,
              active === mode && styles.chipTextActive,
            ]}
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
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "40",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  chipActive: {
    backgroundColor: COLORS.accent,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 13,
  },
  chipTextActive: {
    color: COLORS.background,
    fontWeight: "700",
  },
});
