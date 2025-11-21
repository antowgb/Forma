import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "constants/Colors";

type PageTransitionProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  variant?: "default" | "gentle";
  animateOnFirstFocus?: boolean;
};

/**
 * Minimal fade + slide-in animation whenever the screen becomes focused.
 */
export default function PageTransition({
  children,
  style,
  backgroundColor = COLORS.background,
  variant = "default",
  animateOnFirstFocus = false,
}: PageTransitionProps) {
  const isFocused = useIsFocused();
  // Start visible by default to avoid first-frame flicker, unless we explicitly animate on first focus.
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);

  const config = useMemo(
    () =>
      variant === "gentle"
        ? {
            offset: 6,
            opacityStart: 0.85,
            fadeDuration: 260,
            spring: { damping: 18, stiffness: 140, mass: 0.7 },
          }
        : {
            offset: 12,
            opacityStart: 0,
            fadeDuration: 220,
            spring: { damping: 18, stiffness: 200, mass: 0.7 },
          },
    [variant]
  );

  const animatedStyle = useMemo(
    () => ({
      opacity,
      transform: [{ translateY }],
    }),
    [opacity, translateY]
  );

  useEffect(() => {
    if (!isFocused) return;

    if (hasAnimated.current || animateOnFirstFocus) {
      opacity.setValue(config.opacityStart);
      translateY.setValue(config.offset);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: config.fadeDuration,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: config.spring.damping,
          stiffness: config.spring.stiffness,
          mass: config.spring.mass,
          useNativeDriver: true,
        }),
      ]).start(() => {
        hasAnimated.current = true;
      });
      return;
    }

    // First focus with animation disabled: render immediately to avoid jank.
    opacity.setValue(1);
    translateY.setValue(0);
    hasAnimated.current = true;
  }, [animateOnFirstFocus, config, isFocused, opacity, translateY]);

  return (
    <Animated.View
      style={[styles.wrapper, { backgroundColor }, animatedStyle, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
