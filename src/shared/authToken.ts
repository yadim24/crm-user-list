/* eslint-disable class-methods-use-this */
const REFRESH_TOKEN_NAME = 'hjdlfkghje';
type SubscribeCallback = () => void;

export class AuthTokenStore {
  private accessToken: string | null = null;

  private subscribers: SubscribeCallback[] = [];

  subscribe(callback: SubscribeCallback): () => void {
    this.subscribers.push(callback);

    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: SubscribeCallback): void {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== callback,
    );
  }

  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
    this.notifySubscribers();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  deleteAccessToken(): void {
    this.accessToken = null;
    this.notifySubscribers();
  }

  setRefreshToken(refreshToken: string): void {
    sessionStorage.setItem(REFRESH_TOKEN_NAME, refreshToken);
  }

  getRefreshToken(): string | null {
    // Удалить значение ключа, когда заработает эндпоинт
    return sessionStorage.getItem(REFRESH_TOKEN_NAME);
  }

  deleteRefreshToken(): void {
    return sessionStorage.removeItem(REFRESH_TOKEN_NAME);
  }

  notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback());
  }
}

export const authTokenStore = new AuthTokenStore();
