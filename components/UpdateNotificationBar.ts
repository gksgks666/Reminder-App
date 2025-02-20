import * as Notifications from "expo-notifications";
import { NotificationItem } from "@/types/Notification";

export const updateNotificationBar = async (notifiList: NotificationItem[]) => {
  await Notifications.dismissAllNotificationsAsync();
  const activeNoti = notifiList.filter((item) => !item.completed);

  if (activeNoti.length > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "오늘의 할 일",
        body: `${activeNoti.length}개의 할 일이 있습니다.`,
        sticky: true,
      },
      trigger: null,
    });
  } else {
    await Notifications.dismissAllNotificationsAsync();
  }
};
