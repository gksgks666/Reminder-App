import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const HomeScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    loadNotifications();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("알림 권한이 필요합니다.");
    }
  };

  const loadNotifications = async () => {
    const savedNotifications = await AsyncStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  };

  const saveNotifications = async (newList: NotificationItem[]) => {
    await AsyncStorage.setItem("notifications", JSON.stringify(newList));
  };

  const addNotification = async () => {
    if (!title) return;
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
    };
    const updatedList = [...notifications, newNotification];
    setNotifications(updatedList);
    saveNotifications(updatedList);
    setTitle("");
    setDescription("");
    scheduleDailyNotification(newNotification);
  };

  const deleteNotification = async (id: string) => {
    const updatedList = notifications.filter((item) => item.id !== id);
    setNotifications(updatedList);
    saveNotifications(updatedList);
  };

  const completeNotification = async (id: string) => {
    const updatedList = notifications.map((item) =>
      item.id === id ? { ...item, completed: true } : item
    );
    setNotifications(updatedList);
    saveNotifications(updatedList);
  };

  const scheduleDailyNotification = async (notification: NotificationItem) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.description || "오늘의 알림",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        //hour: 9, // 매일 오전 9시에 알림
        //minute: 0,
        seconds: 60,
        repeats: true,
      },
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

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            {!item.completed ? (
              <Button
                title="완료"
                onPress={() => completeNotification(item.id)}
              />
            ) : (
              <Text style={{ color: "green" }}>완료됨</Text>
            )}
            <Button title="삭제" onPress={() => deleteNotification(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
