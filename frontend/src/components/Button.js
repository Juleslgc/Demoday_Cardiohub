import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

/**
 * Reusable Button component for consistent UI across the app.
 *
 * Features:
 * - Supports two visual variants: "full" (solid background) and "outline".
 * - Optionally includes an icon before the text.
 * - Handles disabled state with visual feedback.
 *
 * Example usage:
 * <Button
 *   title="Confirm"
 *   onPress={handleConfirm}
 *   variant="outline"
 *   icon="check"
 * />
 *
 * @param {Object} props
 * @param {string} props.title - Text displayed inside the button.
 * @param {function} props.onPress - Callback function triggered when the button is pressed.
 * @param {"full" | "outline"} [props.variant="full"] - Defines the button style type.
 * @param {boolean} [props.disabled] - If true, the button is disabled.
 * @param {string} [props.icon] - Optional icon name from MaterialCommunityIcons to display before the text.
 */

export default function Button({title, onPress, variant = 'full', disabled, icon}) {
  return (
    <TouchableOpacity
      /**
       * Button styles:
       * - Base button style
       * - Variant style (filled or outline)
       * - Disabled style overrides
       */
      style={[
        styles.button,
        variant === 'full' ? styles.full : styles.outline,
        disabled && styles.disabledButton
      ]}
      onPress={onPress} // Executes the provided action when pressed
      disabled={disabled} // Prevents interaction when disabled
    >

      {/* Optional icon displayed before the text */}
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={variant === 'outline' ? '#042456' : '#fff'}
          style={{ marginRight: 8 }}
        />
      )}

      {/* Button label */}
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.outlineText, // Adjust text color for outline variant
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Base button layout
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  // Filled (default) button style
  full: {
    backgroundColor: '#042456',
  },
  // Outline button style
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#042456',
  },
  // Disabled state style
  disabledButton: {
    backgroundColor: '#aaa',
    borderColor: '#aaa',
  },
  // Default text style for filled button
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
  },
  // Text style for outline button
  outlineText: {
    color: '#042456',
  },
});