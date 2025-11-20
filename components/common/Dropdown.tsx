import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "constants/Colors";
import { SPACING } from "constants/Spacing";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { pressableStyles } from "./PressableStyles";

export type DropdownOption<T> = {
  value: T;
  label: string;
};

type DropdownProps<T extends string | number> = {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onSelect: (value: T) => void;
  style?: ViewStyle;
};

export default function Dropdown<T extends string | number>({
  label,
  value,
  options,
  onSelect,
  style,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? String(value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          style,
          pressed && pressableStyles.pressed,
        ]}
      >
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value} numberOfLines={1}>
            {selectedLabel}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.text} />
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
          />
          <View style={styles.card}>
            <Text style={styles.cardLabel}>{label}</Text>
            {options.map((option) => {
              const active = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    active && styles.optionActive,
                    pressed && pressableStyles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      active && styles.optionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.panel,
    ...SHADOWS.floating,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.xs,
  },
  label: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  value: {
    color: COLORS.text,
    fontSize: 14,
    maxWidth: 180,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.panel + "50",
    shadowColor: COLORS.background,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.floating,
  },
  cardLabel: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: SPACING.xs,
  },
  option: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionActive: {
    backgroundColor: COLORS.accent + "20",
  },
  optionText: {
    color: COLORS.text,
    fontSize: 14,
  },
  optionTextActive: {
    fontWeight: "700",
  },
});
