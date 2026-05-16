import type { INotification } from "../interfaces/INotifications";

const notificationsArray: INotification[] = [
    {
        notification_id: 1,
        user_id: 1,
        title: "Notification 1",
        message: "Message 1",
        is_read: false,
        created_at: "2022-01-01"
    }
];

export class NotificationsService {
    static async getAllNotifications(): Promise<INotification[]> {
        return notificationsArray;
    }
    static async getNotificationById(id: number): Promise<INotification> {
        return notificationsArray.find((notification) => notification.notification_id === id)!;
    }
    static async createNotification(notification: INotification): Promise<INotification> {
        notificationsArray.push(notification);
        return notification;
    }
    static async updateNotification(notification: INotification): Promise<INotification> {
        const index = notificationsArray.findIndex((notification) => notification.notification_id === notification.notification_id);
        notificationsArray[index] = notification;
        return notification;
    }
    static async deleteNotification(notification_id: number): Promise<void> {
        const index = notificationsArray.findIndex((notification) => notification.notification_id === notification_id);
        notificationsArray.splice(index, 1);
    }
    //     static async getAllNotifications(): Promise<INotification[]> {
    //         const response = await api.get("/notifications");
    //         return response.data;
    //     }

    //     static async getNotificationById(id: number): Promise<INotification> {
    //         const response = await api.get(`/notifications/${id}`);
    //         return response.data;
    //     }
    
    //     static async createNotification(notification: INotification): Promise<INotification> {
    //         const response = await api.post("/notifications", notification);
    //         return response.data;
    //     }
    
    //     static async updateNotification(notification: INotification): Promise<INotification> {
    //         const response = await api.put(`/notifications/${notification.notification_id}`, notification);
    //         return response.data;
    //     }
    
    //     static async deleteNotification(notification_id: number): Promise<void> {
    //         const response = await api.delete(`/notifications/${notification_id}`);
    //         return response.data;
    //     }
}
