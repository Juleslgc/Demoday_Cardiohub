import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { getMe, getMePro } from "../services/api";

/**
 * JitsiWebViewScreen
 * ----------------------------
 * Affiche la visioconférence Jitsi pour le patient ou le pro.
 * Reçoit en paramètre :
 *   - roomName : identifiant unique de la salle (sans le domaine)
 *   - role : "patient" ou "pro"
 */
export default function JitsiWebViewScreen({ route, navigation }) {
  const { roomName, role } = route.params || {};
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState("Utilisateur");

  // Récupère le nom complet du participant (selon son rôle)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        let userData;

        if (role === "pro") {
          console.log("Récupération des infos du professionnel...");
          userData = await getMePro();
        } else {
          console.log("Récupération des infos du patient...");
          userData = await getMe();
        }

        if (userData?.firstName) {
          const fullName = `${userData.firstName} ${userData.lastName || ""}`.trim();
          setDisplayName(fullName);
        } else {
          console.warn("Nom introuvable, affichage par défaut.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du nom :", error.message);
        Alert.alert("Erreur", "Impossible de récupérer les informations utilisateur.");
      }
    };

    fetchUserInfo();
  }, [role]);

  // Génère l’URL complète pour la salle Jitsi
  // Exemple : https://meet.jit.si/consultation-demo#userInfo.displayName="Jean Dupont"
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(
    displayName
  )}"`;

  useEffect(() => {
    console.log(`🎥 Connexion à la salle : ${jitsiUrl}`);
  }, [jitsiUrl]);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#042456" />
        </View>
      )}

      <WebView
        source={{ uri: jitsiUrl }}
        style={styles.webview}
        onLoadEnd={() => setIsLoading(false)}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  webview: { flex: 1 },
  loaderContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
});
