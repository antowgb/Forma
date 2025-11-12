import { usePrefs } from "assets/Store/Preferences";
import { Pressable, Text } from "react-native";

export function FavoriteToggle({ id }: { id: string }) {
  const favorites = usePrefs((s) => s.favorites);
  const toggle = usePrefs((s) => s.toggleFavorite);
  const isFav = !!favorites[id];
  return (
    <Pressable onPress={() => toggle(id)}>
      <Text style={{ color: isFav ? "#EF4444" : "#9AA4AA" }}>
        {isFav ? "♥" : "♡"}
      </Text>
    </Pressable>
  );
}
