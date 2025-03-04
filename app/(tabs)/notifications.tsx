import { View, Text, TextInput, TouchableOpacity } from "react-native";
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
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-4 text-center">새 알림 추가</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
        className="border border-grey-300 rounded-xl px-4 py-3 mb-3 focus:border-[#B8E986] focus:ring-2 focus:ring-[#B8E986]"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="설명"
        className="border border-grey-300 rounded-xl px-4 py-3 mb-3 focus:border-[#B8E986] focus:ring-2 focus:ring-[#B8E986]"
      />
      <TouchableOpacity
        className="bg-[#B8E986] py-3 rounded-xl items-center mb-3"
        onPress={addNotification}
      >
        <Text className="text-white font-semibold">추가</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-gray-400 py-3 rounded-xl items-center"
        onPress={backNotification}
      >
        <Text className="text-white font-semibold">뒤로 가기</Text>
      </TouchableOpacity>
    </View>
  );
}
