import React from "react";
import { View, StyleSheet, Text } from "react-native";

/**
 * SeparatorWithText Component
 * ---------------------------------------
 * A reusable React Native component that displays
 * a horizontal separator line with centered text (e.g., “ou”).
 * Commonly used between sections, buttons, or authentication options.
 *
 * Features:
 * - Symmetrical horizontal lines on both sides of the text
 * - Centered alignment for consistent layout
 * - Customizable displayed text via props
 *
 * Example usage:
 * <SeparatorWithText text="or" />
 *
 * @param {Object} props
 * @param {string} [props.text="ou"] - Text displayed at the center of the separator.
 */

export default function SeparatorWithText({ text = "ou" }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Container aligning lines and text horizontally
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  // Horizontal separator lines on both sides of the text
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc", 
  },
  // Center text styling
  text: {
    marginHorizontal: 10,
    fontSize: 18,
    color: "#042456",
    fontFamily: "Nunito",
    fontWeight: "normal",
  },
});
