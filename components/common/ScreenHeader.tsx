import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "constants/Colors";
import { SPACING } from "constants/Spacing";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

type ScreenHeaderProps = {
  title: string;
  onReload?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onActionPress?: () => void;
};

export default function ScreenHeader({
  title,
  onReload,
  actionIcon,
  onActionPress,
}: ScreenHeaderProps) {
  const showAction = actionIcon && onActionPress;
  return (
    <View style={styles.headerTop}>
      <Text style={styles.title}>{title}</Text>
      {showAction ? (
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && pressableStyles.pressed,
          ]}
          onPress={onActionPress}
        >
          <Ionicons name={actionIcon} size={22} color={COLORS.text} />
        </Pressable>
      ) : onReload ? (
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && pressableStyles.pressed,
          ]}
          onPress={onReload}
        >
          <Ionicons name="reload" size={24} color={COLORS.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "800",
  },
  iconButton: {
    padding: SPACING.sm,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});
