import { COLORS } from "constants/Colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

type DurationSelectorProps = {
  value: number;
  options: number[];
  onChange: (value: number) => void;
};

export default function DurationSelector({
  value,
  options,
  onChange,
}: DurationSelectorProps) {
  return (
    <View style={styles.row}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          style={({ pressed }) => [
            styles.durationButton,
            value === option && styles.durationActive,
            pressed && pressableStyles.pressed,
          ]}
        >
          <Text
            style={[
              styles.durationText,
              value === option && styles.durationTextActive,
            ]}
          >
            {option} min
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  durationButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.panel + "50",
  },
  durationActive: {
    backgroundColor: COLORS.accent,
  },
  durationText: {
    color: COLORS.text,
    fontSize: 13,
  },
  durationTextActive: {
    color: COLORS.text,
    fontWeight: "700",
  },
});
