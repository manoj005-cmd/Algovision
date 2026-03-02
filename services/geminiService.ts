import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion } from '../types';

export const getAiClient = () => {
    if (!process.env.API_KEY) {
        // Throw an error for clearer failure cause if API key is missing.
        throw new Error("API_KEY environment variable not set. Please configure it to use AI features.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getAlgorithmSuggestion = async (array: number[], algorithm: string): Promise<string> => {
    const ai = getAiClient();
    const isSorting = ['Quick Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'].includes(algorithm);
    const relevantAlgorithms = isSorting 
        ? "Quick Sort, Merge Sort, Selection Sort, and Insertion Sort"
        : "Linear Search and Binary Search";

    const prompt = `
        An array of numbers was provided for algorithm visualization: [${array.join(', ')}].
        The user chose to visualize the "${algorithm}" algorithm.

        Analyze the characteristics of this specific array (e.g., its size=${array.length}, initial sortedness, presence of duplicates, range of values).
        
        Based on this analysis, and in a natural, conversational tone, provide a concise recommendation for the most efficient algorithm among ${relevantAlgorithms} for this particular array. 
        
        Explain your reasoning clearly, considering factors like best-case, average-case, and worst-case performance scenarios as they apply to this input.
        
        Start your response with a title like "AI Suggestion". Do not use any markdown formatting (like asterisks for bolding or hash symbols for headings). Just provide a clean, plain text response as if you were explaining it to a student.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error: any) {
        console.error("Error getting algorithm suggestion:", error);
        throw new Error(`AI Suggestion Failed: ${error.message}`);
    }
};

export const getComplexityAnalysis = async (array: number[]): Promise<string> => {
    const ai = getAiClient();
    const prompt = `
        Analyze the following array of numbers: [${array.join(', ')}].
        The array has ${array.length} elements.

        In a natural, conversational tone, provide a summary analysis comparing the suitability of Quick Sort, Merge Sort, Selection Sort, Insertion Sort, Linear Search, and Binary Search for this specific array.
        
        Conclude with a clear recommendation for the single best sorting algorithm and the single best searching algorithm for this particular input. Explain your choices based on performance trade-offs.
        
        Please start your response with a title like "AI-Powered Analysis". Do not use any markdown formatting like asterisks for bolding or hash symbols for headings. Just provide a clean, plain text response as if you were explaining it to a student.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error: any) {
        console.error("Error getting complexity analysis:", error);
        throw new Error(`AI Analysis Failed: ${error.message}`);
    }
};

// Fix: Add generateVideo function for VeoGenerator component.
export const generateVideo = async (
    prompt: string,
    base64Image: string,
    mimeType: string,
    aspectRatio: '16:9' | '9:16'
): Promise<string> => {
    // Create new client for each call to get latest key, as per guidelines
    const ai = getAiClient();

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: base64Image,
            mimeType: mimeType,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed, no download link found.");
    }

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

// Fix: Add getLowLatencyResponse function for AiAssistant component.
export const getLowLatencyResponse = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // To ensure low latency, we can disable thinking.
                thinkingConfig: { thinkingBudget: 0 }
            }
        });
        return response.text;
    } catch (error: any) {
        console.error("Error getting low latency response:", error);
        throw new Error(`AI Assistant Failed: ${error.message}`);
    }
};