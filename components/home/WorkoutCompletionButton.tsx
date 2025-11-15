import { COLORS } from "constants/Colors";
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
      style={({ pressed }) => [
        styles.done,
        pressed && pressableStyles.pressed,
      ]}
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
    marginTop: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  generateText: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: "700",
  },
});
