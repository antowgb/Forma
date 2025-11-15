import { COLORS } from "constants/Colors";
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
    gap: 8,
    marginBottom: 4,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "40",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  sortChipActive: {
    backgroundColor: COLORS.accent,
  },
  sortChipText: {
    color: COLORS.text,
    fontSize: 13,
  },
  sortChipTextActive: {
    color: COLORS.background,
    fontWeight: "700",
  },
});
