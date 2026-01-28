import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import Constants from "expo-constants";
import { Copy, Eye, EyeOff, SwatchBook, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { SafeAreaView } from "react-native-safe-area-context";
import { clearData, getData, storeData } from "@/utils/storage";

export interface Wallet {
  index: number;
  publicKey: string;
  privateKey: string;
  path: string;
  currency: string;
}

type Currency = {
  name: string;
  coin_index: number | null;
  iconUrl: string;
  color: string;
};

const CURRENCIES: Currency[] = [
  {
    name: "Solana",
    coin_index: 501,
    iconUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
    color: "#9945FF",
  },
  {
    name: "Ethereum",
    coin_index: 60,
    iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    color: "#627EEA",
  },
];

export default function WalletGenerator() {
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    CURRENCIES[0],
  );

  const [showMnemonic, setShowMnemonic] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});

  const getApiUrl = () => {
    if (Platform.OS === "web") return "/api/wallet";
    if (process.env.EXPO_PUBLIC_APP_URL) // For add the metro server ip address ex: 192.168.0.0
      return process.env.EXPO_PUBLIC_APP_URL + "/api/wallet";

    //For testing
    return `http://metro server ip here:8081/api/wallet`;
  };

  const API_URL = getApiUrl();

  const loadStorageData = async () => {
    const storedMnemonic = await getData("MNEMONIC");
    const storedWallet = await getData("WALLET");

    if (storedMnemonic) setMnemonic(storedMnemonic);
    if (storedWallet) setWallets(storedWallet);
  };
  useEffect(() => {
    loadStorageData();
  }, []);

  const handleGenerateWallet = async () => {
    let newPhrase = mnemonic;
    if (!newPhrase.trim()) {
      newPhrase = generateMnemonic(wordlist);
      setMnemonic(newPhrase);
    }

    setLoading(true);
    try {
      const nextIndex = wallets.length;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mnemonic: newPhrase,
          coin_index: selectedCurrency?.coin_index,
          index: nextIndex,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unknown error");

      await storeData("MNEMONIC", newPhrase);
      await storeData("WALLET", [...wallets, data]);
      setWallets((prev) => [...prev, data]);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Generation Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyVisibility = (index: number) => {
    setVisibleKeys((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
    if (Platform.OS === "web") {
      alert("Copied");
    } else {
      Alert.alert("Copied");
    }
  };

  const clearAll = () => {
    setWallets([]);
    setMnemonic("");
    setVisibleKeys({});

    clearData("WALLET");
    clearData("MNEMONIC");
  };

  const mnemonicWords = mnemonic
    .trim()
    .split(" ")
    .filter((w) => w.length > 0);

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-6">
          <Text className="flex flex-row items-center color-[#00ff94] text-3xl font-bold tracking-tighter">
            <SwatchBook size={28} color="#00ff94" /> Hallx
          </Text>
          <Text className="color-gray-400 font-medium text-base mt-1 mb-6">
            Universal Wallet Generator
          </Text>
        </View>

        {/* Mnemonic Input Section */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300 font-semibold">
              Secret Recovery Phrase
            </Text>
            {mnemonicWords.length > 0 && (
              <TouchableOpacity onPress={() => setShowMnemonic(!showMnemonic)}>
                <Text className="text-[#00ff94] text-xs font-bold uppercase">
                  {showMnemonic ? "Hide Phrase" : "Show Phrase"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            className="w-full p-4 rounded-xl bg-gray-900/80 border border-gray-800 color-white mb-4 text-base"
            placeholder="Enter or generate mnemonic..."
            placeholderTextColor="#555"
            value={mnemonic}
            onChangeText={setMnemonic}
            autoCapitalize="none"
            multiline
          />

          {/* Seed Phrase Grid Box */}
          {mnemonicWords.length > 0 && showMnemonic && (
            <View className="flex-row flex-wrap gap-2 mb-4 bg-gray-900/50 p-4 rounded-xl border border-dashed border-gray-800">
              {mnemonicWords.map((word, idx) => (
                <View
                  key={idx}
                  className="bg-gray-800 px-3 py-1.5 rounded-md flex-row items-center"
                >
                  <Text className="text-gray-500 text-xs mr-2">{idx + 1}.</Text>
                  <Text className="text-gray-200 font-medium">{word}</Text>
                </View>
              ))}

              <TouchableOpacity
                onPress={() => copyToClipboard(mnemonic)}
                className="bg-gray-800 px-3 py-1.5 rounded-md"
              >
                <Copy className="" color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-[#00ff94] py-4 rounded-xl items-center shadow-lg shadow-green-900/20 active:opacity-90"
              onPress={handleGenerateWallet}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-bold text-base uppercase tracking-wider">
                  {wallets.length > 0 ? "Add Wallet" : "Generate Wallet"}
                </Text>
              )}
            </TouchableOpacity>

            {wallets.length > 0 && (
              <TouchableOpacity
                onPress={clearAll}
                className="bg-red-500/10 p-4 rounded-xl justify-center items-center border border-red-500/20"
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Currency Selector */}
        <View className="px-6 mb-8">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
            Select Network
          </Text>
          <View className="flex-row gap-3">
            {CURRENCIES.map((item) => {
              const isSelected =
                selectedCurrency?.coin_index === item.coin_index;
              return (
                <TouchableOpacity
                  key={item.coin_index}
                  onPress={() => setSelectedCurrency(item)}
                  activeOpacity={0.7}
                  className={`flex-1 p-3 rounded-xl flex-row items-center justify-center gap-2 border ${
                    isSelected
                      ? "bg-gray-800 border-[#00ff94]"
                      : "bg-gray-900 border-gray-800 opacity-60"
                  }`}
                >
                  <Image source={{ uri: item.iconUrl }} className="h-6 w-6" />
                  <Text
                    className={`font-bold ${isSelected ? "text-white" : "text-gray-400"}`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Wallet List */}
        {wallets.length > 0 && (
          <View className="px-6">
            <Text className="text-gray-200 text-xl font-bold mb-4">
              Generated Wallets
            </Text>

            {wallets.map((wallet, idx) => {
              const currencyInfo =
                CURRENCIES.find((c) => c.name === wallet.currency) ||
                CURRENCIES[0];
              const isKeyVisible = visibleKeys[idx];

              return (
                <View
                  key={wallet.publicKey}
                  className="mb-4 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* Card Header */}
                  <View className="flex-row justify-between items-center p-4 bg-gray-800/50 border-b border-gray-800">
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={{ uri: currencyInfo.iconUrl }}
                        className="w-5 h-5"
                      />
                      <Text className="text-white font-bold text-base">
                        {wallet.currency} Wallet {wallet.index + 1}
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-xs font-mono bg-gray-900 px-2 py-1 rounded">
                      {wallet.path}
                    </Text>
                  </View>

                  {/* Card Body */}
                  <View className="p-4 gap-4">
                    {/* Public Key */}
                    <View>
                      <Text className="text-gray-500 text-xs uppercase font-bold mb-1">
                        Public Key
                      </Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(wallet.publicKey)}
                      >
                        <Text className="text-[#00ff94] font-mono text-sm leading-5">
                          {wallet.publicKey}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Private Key */}
                    <View>
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-gray-500 text-xs uppercase font-bold">
                          Private Key
                        </Text>
                        <TouchableOpacity
                          onPress={() => toggleKeyVisibility(idx)}
                          className="flex-row items-center gap-1"
                        >
                          {isKeyVisible ? (
                            <EyeOff size={14} color="#666" />
                          ) : (
                            <Eye size={14} color="#666" />
                          )}
                          <Text className="text-gray-500 text-xs">
                            {isKeyVisible ? "Hide" : "Show"}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() => copyToClipboard(wallet.privateKey)}
                        disabled={!isKeyVisible}
                        className="bg-black/30 p-3 rounded-lg border border-gray-800"
                      >
                        <Text
                          className={`font-mono text-sm ${isKeyVisible ? "text-red-400" : "text-gray-600"}`}
                        >
                          {isKeyVisible
                            ? wallet.privateKey
                            : "• • • • • • • • • • • • • • • • • • • • • • • • • • • •"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
