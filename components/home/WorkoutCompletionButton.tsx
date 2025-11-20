import { COLORS, SHADOWS } from "constants/Colors";
import { SPACING } from "constants/Spacing";
import { Pressable, StyleSheet, Text } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

type WorkoutCompletionButtonProps = {
  visible: boolean;
  completed: boolean;
  onComplete: () => void;
};

export default function WorkoutCompletionButton({
  visible,
  completed,
  onComplete,
}: WorkoutCompletionButtonProps) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.done, pressed && pressableStyles.pressed]}
      onPress={onComplete}
    >
      <Text style={styles.generateText}>
        {completed ? "Workout Registered" : "Mark Completed"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  done: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.floating,
  },
  generateText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
  },
});
