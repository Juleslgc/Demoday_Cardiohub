import { registerRootComponent } from 'expo';
import React from "react";
import PlaygroundScreen from "./src/screens/TestScreen";

export default function App() {
  return <PlaygroundScreen />;
}
registerRootComponent(App);