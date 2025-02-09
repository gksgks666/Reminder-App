import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// 알림 데이터 타입 정의
interface NotificationItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function NotificationScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const addNotification = async () => {
    if (!title) return;

    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
    };

    const savedNotifications = await AsyncStorage.getItem("notifications");
    const notifications: NotificationItem[] = savedNotifications
      ? JSON.parse(savedNotifications)
      : [];

    notifications.push(newNotification);
    await AsyncStorage.setItem("notifications", JSON.stringify(notifications));

    await scheduleDailyNotification(newNotification);

    router.back();
  };

  const scheduleDailyNotification = async (notification: NotificationItem) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.description || "오늘의 알림",
        sound: true,
      },
      trigger: {
        type: "daily",
        hour: 9,
        minute: 0,
      } as Notifications.DailyTriggerInput,
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>새 알림 추가</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="설명"
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />
      <Button title="추가" onPress={addNotification} />
      <Button title="뒤로 가기" onPress={() => router.back()} />
    </View>
  );
}
