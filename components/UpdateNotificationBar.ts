import * as Notifications from "expo-notifications";
import { NotificationItem } from "@/types/Notification";

export const showNotification = (notifiList: NotificationItem[]) => {
  const trigger = null;

  updateNotificationBar(notifiList, trigger);
};

export const dailyResetNotification = (notifiList: NotificationItem[]) => {
  const trigger = {
    type: "calendar",
    hour: 0,
    minute: 0,
    repeats: true,
  } as Notifications.CalendarTriggerInput;

  updateNotificationBar(notifiList, trigger);
};

export const updateNotificationBar = async (
  notifiList: NotificationItem[],
  trigger: Notifications.NotificationTriggerInput | null
) => {
  await Notifications.dismissAllNotificationsAsync();
  const activeNoti = notifiList.filter((item) => !item.completed);

  if (activeNoti.length > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "오늘의 할 일",
        body: `${activeNoti.length}개의 할 일이 있습니다.`,
        sticky: true,
      },
      trigger,
    });
  } else {
    await Notifications.dismissAllNotificationsAsync();
  }
};
