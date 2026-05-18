import type { INotification } from "../interfaces/INotifications";

// Notifications are not yet exposed by the backend API.
// This service returns empty data until a /api/notifications endpoint is added.

export class NotificationsService {
    static async getAllNotifications(): Promise<INotification[]> {
        return [];
    }

    static async getNotificationById(_id: number): Promise<INotification> {
        throw new Error("Notifications endpoint not yet available");
    }

    static async createNotification(_notification: Partial<INotification>): Promise<INotification> {
        throw new Error("Notifications endpoint not yet available");
    }

    static async updateNotification(_notification: Partial<INotification>): Promise<INotification> {
        throw new Error("Notifications endpoint not yet available");
    }

    static async deleteNotification(_notification_id: number): Promise<void> {
        // No endpoint
    }
}
