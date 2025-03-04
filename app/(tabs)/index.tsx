import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateNotificationBar } from "@/components/UpdateNotificationBar";
import { registerBackgroundTask } from "@/components/BackgroundTask";
import { NotificationItem } from "@/types/Notification";

export default function HomeScreen() {
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
    const savedNotifications = await AsyncStorage.getItem("notifications");
    const data = savedNotifications ? JSON.parse(savedNotifications) : [];
    setNotifications(data);
    updateNotificationBar(data);
  };

  const deleteNotification = async (id: string) => {
    const updatedList = notifications.filter((item) => item.id !== id);
    setNotifications(updatedList);
    await AsyncStorage.setItem("notifications", JSON.stringify(updatedList));
    updateNotificationBar(updatedList);
  };

  const completeNotification = async (id: string) => {
    const updatedList = notifications.map((item) =>
      item.id === id ? { ...item, completed: true } : item
    );

    setNotifications(updatedList);
    await AsyncStorage.setItem("notifications", JSON.stringify(updatedList));
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
                onPress={() => completeNotification(item.id)}
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
}

/* import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
 */
