import { COLORS } from "constants/Colors";
import { SPACING } from "constants/Spacing";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

type SortOption<Key extends string> = {
  key: Key;
  label: string;
};

type SortOptionsProps<Key extends string> = {
  options: SortOption<Key>[];
  active: Key;
  onChange: (value: Key) => void;
};

export default function SortOptions<Key extends string>({
  options,
  active,
  onChange,
}: SortOptionsProps<Key>) {
  return (
    <View style={styles.sortRow}>
      {options.map((option) => (
        <Pressable
          key={option.key}
          onPress={() => onChange(option.key)}
          style={({ pressed }) => [
            styles.sortChip,
            active === option.key && styles.sortChipActive,
            pressed && pressableStyles.pressed,
          ]}
        >
          <Text
            style={[
              styles.sortChipText,
              active === option.key && styles.sortChipTextActive,
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
  sortRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sortChip: {
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
  sortChipActive: {
    backgroundColor: COLORS.accent,
  },
  sortChipText: {
    color: COLORS.text,
    fontSize: 13,
  },
  sortChipTextActive: {
    color: COLORS.text,
    fontWeight: "700",
  },
});
