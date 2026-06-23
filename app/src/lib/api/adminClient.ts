import { useServerStore } from '@/stores/serverStore';
import type { AIProvider } from '@/stores/aiProviderStore';

export interface LoginRequest {
  admin_id: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  session_token?: string;
  expires_at?: string;
  message: string;
}

export interface AdminStatus {
  status: string;
  providers_count: number;
  active_providers: number;
  total_requests_today: number;
  last_check: string;
}

class AdminAPIClient {
  private getServerUrl(): string {
    return useServerStore.getState().serverUrl;
  }

  async login(adminId: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.getServerUrl()}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_id: adminId, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async logout(sessionToken: string): Promise<{ message: string }> {
    const response = await fetch(`${this.getServerUrl()}/admin/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: sessionToken }),
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  }

  async validateSession(sessionToken: string): Promise<{ is_valid: boolean; expires_at?: string }> {
    const response = await fetch(`${this.getServerUrl()}/admin/validate-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: sessionToken }),
    });

    if (!response.ok) {
      throw new Error('Session validation failed');
    }

    return response.json();
  }

  async refreshSession(sessionToken: string): Promise<LoginResponse> {
    const response = await fetch(`${this.getServerUrl()}/admin/refresh-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_token: sessionToken }),
    });

    if (!response.ok) {
      throw new Error('Session refresh failed');
    }

    return response.json();
  }

  async getAdminStatus(): Promise<AdminStatus> {
    const response = await fetch(`${this.getServerUrl()}/admin/status`);

    if (!response.ok) {
      throw new Error('Failed to fetch admin status');
    }

    return response.json();
  }

  async createProvider(provider: AIProvider): Promise<{ success: boolean; provider?: AIProvider }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: provider.id,
        name: provider.name,
        type: provider.type,
        api_key: provider.apiKey,
        is_active: provider.isActive,
        models: provider.models,
        selected_model: provider.selectedModel,
        base_url: provider.baseUrl,
        rate_limit: provider.rateLimit,
        usage_stats: provider.usageStats,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create provider');
    }

    return response.json();
  }

  async listProviders(): Promise<{ success: boolean; count: number; providers: AIProvider[] }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/list`);

    if (!response.ok) {
      throw new Error('Failed to list providers');
    }

    return response.json();
  }

  async getProvider(providerId: string): Promise<{ success: boolean; provider?: AIProvider }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/${providerId}`);

    if (!response.ok) {
      throw new Error('Failed to get provider');
    }

    return response.json();
  }

  async updateProvider(
    providerId: string,
    updates: Partial<AIProvider>,
  ): Promise<{ success: boolean; provider?: AIProvider }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/${providerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update provider');
    }

    return response.json();
  }

  async deleteProvider(providerId: string): Promise<{ message: string }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/${providerId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete provider');
    }

    return response.json();
  }

  async activateProvider(providerId: string): Promise<{ success: boolean; provider?: AIProvider }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/${providerId}/activate`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to activate provider');
    }

    return response.json();
  }

  async deactivateProvider(
    providerId: string,
  ): Promise<{ success: boolean; provider?: AIProvider }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/${providerId}/deactivate`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to deactivate provider');
    }

    return response.json();
  }

  async testProvider(providerId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/${providerId}/test`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to test provider');
    }

    return response.json();
  }

  async getCompletion(providerId: string, prompt: string): Promise<{ response: string }> {
    const response = await fetch(`${this.getServerUrl()}/ai-providers/${providerId}/completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to get completion');
    }

    return response.json();
  }
}

export const adminClient = new AdminAPIClient();
