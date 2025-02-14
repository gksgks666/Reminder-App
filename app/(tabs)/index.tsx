import { View, Text, Button, FlatList } from "react-native";
import { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { registerBackgroundTask } from "@/components/BackgroundTask";

// 알림 데이터 타입 정의
interface NotificationItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
      registerBackgroundTask(); // 백그라운드 태스크 등록
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

  const updateNotificationBar = async (notifiList: NotificationItem[]) => {
    await Notifications.dismissAllNotificationsAsync();
    const activeNoti = notifiList.filter((item) => !item.completed);

    if (activeNoti.length > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "오늘의 할 일",
          body: `${activeNoti.length}개의 할 일이 있습니다.`,
          sticky: true,
        },
        trigger: {
          type: "calendar",
          hour: 0,
          minute: 0,
          repeats: true,
        } as Notifications.CalendarTriggerInput,
        //trigger: null,
      });
    } else {
      await Notifications.dismissAllNotificationsAsync();
    }
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
