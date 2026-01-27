import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Wallet {
  index: number;
  publicKey: string;
  privateKey: string;
  path: string;
}

export default function WalletGenerator() {
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  // Function to determine the API URL based on the platform
  const getApiUrl = () => {
    if (Platform.OS === "web") {
      return "/api/wallet";
    }
    // For mobile, we need the local IP of the dev server
    if(process.env.EXPO_PUBLIC_APP_URL){
      return process.env.EXPO_PUBLIC_APP_URL + "/api/wallet";
    }
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(":")[0] || "localhost";
    return `http://${localhost}:8081/api/wallet`;
  };

  const API_URL = getApiUrl();

  const handleGenerateWallet = async () => {
    let newPhrase = mnemonic;
    if (!newPhrase.trim()) {
      newPhrase = generateMnemonic(wordlist);
    }

    setLoading(true);
    try {
      const nextIndex = wallets.length;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mnemonic: newPhrase,
          index: nextIndex,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unknown error");
      }

      setWallets((prev) => [...prev, data]);
      console.log("Derived Wallet:", data);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Generation Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Solana Wallet Generator</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter mnemonic phrase..."
          placeholderTextColor="#666"
          value={mnemonic}
          onChangeText={setMnemonic}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleGenerateWallet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Next Wallet</Text>
          )}
        </TouchableOpacity>

        {wallets.length > 0 && (
          <View style={styles.listContainer}>
            <Text style={styles.subHeader}>
              Generated Wallets ({wallets.length})
            </Text>
            <FlatList
              data={wallets}
              keyExtractor={(item) => item.publicKey}
              renderItem={({ item }) => (
                <View style={styles.walletCard}>
                  <Text style={styles.label}>Index: {item.index}</Text>
                  <Text style={styles.label}>Public Key:</Text>
                  <Text style={styles.value}>{item.publicKey}</Text>

                  <Text style={styles.label}>Private Key:</Text>
                  <Text
                    style={styles.value}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {item.privateKey}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  walletCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
  },
});
