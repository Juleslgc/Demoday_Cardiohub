/**
 * Reusable Separator With Text Component
 * ---------------------------------------
 * Displays a horizontal separator line with centered text (e.g., "ou").
 * Commonly used between sections, buttons, or authentication options.
 *
 * Props:
 * - The text displayed at the center of the separator. Defaults to "ou".
 *
 * Features:
 * - Symmetrical horizontal lines on both sides of the text.
 * - Centered alignment for consistent UI layout.
 */

import React from "react";
import { View, StyleSheet, Text } from "react-native";

// Functional component rendering a separator line with centered text
export default function SeparatorWithText({ text = "ou" }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

// Define component styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",     // Arrange elements horizontally
    alignItems: "center",     // Vertically center lines and text
    justifyContent: "center", // Center the entire separator within its container
    marginTop: 20,
    marginBottom: 15,
  },
  line: {
    flex: 1,                  // Expand lines to fill available space
    height: 1,                // Thin horizontal line
    backgroundColor: "#ccc", 
  },
  text: {
    marginHorizontal: 10,     // Space between lines and text
    fontSize: 18,
    color: "#042456",
    fontFamily: "Nunito",
    fontWeight: "normal",
  },
});
