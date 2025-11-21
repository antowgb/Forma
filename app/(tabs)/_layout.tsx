import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "constants/Colors";
import { RADIUS } from "constants/Radius";
import { SPACING } from "constants/Spacing";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <View style={styles.sceneBackground}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIconStyle: styles.tabIcon,
          tabBarItemStyle: styles.tabItem,
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.subtext,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Automatic",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "sparkles" : "sparkles-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="recovery"
          options={{
            title: "Recovery",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "pulse" : "pulse-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="workouts"
          options={{
            title: "Workouts",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "barbell" : "barbell-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="custom"
          options={{
            title: "Custom",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "create" : "create-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  sceneBackground: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  tabBar: {
    position: "absolute",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.panel,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: 80,
    ...SHADOWS.floating,
  },

  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    flex: 1,
  },

  tabIcon: {
    marginBottom: SPACING.xs,
  },

  tabLabel: {
    marginTop: SPACING.xs,
    marginBottom: 0,
    fontSize: 12,
    textAlign: "center",
  },

  centeredTabButton: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});
