import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(`Error in storing wallets: ${error} `);
  }
};

export const getData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (!data) {
      console.log("No data found in async storage");
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.log(`Error in retrieving the data ${error}`);
    return null;
  }
};

export const clearData = async (key: string) => {
  try {
    AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(`Error in retrieving the data ${error}`);
    return null;
  }
};
