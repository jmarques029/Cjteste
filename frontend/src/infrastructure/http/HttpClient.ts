export class HttpError extends Error {
  constructor(public status: number, message: string, public body?: any) {
    super(message);
    this.name = "HttpError";
  }
}

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let body;
        try {
          body = await response.json();
        } catch {
          body = null;
        }
        throw new HttpError(
          response.status,
          body?.detail?.[0]?.msg ?? body?.detail ?? "Erro na requisição HTTP",
          body
        );
      }

      // Se for no-content ou similar
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão de rede.");
    }
  }

  public async postForm<T>(
    endpoint: string,
    body: URLSearchParams,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        let errorBody;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = null;
        }
        throw new HttpError(
          response.status,
          errorBody?.detail ?? "Falha de autenticação",
          errorBody
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão de rede.");
    }
  }
}
