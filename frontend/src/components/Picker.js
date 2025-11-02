import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

/**
 * StyledPicker Component
 * ---------------------------------------
 * A reusable React Native component that renders a stylized Picker (dropdown)
 * with label, validation, and required field handling.
 *
 * Features:
 * - Displays a label with an optional red asterisk for required fields
 * - Highlights the border in red when an error is present
 * - Displays an error message below the field
 * - Renders dynamic options passed via the `options` prop
 *
 * Example usage:
 * <StyledPicker
 *   label="Select gender"
 *   selectedValue={gender}
 *   onValueChange={setGender}
 *   options={[
 *     { label: "Male", value: "male" },
 *     { label: "Female", value: "female" },
 *   ]}
 *   required
 *   error={formError}
 * />
 *
 * @param {Object} props
 * @param {string} [props.label] - Text displayed above the picker.
 * @param {string|number} props.selectedValue - Currently selected value.
 * @param {function} props.onValueChange - Callback triggered when the selection changes.
 * @param {{label: string, value: string|number}[]} props.options - Array of options displayed in the picker.
 * @param {string} [props.error] - Error message displayed below the picker.
 * @param {boolean} [props.required] - Displays a red asterisk next to the label if true.
 */

export default function StyledPicker({ label, selectedValue, onValueChange, options, error, required}) {
  return (
    // Wrapper containing label, picker, and error message
    <View style={styles.container}>

      {/* Label with optional red asterisk */}
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text>
      )}

      {/* Picker field container */}
      <View style={[styles.pickerContainer, error && styles.errorInput]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Wrapper for label, picker, and error text
  container: {
    marginBottom: 15,
  },
  // Label displayed above the picker
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#042456",
    fontFamily: "Nunito",
  },
  // Picker container styled like a text input
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#042456",
    borderRadius: 5,
    overflow: "hidden", // prevents the picker from overflowing
    height: 50,
    justifyContent: "center",
  },
  // Picker text styling
  picker: {
    fontFamily: "Nunito",
    color: "#042456", // Picker text
    fontSize: 12,
  },
  // Red border when there's an error
  errorInput: {
    borderColor: "red",
  },
  // Error message text
  errorText: {
    color: "red",
    marginTop: 5,
    fontFamily: "Nunito",
  },
  // Red asterisk for required fields
  star: {
    color: 'red',
  },
});
