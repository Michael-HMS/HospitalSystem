import type { INotification } from "../interfaces/INotifications";
import { api } from "../lib/api";

export class NotificationsService {
    static async getAllNotifications(): Promise<INotification[]> {
        return await api.get("/notifications");
    }

    static async getNotificationById(id: number): Promise<INotification> {
        return await api.get(`/notifications/${id}`);
    }

    static async createNotification(notification: Partial<INotification>): Promise<INotification> {
        return await api.post("/notifications", notification);
    }

    static async updateNotification(notification: Partial<INotification>): Promise<INotification> {
        return await api.put(`/notifications/${notification.notification_id}`, notification);
    }

    static async deleteNotification(notification_id: number): Promise<void> {
        return await api.delete(`/notifications/${notification_id}`);
    }
}
