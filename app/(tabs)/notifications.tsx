import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationItem } from "@/types/Notification";

export default function NotificationScreen() {
  const router = useRouter();
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

    const saved = await AsyncStorage.getItem("notifications");
    const notifications = saved ? JSON.parse(saved) : [];
    notifications.push(newNotification);
    await AsyncStorage.setItem("notifications", JSON.stringify(notifications));

    setTitle("");
    setDescription("");
    router.replace("/");
  };

  const backNotification = () => {
    setTitle("");
    setDescription("");
    router.back();
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
      <Button title="뒤로 가기" onPress={backNotification} />
    </View>
  );
}
