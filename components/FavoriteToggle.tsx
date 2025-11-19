import { getFavorites, loadFavorites, toggleFavorite } from "assets/Favorites";
import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";

export function FavoriteToggle({ id }: { id: string }) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    getFavorites()
  );

  useEffect(() => {
    loadFavorites().then((f) => setFavorites({ ...f }));
  }, []);

  const isFav = !!favorites[id];

  async function handleToggle() {
    const updated = await toggleFavorite(id);
    setFavorites({ ...updated });
  }

  return (
    <Pressable onPress={handleToggle}>
      <Text style={{ color: isFav ? "#EF4444" : "#9AA4AA" }}>
        {isFav ? "�T�" : "�T�"}
      </Text>
    </Pressable>
  );
}
