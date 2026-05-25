export class BrowserStorage {
  public static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  public static setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("storage"));
  }

  public static removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
  }
}
