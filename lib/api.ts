import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

// Default config for API requests
const defaultConfig: AxiosRequestConfig = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries

class ApiClient {
  private baseUrl: string;
  private fallbackUrl: string;

  constructor() {
    // Set base URLs with fallbacks
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE || '/api';
    this.fallbackUrl = '/';
  }

  // Helper to get auth token from localStorage
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Helper to create config with auth headers
  private createConfig(config: AxiosRequestConfig = {}): AxiosRequestConfig {
    const token = this.getAuthToken();
    const headers = { ...defaultConfig.headers, ...config.headers };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return { ...defaultConfig, ...config, headers };
  }

  // Execute request with retry logic
  private async executeRequest<T>(
    method: string,
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    const fullConfig = this.createConfig(config);
    let retries = 0;
    let useFallback = false;
    
    while (retries <= MAX_RETRIES) {
      try {
        // Determine which base URL to use
        const baseUrl = useFallback ? this.fallbackUrl : this.baseUrl;
        const fullUrl = `${baseUrl}${url}`;
        
        let response: AxiosResponse<T>;
        
        switch (method.toLowerCase()) {
          case 'get':
            response = await axios.get<T>(fullUrl, fullConfig);
            break;
          case 'post':
            response = await axios.post<T>(fullUrl, data, fullConfig);
            break;
          case 'put':
            response = await axios.put<T>(fullUrl, data, fullConfig);
            break;
          case 'delete':
            response = await axios.delete<T>(fullUrl, fullConfig);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        
        // Check for network errors that should trigger retry
        if (
          !axiosError.response &&
          axiosError.code !== 'ECONNABORTED' &&
          retries < MAX_RETRIES
        ) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
          continue;
        }
        
        // Try fallback URL if we're not already using it
        if (!useFallback && retries === MAX_RETRIES / 2) {
          useFallback = true;
          continue;
        }
        
        // Handle API errors
        const statusCode = axiosError.response?.status;
        const errorData = axiosError.response?.data as Record<string, any> | undefined;
        const errorMessage = errorData?.message || axiosError.message || 'Unknown error occurred';
        
        // Show error toast
        toast.error(`API Error: ${errorMessage}`);
        
        // Throw error for specific handling
        throw error;
      }
    }
    
    throw new Error('Maximum retries exceeded');
  }

  // API method implementations
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest<T>('get', url, undefined, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest<T>('post', url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest<T>('put', url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest<T>('delete', url, config);
  }

  // File upload with progress tracking
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (percentage: number) => void,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadConfig = this.createConfig({
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config?.headers || {}),
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      },
    });
    
    // Try primary URL first, then fallback
    try {
      const response = await axios.post<T>(`${this.baseUrl}${url}`, formData, uploadConfig);
      return response.data;
    } catch (error) {
      // Try fallback URL
      try {
        const response = await axios.post<T>(`${this.fallbackUrl}${url}`, formData, uploadConfig);
        return response.data;
      } catch (fallbackError) {
        // Show error toast
        const axiosError = fallbackError as AxiosError;
        const errorData = axiosError.response?.data as Record<string, any> | undefined;
        const errorMessage = errorData?.message || axiosError.message || 'Unknown upload error';
        
        toast.error(`Upload Error: ${errorMessage}`);
        throw fallbackError;
      }
    }
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
