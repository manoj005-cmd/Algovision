// Ensure API base includes '/api' regardless of VITE_API_URL value
const RAW_BASE = ((import.meta as any).env?.VITE_API_URL as string | undefined) || undefined;
const NORMALIZED_BASE = RAW_BASE ? RAW_BASE.replace(/\/+$/, '') : undefined;
const API_URL = NORMALIZED_BASE
    ? (NORMALIZED_BASE.endsWith('/api') ? NORMALIZED_BASE : `${NORMALIZED_BASE}/api`)
    : 'http://localhost:5000/api';

class ApiService {
    private token: string | null;

    constructor() {
        this.token = localStorage.getItem('algoToken');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('algoToken', token);
        } else {
            localStorage.removeItem('algoToken');
        }
    }

    getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint: string, options: RequestInit = {}): Promise<any> {
        const url = `${API_URL}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...(options.headers || {}),
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async signup(userData: { name: string; studentId: string; phone: string; email: string; password: string }) {
        const data = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        this.setToken(data.token);
        return data;
    }

    async login(credentials: { email: string; password: string }) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        this.setToken(data.token);
        return data;
    }

    async verifyToken() {
        return this.request('/auth/verify');
    }

    // AI endpoints
    async getAlgorithmSuggestion(array: number[], algorithm: string): Promise<string> {
        const data = await this.request('/ai/algorithm-suggestion', {
            method: 'POST',
            body: JSON.stringify({ array, algorithm }),
        });
        return data.suggestion;
    }

    async getComplexityAnalysis(array: number[]): Promise<string> {
        const data = await this.request('/ai/complexity-analysis', {
            method: 'POST',
            body: JSON.stringify({ array }),
        });
        return data.analysis;
    }

    async generateVideo(prompt: string, base64Image: string, mimeType: string, aspectRatio: '16:9' | '9:16'): Promise<string> {
        const data = await this.request('/ai/generate-video', {
            method: 'POST',
            body: JSON.stringify({ prompt, base64Image, mimeType, aspectRatio }),
        });
        // Convert base64 back to blob URL
        const byteCharacters = atob(data.videoData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'video/mp4' });
        return URL.createObjectURL(blob);
    }

    async getLowLatencyResponse(prompt: string): Promise<string> {
        const data = await this.request('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ prompt }),
        });
        return data.response;
    }

    logout() {
        this.setToken(null);
        localStorage.removeItem('algoUser');
        localStorage.removeItem('quizHistory');
    }
}

export const apiService = new ApiService();
