import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * Separator Component
 * ---------------------------------------
 * A simple reusable React Native component that renders
 * a horizontal divider line to visually separate sections
 * within the interface.
 *
 * Features:
 * - Centered horizontal line
 * - Adjustable width and spacing via styles
 *
 * Example usage:
 * <Separator />
 */

export default function Separator() {
  return <View style={styles.separator} />;
}

// Component Styles
const styles = StyleSheet.create({
  // Horizontal line separator
  separator: {
    width: "80%",
    alignSelf: "center",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 30,
  },
});
