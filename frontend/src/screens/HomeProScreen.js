// frontend/src/screens/PlaygroundScreen.js
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";

export default function HomePro() {
  // états pour stocker ce que l'utilisateur tape
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // fonction déclenchée quand on appuie sur le bouton
  const handleSubmit = () => {
    
  };

  return (
    <View style={styles.container}>
      {/* Champ utilisateur */}
      <Input
        label="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        placeholder="Entrez votre nom"
      />

      {/* Champ mot de passe */}
      <Input
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      {/* Bouton plein */}
      <Button title="Se connecter" onPress={handleSubmit} variant="full" />

      {/* Bouton contour */}
      <Button title="Annuler" onPress={() => Alert.alert("Annulé")} variant="outline"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
});
