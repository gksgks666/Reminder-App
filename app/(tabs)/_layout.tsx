import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    setupDailyReset();
  }, []);

  const setupDailyReset = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📌 오늘의 할 일",
        body: "할 일을 확인하세요!",
      },
      trigger: {
        type: "calendar",
        hour: 0,
        minute: 0,
        repeats: true,
      } as Notifications.CalendarTriggerInput,
    });

    const saved = await AsyncStorage.getItem("notifications");

    if (saved) {
      const data = JSON.parse(saved).map((item: any) => ({
        ...item,
        completed: false,
      }));
      await AsyncStorage.setItem("notifications", JSON.stringify(data));
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "알림 목록",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "알림 추가",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

/* import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "알림 목록" }} />
      <Tabs.Screen name="notifications" options={{ title: "알림 추가" }} />
    </Tabs>
  );
} */
