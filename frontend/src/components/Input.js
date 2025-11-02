import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

/**
 * Input Component
 * ---------------------------------------
 * A reusable and customizable input field for text or password entry.
 *
 * Features:
 * - Displays an optional label with a required asterisk (*)
 * - Handles text visibility toggle for password fields
 * - Changes border color when an error is present
 * - Displays an error message below the input
 *
 * Example usage:
 * <Input
 *   label="Password"
 *   value={password}
 *   onChangeText={setPassword}
 *   secureTextEntry
 *   required
 *   error={errorMessage}
 * />
 *
 * @param {Object} props
 * @param {string} props.label - Text displayed above the field.
 * @param {string} props.value - Current value of the field.
 * @param {function} props.onChangeText - Callback triggered on text change.
 * @param {boolean} [props.secureTextEntry] - Hides the text (for password fields).
 * @param {string} [props.error] - Error message shown when the field is invalid.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {boolean} [props.required] - If true, adds a red asterisk next to the label.
 */

export default function Input({ label, value, onChangeText, secureTextEntry, error, placeholder, required }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    // Main container for the input field and label
    <View style={styles.container}>

      {/* Label displayed above the field */}
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text> )}

      {/* Input field container (with border and optional icon) */}
      <View style={[styles.inputContainer, error && styles.errorInput]}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholder={placeholder}
          placeholderTextColor="#C2BDBD"
          scrollEnabled={false}
        />

        {/* Visibility toggle (eye icon) for password fields */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Displays error message if present */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Component Styles
const styles = StyleSheet.create({
  // Wrapper for label + input + error
  container: {
    marginBottom: 15,
  },
  // Field label text
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#042456',
  },
  // Input container (bordered box with optional icon)
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#042456',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  // Text input field
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: 'Nunito',
  },
  // Icon (eye) container for password visibility toggle
  iconContainer: {
    marginLeft: 5,
  },
  // Red border when input has an error
  errorInput: {
    borderColor: 'red',
  },
  // Error text displayed below the input
  errorText: {
    color: 'red',
    marginTop: 5,
    fontFamily: 'Nunito',
  },
  // Asterisk for required fields
  star: { color: 'red',
  },
});
