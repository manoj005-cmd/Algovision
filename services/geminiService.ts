import type { QuizQuestion } from '../types';

export const getAiClient = () => {
    throw new Error('AI client is not available. Backend/Gemini integration has been removed.');
}

export const getAlgorithmSuggestion = async (array: number[], algorithm: string): Promise<string> => {
    void algorithm;
    const n = array.length;
    const sortedPairs = array.slice(1).filter((v, i) => array[i] <= v).length;
    const sortedness = n <= 1 ? 1 : sortedPairs / (n - 1);
    if (n <= 25 && sortedness > 0.8) {
        return 'AI Suggestion\n\nOffline mode: Your array is small and already somewhat sorted. Insertion Sort often performs very well here.';
    }
    return 'AI Suggestion\n\nOffline mode: For consistent performance, prefer Merge Sort (O(n log n)).';
};

export const getComplexityAnalysis = async (array: number[]): Promise<string> => {
    const n = array.length;
    return `AI-Powered Analysis\n\nOffline mode: Input size ${n}.\n\nRecommendation:\n- Sorting: Merge Sort (stable, predictable)\n- Searching: Binary Search only if sorted; else Linear Search`;
};

// Fix: Add generateVideo function for VeoGenerator component.
export const generateVideo = async (
    prompt: string,
    base64Image: string,
    mimeType: string,
    aspectRatio: '16:9' | '9:16'
): Promise<string> => {
    void prompt;
    void base64Image;
    void mimeType;
    void aspectRatio;
    throw new Error('Video generation is not available in offline mode.');
};

// Fix: Add getLowLatencyResponse function for AiAssistant component.
export const getLowLatencyResponse = async (prompt: string): Promise<string> => {
    void prompt;
    return 'Offline mode: AI assistant is unavailable because backend/Gemini integration has been removed.';
};