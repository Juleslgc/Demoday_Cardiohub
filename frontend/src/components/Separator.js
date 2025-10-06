/**
 * Reusable Separator Component
 * ---------------------------------------
 * A simple React Native component that renders
 * a horizontal line (separator) for visually dividing
 * sections in an interface.
 *
 * Features:
 * - Centered horizontal line
 * - Configurable width and spacing via styles
 */

import React from "react";
import { View, StyleSheet } from "react-native";

// Functional component returning a styled View acting as a separator line
export default function Separator() {
  return <View style={styles.separator} />;
}

// Define styles for the separator
const styles = StyleSheet.create({
  separator: {
    width: "80%",            // The line occupies 80% of the container's width
    alignSelf: "center",     // Centers the separator horizontally
    height: 1,               // Sets the line thickness
    backgroundColor: "#ccc", // Light gray color for subtle separation
    marginVertical: 30,      // Adds vertical spacing above and below the line
  },
});
