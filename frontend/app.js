import { registerRootComponent } from 'expo';
import React from "react";
import SimulationPsc from './src/screens/SimulationPsc.js';

export default function App() {
  return <SimulationPsc />;
}
registerRootComponent(App);