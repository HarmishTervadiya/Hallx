import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwatchBook } from "lucide-react-native";

interface Wallet {
  index: number;
  publicKey: string;
  privateKey: string;
  coin_index: string;
}

type Curreny = {
  name: string;
  coin_index: number | null;
  iconUrl: string;
};

const currencies: Curreny[] = [
  {
    name: "Solana",
    coin_index: 501,
    iconUrl: "https://cdn.coinranking.com/Sy33Krudb/btc.svg",
  },
  {
    name: "Etherium",
    coin_index: 60,
    iconUrl: "https://cdn.coinranking.com/Sy33Krudb/btc.svg",
  },
];

export default function WalletGenerator() {
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Curreny>(
    currencies[0],
  );

  // Function to determine the API URL based on the platform
  const getApiUrl = () => {
    if (Platform.OS === "web") {
      return "/api/wallet";
    }
    // For mobile, we need the local IP of the dev server
    if (process.env.EXPO_PUBLIC_APP_URL) {
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
          coin_index: selectedCurrency?.coin_index,
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
    <SafeAreaView className="flex-1 p-8 container bg-[#0a0a0a]">
      <View className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width={40}
              height={40}
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="40"
                y2="0"
                stroke="rgba(0,255,148,0.07)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke="rgba(0,255,148,0.07)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </View>
      <View>
        <Text className="flex items-center color-[#00ff94] text-2xl lg:text-4xl m-6 font-semibold">
          <SwatchBook size={30} /> Hallx
        </Text>

        <Text className="color-green-400 font-medium text-lg lg:text-xl px-6">
          Your all in one wallet store
        </Text>

        <View className="p-6 gap-4 flex-1 flex-row flex-wrap justify-between items-center">
          <TextInput
            className="flex-1 p-4 rounded-lg border border-y-2 bg-gray-900 border-b-green-400 color-white "
            placeholder="Enter mnemonic phrase..."
            placeholderTextColor="#666"
            value={mnemonic}
            onChangeText={setMnemonic}
            autoCapitalize="none"
            underlineColorAndroid={"transparent"}
            selectionColor="rgba(0,255,148,0.6)"
          />
          <TouchableOpacity
            className="sm:flex-1 justify-center items-center lg:flex-none bg-green-500 py-3.5 px-8 rounded-lg"
            onPress={handleGenerateWallet}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-md lg:text-lg font-semibold color-white">
                Generate
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-1 flex-wrap px-6 flex-row gap-4">
          {currencies.map((item) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={item.coin_index}
              onPress={() =>
                selectedCurrency?.coin_index === item.coin_index
                  ? setSelectedCurrency({
                      iconUrl: "",
                      name: "",
                      coin_index: null,
                    })
                  : setSelectedCurrency(item)
              }
              style={
                selectedCurrency?.coin_index === item.coin_index && {
                  backgroundColor: "#22c55e",
                }
              }
              className="p-4 rounded-lg elevation gap-2 flex-row justify-center items-center border border-gray-700 h-12 cursor-pointer"
            >
              <Image
                source={{ uri: item.iconUrl }}
                className="h-6 w-6 color-white"
              />
              <Text className="color-white">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {wallets.length > 0 && (
          <View className="p-6">
            <Text className="color-green-400 text-lg lg:text-2xl font-semibold py-2">
              Your Wallets ({wallets.length})
            </Text>

            <FlatList
              data={wallets}
              keyExtractor={(item) => item.publicKey}
              renderItem={({ item }) => (
                <View className="my-2 bg-gray-900 p-4 rounded-lg gap-2 elevation">
                  <Text className="color-gray-300 font-bold">
                    Wallet: {item.index + 1}
                  </Text>
                  <Text className="color-gray-100 font-semibold">
                    Public Key:
                  </Text>
                  <Text className="color-gray-200">{item.publicKey}</Text>

                  <Text className="color-gray-100 font-semibold">
                    Private Key:
                  </Text>
                  <Text
                    className="color-gray-200"
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
