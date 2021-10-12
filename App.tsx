import { StatusBar } from "expo-status-bar";
import React from "react";
import { Home } from "./src/pages/Home";
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <Home />
      <StatusBar style="light" />
    </PaperProvider>
  );
}
