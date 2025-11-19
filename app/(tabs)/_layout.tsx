import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { COLORS } from "constants/Colors";
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
    backgroundColor: "rgba(11, 15, 18, 0.95)",
    borderRadius: 28,
    marginHorizontal: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 80,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },

  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    flex: 1,
  },

  tabIcon: {
    marginBottom: 4,
  },

  tabLabel: {
    marginTop: 4,
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
