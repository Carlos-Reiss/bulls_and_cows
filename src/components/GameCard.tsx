import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

interface GameCardProps extends TouchableOpacityProps {
  game: string;
}

export function GameCard({ game, ...rest }: GameCardProps) {
  return (
    <TouchableOpacity style={styles.buttonGame} {...rest}>
      <Text style={styles.textGame}>{game}</Text>
      <Text style={styles.statusGame}>bulls: {0}</Text>
      <Text style={styles.statusGame}>cows: {0}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonGame: {
    backgroundColor: "#1F1E25",
    padding: 15,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  textGame: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  statusGame: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "bold",
  },
});
