export interface NotificationDto {
  id?: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timeout?: number;
}
