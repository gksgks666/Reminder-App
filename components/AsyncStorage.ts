import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationItem } from "@/types/Notification";

export const AsyncStorageGetItem = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const AsyncStorageSetItem = async (
  key: string,
  data: NotificationItem[] | string
) => {
  const stringData = typeof data === "string" ? data : JSON.stringify(data);
  return await AsyncStorage.setItem(key, stringData);
};
