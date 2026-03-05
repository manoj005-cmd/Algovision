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
        void endpoint;
        void options;
        throw new Error('Backend has been removed. This feature is unavailable without a backend API.');
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
        const n = array.length;
        const sortedPairs = array.slice(1).filter((v, i) => array[i] <= v).length;
        const sortedness = n <= 1 ? 1 : sortedPairs / (n - 1);
        const isSorting = ['Quick Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'].includes(algorithm);

        if (!isSorting) {
            return `AI Suggestion\n\nFor searching, if your data is sorted, prefer Binary Search (O(log n)). Otherwise use Linear Search (O(n)).`;
        }

        if (n <= 25 && sortedness > 0.8) {
            return `AI Suggestion\n\nYour array is small and already somewhat sorted. Insertion Sort often performs very well here (near O(n)).`;
        }
        if (n <= 40) {
            return `AI Suggestion\n\nFor small arrays, Insertion Sort is a strong practical choice; for guaranteed O(n log n), choose Merge Sort.`;
        }
        return `AI Suggestion\n\nFor larger inputs, prefer Merge Sort for predictable O(n log n). Quick Sort is also fast on average but can degrade to O(n^2) in worst cases.`;
    }

    async getComplexityAnalysis(array: number[]): Promise<string> {
        const n = array.length;
        const sortedPairs = array.slice(1).filter((v, i) => array[i] <= v).length;
        const sortedness = n <= 1 ? 1 : sortedPairs / (n - 1);
        const hasManyDuplicates = new Set(array).size / Math.max(1, n) < 0.7;

        const lines: string[] = [];
        lines.push('AI-Powered Analysis');
        lines.push('');
        lines.push(`Input size: ${n}`);
        lines.push(`Estimated sortedness: ${(sortedness * 100).toFixed(0)}%`);
        lines.push(`Duplicates: ${hasManyDuplicates ? 'many' : 'few'}`);
        lines.push('');
        lines.push('Recommendation:');
        if (n <= 25 && sortedness > 0.8) {
            lines.push('- Sorting: Insertion Sort (very good on nearly-sorted small arrays).');
        } else {
            lines.push('- Sorting: Merge Sort for consistent O(n log n), or Quick Sort for average-case speed.');
        }
        lines.push('- Searching: Binary Search only if sorted; otherwise Linear Search.');
        lines.push('');
        lines.push('Note: Backend AI service has been removed, so this is a local heuristic summary.');
        return lines.join('\n');
    }

    async generateVideo(prompt: string, base64Image: string, mimeType: string, aspectRatio: '16:9' | '9:16'): Promise<string> {
        void prompt;
        void base64Image;
        void mimeType;
        void aspectRatio;
        throw new Error('Video generation requires a backend service. Backend has been removed.');
    }

    async getLowLatencyResponse(prompt: string): Promise<string> {
        const trimmed = prompt.trim();
        if (!trimmed) return 'Please enter a question.';
        return 'Backend AI chat has been removed for deployment. This is an offline build, so AI responses are unavailable.';
    }

    logout() {
        this.setToken(null);
        localStorage.removeItem('algoUser');
        localStorage.removeItem('quizHistory');
    }
}

export const apiService = new ApiService();
