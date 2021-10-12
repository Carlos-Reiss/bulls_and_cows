import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconButton, Modal, Snackbar } from "react-native-paper";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import { Button } from "../components/Button";
import { GameCard } from "../components/GameCard";

interface InfoData {
  id: string;
  name: string;
  bulls: number;
  cows: number;
}

export function Home() {
  const [code, setCode] = useState("");
  const [greetings, setGreeting] = useState("");
  const [erroMessage, setErroMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [chave, setChave] = useState("");
  const [win, setWin] = useState(false);
  const [reset, setReset] = useState(false);
  const [tentativas, setTentativas] = useState<InfoData[]>([]);

  function numberRandom() {
    return Math.floor(Math.random() * 10);
  }

  useEffect(() => {
    while (true) {
      let numero1 = numberRandom();
      let numero2 = numberRandom();
      let numero3 = numberRandom();
      let numero4 = numberRandom();
      if (
        numero1 !== numero2 &&
        numero1 !== numero3 &&
        numero1 !== numero4 &&
        numero2 !== numero3 &&
        numero2 !== numero4 &&
        numero3 !== numero4
      ) {
        setChave(`${numero1}${numero2}${numero3}${numero4}`);
        break;
      }
    }
  }, [win, reset]);

  function getHint(secret: string, guess: string) {
    var bulls = 0;
    var cows = 0;
    var numbers = new Array(10);
    for (var i = 0; i < 10; i++) {
      numbers[i] = 0;
    }
    for (var i = 0; i < secret.length; i++) {
      var s = secret.charCodeAt(i) - 48;
      var g = guess.charCodeAt(i) - 48;
      if (s == g) bulls++;
      else {
        if (numbers[s] < 0) cows++;
        if (numbers[g] > 0) cows++;
        numbers[s]++;
        numbers[g]--;
      }
    }
    return [bulls, cows];
  }

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

  const showModal = () => setModal(true);
  const hideModal = () => setModal(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const checkDuplicates = useCallback((code) => {
    const structSet = new Set();
    for (let posicao = 0; posicao < code.length; posicao++) {
      const element = code.charAt(posicao);
      structSet.add(element);
    }
    if (structSet.size !== code.length) {
      return true;
    } else {
      return false;
    }
  }, []);

  const handleAddCode = () => {
    if (tentativas.length >= 7) {
      setErroMessage(
        `Game Over: infelizmente você perdeu. O segredo era: ${chave}`
      );
      setWin(false);
      onToggleSnackBar();

      if (Platform.OS === "ios") {
        Keyboard.dismiss();
      }

      return;
    }
    if (code.length < 4) {
      setErroMessage("Números não precisam ter 4 digitos");
      onToggleSnackBar();
      if (Platform.OS === "ios") {
        Keyboard.dismiss();
      }
      return;
    }
    if (code) {
      if (checkDuplicates(code)) {
        setErroMessage(" Números repetidos não são permitidos.");
        onToggleSnackBar();
        if (Platform.OS === "ios") {
          Keyboard.dismiss();
        }
        return;
      }
      const [bull, cows] = getHint(chave, code);

      if (bull === 4) {
        setErroMessage("YOU WIN! Você ganhou o game.");
        setWin(true);
        onToggleSnackBar();
        if (Platform.OS === "ios") {
          Keyboard.dismiss();
        }
        return;
      }

      const data = {
        id: String(new Date().getTime()),
        name: code,
        bulls: bull,
        cows: cows,
      };

      setTentativas([data, ...tentativas]);
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

  useEffect(() => {
    if (tentativas.length >= 7) {
      setErroMessage(
        `Game Over: infelizmente você perdeu. O segredo era: ${chave}`
      );
      setWin(false);
      onToggleSnackBar();

      if (Platform.OS === "ios") {
        Keyboard.dismiss();
      }

      return;
    }
  }, [tentativas]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerDescription}>
          <View>
            <Text style={styles.title}>Bulls and Cows</Text>
            <Text style={styles.greetings}>{greetings}</Text>
          </View>
          <View>
            <IconButton
              icon="information"
              color="#A370F7"
              size={20}
              onPress={showModal}
            />
          </View>
        </View>

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
              setTentativas([]);
              setReset(!reset);
              setCode("");
            }}
          />
          <Button
            disabled={win === true}
            title="Verificar Tentativa"
            onPress={handleAddCode}
          />
        </View>
        <Text style={[styles.title, { marginVertical: 50 }]}>
          Tentativas: {tentativas.length}
          {"\n"}
          {tentativas.length >= 7 && `O segredo era ${chave}`}
        </Text>

        <FlatList
          showsVerticalScrollIndicator
          data={tentativas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameCard game={item.name} bulls={item.bulls} cows={item.cows} />
          )}
        />
      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        action={{
          label: "Fechar",
          onPress: () => {
            onDismissSnackBar();
          },
          color: "#000",
        }}
        style={{
          backgroundColor: "#A370f7",
        }}
      >
        {erroMessage}
      </Snackbar>

      <Modal
        visible={modal}
        onDismiss={hideModal}
        contentContainerStyle={styles.modal}
      >
        <Text
          style={{
            fontSize: 16,
            paddingBottom: 5,
          }}
        >
          Bulls and Cows é um velho jogo de quebra-código mental ou papel e
          lápis para dois ou mais jogadores, anterior ao jogo de tabuleiro
          comercializado Mastermind.
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Bulls = código correto, posição correta.
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Cows = código correto, posição errada.
        </Text>
        <Text style={{ fontWeight: "bold", paddingTop: 15 }}># Exemplo</Text>
        <Text>- número secreto: 4271</Text>
        <Text>- tentativa do usúario: 1234</Text>
        <Text>- resposta: 1 touro e 2 vacas</Text>
        <Text>(O touro é "2", as vacas são "4" e "1")</Text>
      </Modal>
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
  containerDescription: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    justifyContent: "space-around",
  },
  restartAction: {
    backgroundColor: "#a470f7a6",
    padding: 15,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 20,
  },
  modal: {
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 30,
    paddingVertical: 100,
  },
});
