import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  AsyncStorageGetItem,
  AsyncStorageSetItem,
} from "@/components/AsyncStorage";
import { updateNotificationBar } from "@/components/UpdateNotificationBar";
import { registerBackgroundTask } from "@/components/BackgroundTask";
import { NotificationItem } from "@/types/Notification";

const HomeScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    registerBackgroundTask(); // 백그라운드 태스크 등록
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const loadNotifications = async () => {
    const savedNotifications = await AsyncStorageGetItem("notifications");
    const data = savedNotifications ? JSON.parse(savedNotifications) : [];
    setNotifications(data);
    updateNotificationBar(data);
  };

  const deleteNotification = async (id: string) => {
    const updatedList = notifications.filter((item) => item.id !== id);
    setNotifications(updatedList);
    await AsyncStorageSetItem("notifications", updatedList);
    updateNotificationBar(updatedList);
  };

  const toggleNotification = async (id: string) => {
    const updatedList = notifications.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );

    setNotifications(updatedList);
    await AsyncStorageSetItem("notifications", updatedList);
    updateNotificationBar(updatedList);
  };

  return (
    <View className="flex-1 bg-white p-7">
      <Text className="text-2xl font-bold mb-4">알림 목록</Text>
      <TouchableOpacity
        className="bg-[#B8E986] py-3 px-4 rounded-xl mb-4 items-center"
        onPress={() => router.push("/notifications")}
      >
        <Text className="text-white font-semibold">알림 추가</Text>
      </TouchableOpacity>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 rounded-xl shadow-md mb-3">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-grey-600">{item.description}</Text>

            <View className="flex-row mt-2">
              <TouchableOpacity
                className={`flex-1 py-2 rounded-xl mr-2 items-center ${
                  item.completed ? "bg-gray-300" : "bg-[#B8E986]"
                }`}
                onPress={() => toggleNotification(item.id)}
                disabled={item.completed}
              >
                <Text className="text-white font-semibold">
                  {item.completed ? "완료됨" : "오늘 완료"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-400 py-2 rounded-xl items-center"
                onPress={() => deleteNotification(item.id)}
              >
                <Text className="text-white font-semibold">삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
