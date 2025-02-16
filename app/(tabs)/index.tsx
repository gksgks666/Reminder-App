import { View, Text, Button, FlatList } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showNotification } from "@/components/UpdateNotificationBar";
import { registerBackgroundTask } from "@/components/BackgroundTask";
import { NotificationItem } from "@/types/Notification";

export default function HomeScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    registerBackgroundTask(); // 백그라운드 태스크 등록
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      showNotification(notifications); // 앱 실행 시 상태바 알림 띄우기
    }
  }, [notifications]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications(); // 알림 목록 로드
    }, [])
  );

  const loadNotifications = async () => {
    const savedNotifications = await AsyncStorage.getItem("notifications");
    const data = savedNotifications ? JSON.parse(savedNotifications) : [];
    setNotifications(data);
    showNotification(data);
  };

  const deleteNotification = async (id: string) => {
    const updatedList = notifications.filter((item) => item.id !== id);
    setNotifications(updatedList);
    await AsyncStorage.setItem("notifications", JSON.stringify(updatedList));
    showNotification(updatedList);
  };

  const completeNotification = async (id: string) => {
    const updatedList = notifications.map((item) =>
      item.id === id ? { ...item, completed: true } : item
    );

    setNotifications(updatedList);
    await AsyncStorage.setItem("notifications", JSON.stringify(updatedList));
    showNotification(updatedList);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>알림 목록</Text>
      <Button title="알림 추가" onPress={() => router.push("/notifications")} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button
              title="오늘 완료"
              onPress={() => completeNotification(item.id)}
              disabled={item.completed}
            />
            <Button title="삭제" onPress={() => deleteNotification(item.id)} />
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
