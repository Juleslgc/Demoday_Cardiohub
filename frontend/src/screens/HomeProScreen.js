// frontend/src/screens/PlaygroundScreen.js
import React, { useState } from "react";
import { View, StyleSheet, Alert, Text, KeyboardAvoidingView, Image,  } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from "../components/Input";
import Button from "../components/Button";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomePro() {
  // états pour stocker ce que l'utilisateur tape
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // fonction déclenchée quand on appuie sur le bouton
  const handleSubmit = () => {
    
  };

  return (
    <SafeAreaView style={{backgroundColor: '#042456', flex: 1 }}>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <View style={styles.square}>
            <FontAwesome name="video-camera" size={24} color="#042456" />
            <Text style={{backgroundColor: '#0000' }}>Test</Text>
          </View >
          <View style={styles.square}>
            <Text style={{backgroundColor: '#0000' }}>Test</Text>
          </View>
          <View style={styles.square}>
            <Text style={{backgroundColor: '#0000' }}>Test</Text>
          </View>
          <View style={styles.square}>
            <Text style={{backgroundColor: '#0000' }}>Test</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',  
    justifyContent: 'center',
    alignContent: 'center',
    gap: 15,
  },
  square: {
    width: 161,
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    
  },
});
