import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateNotificationBar } from "@/components/UpdateNotificationBar";

const BACKGROUND_FETCH_TASK = "daily-reset-task";

// 특정 시간 범위 확인 함수
const isResetTime = () => {
  const hours = new Date().getHours();
  return hours >= 0 && hours < 9; // 00:00 ~ 08:59
};

const resetNotification = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const lastReset = await AsyncStorage.getItem("lastResetDate");

    if (today !== lastReset) {
      const saved = await AsyncStorage.getItem("notifications");
      if (saved) {
        const notifications = JSON.parse(saved).map((e: any) => ({
          ...e,
          completed: false,
        }));

        await AsyncStorage.setItem(
          "notifications",
          JSON.stringify(notifications)
        );
        await AsyncStorage.setItem("lastResetDate", today);
        await Notifications.dismissAllNotificationsAsync(); // 기존 알림 삭제
        await updateNotificationBar(notifications); // 알림 업데이트
      }
    }
  } catch (error) {
    console.error("알림이 초기화되지 않음", error);
  }
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  // isResetTime이 false면 background task를 실행하지 않음
  if (!isResetTime()) return BackgroundFetch.BackgroundFetchResult.NoData;
  await resetNotification();
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export const registerBackgroundTask = async () => {
  const status = await BackgroundFetch.getStatusAsync();

  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    console.log("백그라운드 작업이 허용되지 않음");
    return;
  }

  if (isResetTime()) await resetNotification();

  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 60 * 9, // 9시간마다 실행
    stopOnTerminate: false, // 앱 종료 후에도 유지
    startOnBoot: true, // 기기 부팅 후에도 실행
  });
};
