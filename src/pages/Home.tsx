import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  Keyboard,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { GameCard } from "../components/GameCard";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";

interface SkillData {
  id: string;
  name: string;
}

export function Home() {
  const [code, setCode] = useState("");
  const [greetings, setGreeting] = useState("");
  const [mySkills, setMySkills] = useState<SkillData[]>([]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Bom dia");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }
  }, []);

  const handleAddCode = () => {
    if (code) {
      const data = {
        id: String(new Date().getTime()),
        name: code,
      };

      setMySkills([...mySkills, data]);
      setCode("");
      Keyboard.dismiss();
    }
  };

  const handleInputCode = (code: string) => {
    if (code !== undefined) {
      if (!code.match(/[^0-9]/g)) {
        setCode(code);
      }
    }
  };

  const handleRemoveSkill = (id: string) => {
    setMySkills((oldState) => oldState.filter((skill) => skill.id !== id));
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Bulls and Cows</Text>
        <Text style={styles.greetings}>{greetings}</Text>

        <View style={styles.input}>
          <SmoothPinCodeInput
            cellStyle={{
              borderBottomWidth: 2,
              borderColor: "gray",
            }}
            cellStyleFocused={{
              borderColor: "#A370F7",
            }}
            value={code}
            onTextChange={(code: string) => handleInputCode(code)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.actionGame}>
          <Button
            style={styles.restartAction}
            title="Reiniciar Partida"
            onPress={() => {
              setMySkills([]);
            }}
          />
          <Button title="Verificar Tentativa" onPress={handleAddCode} />
        </View>
        <Text style={[styles.title, { marginVertical: 50 }]}>
          Tentativas: {mySkills.length}
        </Text>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={mySkills}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GameCard game={item.name} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121015",
    paddingVertical: 70,
    paddingHorizontal: 30,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    alignItems: "center",
  },
  greetings: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  actionGame: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  restartAction: {
    backgroundColor: "#a470f7a6",
    padding: 15,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 20,
  },
});
