import { COLORS } from "constants/Colors";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { pressableStyles } from "components/common/PressableStyles";

type NavLink = {
  label: string;
  href: string;
};

type NavLinkRowProps = {
  links: NavLink[];
};

export default function NavLinkRow({ links }: NavLinkRowProps) {
  return (
    <View style={styles.row}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} asChild>
          <Pressable
            style={({ pressed }) => [
              styles.linkButton,
              pressed && pressableStyles.pressed,
            ]}
          >
            <Text style={styles.linkText}>{link.label}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  linkButton: {
    width: "48%",
    marginTop: 10,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  linkText: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
