import { AppError, NetworkError, DataError } from './error.utils';

// ===== TYPES =====

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  details?: any;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== BASE API CLIENT =====

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseUrl: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.timeout = 10000; // 10 seconds
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization header
   */
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Make HTTP request with error handling and retries
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
      retries = 3,
      retryDelay = 1000,
    } = config;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    };

    if (body && method !== 'GET') {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    let lastError: Error;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestConfig);
        
        if (!response.ok) {
          throw new NetworkError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            url
          );
        }

        const contentType = response.headers.get('content-type');
        let data: T;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = (await response.text()) as unknown as T;
        }

        return {
          data,
          status: response.status,
          timestamp: new Date().toISOString(),
        };

      } catch (error) {
        lastError = error as Error;
        
        if (attempt === retries || !this.shouldRetry(error as Error)) {
          break;
        }
        
        await this.delay(retryDelay * (attempt + 1));
      }
    }

    throw this.handleRequestError(lastError!, url);
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  /**
   * Upload file with progress tracking
   */
  async upload<T = any>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({
              data,
              status: xhr.status,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            reject(new DataError('Invalid JSON response'));
          }
        } else {
          reject(new NetworkError(
            `Upload failed: ${xhr.statusText}`,
            xhr.status,
            endpoint
          ));
        }
      };

      xhr.onerror = () => {
        reject(new NetworkError('Network error during upload', 0, endpoint));
      };

      xhr.timeout = this.timeout;
      xhr.ontimeout = () => {
        reject(new NetworkError('Upload timeout', 408, endpoint));
      };

      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
      xhr.open('POST', url);
      
      // Add auth header if available
      if (this.defaultHeaders['Authorization']) {
        xhr.setRequestHeader('Authorization', this.defaultHeaders['Authorization']);
      }
      
      xhr.send(formData);
    });
  }

  /**
   * Check if error should trigger a retry
   */
  private shouldRetry(error: Error): boolean {
    if (error instanceof NetworkError) {
      // Retry on network errors and certain HTTP status codes
      return error.status === 0 || 
             error.status >= 500 || 
             error.status === 408 || 
             error.status === 429;
    }
    return false;
  }

  /**
   * Handle and transform request errors
   */
  private handleRequestError(error: Error, url: string): NetworkError {
    if (error instanceof NetworkError) {
      return error;
    }
    
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return new NetworkError('Request timeout', 408, url);
    }
    
    return new NetworkError(`Network request failed: ${error.message}`, 0, url);
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===== PAGINATION HELPERS =====

/**
 * Build pagination parameters for API requests
 */
export const buildPaginationParams = (params: PaginationParams): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  
  if (params.page !== undefined) queryParams.page = params.page.toString();
  if (params.limit !== undefined) queryParams.limit = params.limit.toString();
  if (params.offset !== undefined) queryParams.offset = params.offset.toString();
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
  
  return queryParams;
};

/**
 * Calculate pagination info from response
 */
export const calculatePagination = (
  page: number,
  limit: number,
  total: number
) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    offset: (page - 1) * limit,
  };
};

// ===== RESPONSE FORMATTERS =====

/**
 * Format successful API response
 */
export const formatSuccessResponse = <T>(
  data: T,
  message?: string,
  status: number = 200
): ApiResponse<T> => ({
  data,
  status,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * Format error response
 */
export const formatErrorResponse = (
  error: string,
  message: string,
  status: number = 500,
  details?: any
): ApiError => ({
  error,
  message,
  status,
  timestamp: new Date().toISOString(),
  details,
});

/**
 * Transform backend response to standardized format
 */
export const transformResponse = <T>(response: any): ApiResponse<T> => {
  // Handle different backend response formats
  if (response.success !== undefined) {
    // Format: { success: true, data: {...}, message: "" }
    return {
      data: response.data,
      status: response.success ? 200 : 400,
      message: response.message,
      timestamp: new Date().toISOString(),
    };
  }
  
  if (response.error !== undefined) {
    // Format: { error: true, message: "", code: 400 }
    throw new NetworkError(response.message || 'API Error', response.code || 500);
  }
  
  // Default format: assume the response is the data
  return {
    data: response,
    status: 200,
    timestamp: new Date().toISOString(),
  };
};

// ===== REQUEST INTERCEPTORS =====

/**
 * Request interceptor type
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/**
 * Response interceptor type
 */
export type ResponseInterceptor = <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;

/**
 * Error interceptor type
 */
export type ErrorInterceptor = (error: Error) => Error | Promise<Error>;

/**
 * API client with interceptors
 */
export class InterceptedApiClient extends ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Override request method with interceptors
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Apply request interceptors
      let processedConfig = config;
      for (const interceptor of this.requestInterceptors) {
        processedConfig = await interceptor(processedConfig);
      }

      // Make request
      let response = await super.request<T>(endpoint, processedConfig);

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      return response;

    } catch (error) {
      let processedError = error as Error;
      
      // Apply error interceptors
      for (const interceptor of this.errorInterceptors) {
        processedError = await interceptor(processedError);
      }
      
      throw processedError;
    }
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

/**
 * Parse response headers to object
 */
export const parseResponseHeaders = (response: Response): Record<string, string> => {
  const headers: Record<string, string> = {};
  
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  
  return headers;
};

/**
 * Check if response is JSON
 */
export const isJsonResponse = (response: Response): boolean => {
  const contentType = response.headers.get('content-type');
  return contentType ? contentType.includes('application/json') : false;
};

/**
 * Create abort controller with timeout
 */
export const createTimeoutController = (timeoutMs: number): AbortController => {
  const controller = new AbortController();
  
  setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  return controller;
};

/**
 * Mock API response for testing
 */
export const createMockResponse = <T>(
  data: T,
  delay: number = 0,
  shouldFail: boolean = false
): Promise<ApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new NetworkError('Mock API failure', 500));
      } else {
        resolve({
          data,
          status: 200,
          timestamp: new Date().toISOString(),
        });
      }
    }, delay);
  });
};

// ===== DEFAULT INSTANCE =====

// Create default API client instance
export const apiClient = new ApiClient();