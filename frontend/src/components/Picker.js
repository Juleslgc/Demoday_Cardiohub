import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function StyledPicker({ label, selectedValue, onValueChange, options, error, required}) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text>
      )}

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

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: "bold", color: "#042456", fontFamily: "Nunito" },

  // "Input" style
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#042456",
    borderRadius: 5,
    overflow: "hidden", // so that the Picker does not overflow
    height: 50,
    justifyContent: "center"
  },
  picker: {
    fontFamily: "Nunito",
    color: "#042456", // Picker text
    fontSize: 12,
  },

  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginTop: 5, fontFamily: "Nunito" },
  star: { color: 'red' }
});