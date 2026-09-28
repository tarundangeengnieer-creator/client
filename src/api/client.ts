/**
 * ASHIELDER Central API Client & Transport Layer
 * Adheres to Section 9 of ASHIELDER_FRONTEND_ARCHITECTURE.md
 */

import {
  AuthenticationError,
  BackendExecutionError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  PayloadTooLargeError,
  RateLimitError,
  ValidationError,
} from './errors.ts';
import { ENV } from '../config/env.ts';

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  skipAuth?: boolean;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? ENV.API_BASE_URL;
  }

  public getApiKey(): string | null {
    try {
      return sessionStorage.getItem('ashielder_api_key');
    } catch {
      return null;
    }
  }

  public setApiKey(key: string): void {
    try {
      sessionStorage.setItem('ashielder_api_key', key);
    } catch (e) {
      console.error('Failed to write API key to sessionStorage', e);
    }
  }

  public clearApiKey(): void {
    try {
      sessionStorage.removeItem('ashielder_api_key');
    } catch (e) {
      console.error('Failed to clear API key from sessionStorage', e);
    }
  }

  public setToken(token: string): void {
    try {
      sessionStorage.setItem('ashielder_bearer_token', token);
    } catch (e) {
      console.error('Failed to write token to sessionStorage', e);
    }
  }

  public getToken(): string | null {
    try {
      return sessionStorage.getItem('ashielder_bearer_token');
    } catch {
      return null;
    }
  }

  public clearToken(): void {
    try {
      sessionStorage.removeItem('ashielder_bearer_token');
    } catch {}
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 30000, skipAuth = false, headers = {}, ...rest } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const requestHeaders: Record<string, string> = {
      'X-Request-ID': crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      ...(headers as Record<string, string>),
    };

    if (!skipAuth) {
      const token = this.getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        const apiKey = this.getApiKey();
        if (apiKey) {
          requestHeaders['X-API-Key'] = apiKey;
        }
      }
    }

    const url = this.baseUrl ? `${this.baseUrl.replace(/\/$/, '')}${endpoint}` : endpoint;

    try {
      const response = await fetch(url, {
        ...rest,
        headers: requestHeaders,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // If empty response or 204
      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as unknown as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new NetworkError(`Request timed out after ${timeoutMs}ms`);
        }
        if ('code' in err) {
          throw err;
        }
      }

      throw new NetworkError(err instanceof Error ? err.message : 'Network request failed');
    }
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  public async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...((options?.headers as Record<string, string>) || {}),
    };
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
      headers,
    });
  }

  public async postForm<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    // Note: Do NOT set Content-Type header when sending FormData; browser calculates multipart boundary
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      ...options,
    });
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorDetail: unknown = null;
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

    try {
      const data = await response.json();
      errorDetail = data;
      if (data && typeof data === 'object') {
        if ('detail' in data && typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if ('message' in data && typeof data.message === 'string') {
          errorMessage = data.message;
        }
      }
    } catch {
      // Non-JSON response
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {
        // Fallback
      }
    }

    switch (response.status) {
      case 401:
        throw new AuthenticationError(errorMessage, errorDetail);
      case 403:
        throw new ForbiddenError(errorMessage, errorDetail);
      case 404:
        throw new NotFoundError(errorMessage, errorDetail);
      case 413:
        throw new PayloadTooLargeError(errorMessage, errorDetail);
      case 422:
        throw new ValidationError(errorMessage, errorDetail);
      case 429: {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        throw new RateLimitError(errorMessage, isNaN(retryAfter) ? 60 : retryAfter, errorDetail);
      }
      default:
        throw new BackendExecutionError(errorMessage, response.status, errorDetail);
    }
  }
}

export const apiClient = new ApiClient();
