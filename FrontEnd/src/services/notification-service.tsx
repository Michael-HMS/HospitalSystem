import type { INotification } from "../interfaces/INotifications";
// import { api } from "../lib/api";
import { mockNotifications } from "../lib/mockData";

export class NotificationsService {
    static async getAllNotifications(): Promise<INotification[]> {
        return mockNotifications;
        // return await api.get("/notifications");
    }

    static async getNotificationById(id: number): Promise<INotification> {
        return mockNotifications.find(n => n.notification_id === id)!;
        // return await api.get(`/notifications/${id}`);
    }

    static async createNotification(notification: Partial<INotification>): Promise<INotification> {
        const newNotif = { ...notification, notification_id: Date.now() } as INotification;
        mockNotifications.push(newNotif);
        return newNotif;
        // return await api.post("/notifications", notification);
    }

    static async updateNotification(notification: Partial<INotification>): Promise<INotification> {
        const index = mockNotifications.findIndex(n => n.notification_id === notification.notification_id);
        if (index !== -1) mockNotifications[index] = { ...mockNotifications[index], ...notification } as INotification;
        return mockNotifications[index];
        // return await api.put(`/notifications/${notification.notification_id}`, notification);
    }

    static async deleteNotification(notification_id: number): Promise<void> {
        const index = mockNotifications.findIndex(n => n.notification_id === notification_id);
        if (index !== -1) mockNotifications.splice(index, 1);
        // return await api.delete(`/notifications/${notification_id}`);
    }
}
