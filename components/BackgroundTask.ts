import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dailyResetNotification } from "@/components/UpdateNotificationBar";

const BACKGROUND_FETCH_TASK = "daily-reset-task";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 포맷
    const lastReset = await AsyncStorage.getItem("lastResetDate");

    if (lastReset !== today) {
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
        await AsyncStorage.setItem("lastResetDate", today); // 마지막 초기화 날짜 저장
        await Notifications.dismissAllNotificationsAsync(); // 기존 알림 삭제
        dailyResetNotification(notifications); // 알림 업데이트
      }
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
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

  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 60 * 24, // 24시간마다 실행 (실제 00시에 실행)
    //stopOnTerminate: false, // 앱 종료 후에도 유지
    //startOnBoot: true, // 기기 부팅 후에도 실행
  });
};
