import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "constants/Colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

type ScreenHeaderProps = {
  title: string;
  onReload?: () => void;
};

export default function ScreenHeader({ title, onReload }: ScreenHeaderProps) {
  return (
    <View style={styles.headerTop}>
      <Text style={styles.title}>{title}</Text>
      {onReload ? (
        <Pressable
          style={({ pressed }) => [
            styles.reloadButton,
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
  reloadButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});
