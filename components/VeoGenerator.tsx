

import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { fileToBase64 } from '../utils/helpers';const VeoGenerator: React.FC = () => {
    const [apiKeySelected, setApiKeySelected] = useState<boolean | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState<string>('Animate this image beautifully.');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    const loadingMessages = [
        "Warming up the AI artists...",
        "Analyzing image pixels...",
        "Storyboarding the animation...",
        "Rendering video frames...",
        "Adding special effects...",
        "Finalizing the masterpiece...",
        "This can take a few minutes, please wait..."
    ];

    const checkApiKey = useCallback(async () => {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
        } else {
            // Fallback for environments where aistudio is not available
            setApiKeySelected(true); 
            console.warn("window.aistudio not found. Assuming API key is set via environment.");
        }
    }, []);

    useEffect(() => {
        checkApiKey();
    }, [checkApiKey]);
    
    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let i = 0;
            setLoadingMessage(loadingMessages[i]);
            interval = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume success to avoid race conditions, will be verified on next API call
            setApiKeySelected(true);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setVideoUrl(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            setError("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
            const base64Image = await fileToBase64(imageFile);
            const url = await apiService.generateVideo(prompt, base64Image, imageFile.type, aspectRatio);
            setVideoUrl(url);
        } catch (err: any) {
            console.error("Video generation error:", err);
            let errorMessage = err.message || "An unknown error occurred.";
            if (errorMessage.includes("Requested entity was not found")) {
                errorMessage = "API Key not found or invalid. Please check backend configuration.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (apiKeySelected === null) {
        return <div className="text-center p-8">Checking API Key...</div>;
    }

    if (!apiKeySelected) {
        return (
            <div className="text-center p-8 bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">API Key Required</h2>
                <p className="mb-4 text-gray-400">To use the Veo Video Generation feature, you need to select an API key.</p>
                <p className="mb-6 text-sm text-gray-500">
                    For billing information, please visit{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                        ai.google.dev/gemini-api/docs/billing
                    </a>.
                </p>
                <button onClick={handleSelectKey} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold">
                    Select API Key
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">AI Video Generator (Veo)</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">1. Upload Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md transition-colors duration-300 hover:border-indigo-500">
                        <div className="space-y-1 text-center">
                           {imageFile ? (
                               <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mx-auto h-32 rounded-md"/>
                           ) : (
                            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                           )}
                            <div className="flex text-sm text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500 px-2">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">{imageFile ? imageFile.name : 'or drag and drop'}</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">2. Enter Prompt</label>
                    <textarea id="prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">3. Select Aspect Ratio</label>
                    <div className="flex space-x-4">
                        <button type="button" onClick={() => setAspectRatio('16:9')} className={`px-4 py-2 rounded-md ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Landscape (16:9)</button>
                        <button type="button" onClick={() => setAspectRatio('9:16')} className={`px-4 py-2 rounded-md ${aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Portrait (9:16)</button>
                    </div>
                </div>

                <button type="submit" disabled={isLoading || !imageFile} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {isLoading ? 'Generating...' : 'Generate Video'}
                </button>
            </form>

            {isLoading && (
                 <div className="mt-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto"></div>
                    <p className="mt-4 text-indigo-300">{loadingMessage}</p>
                </div>
            )}

            {error && <div className="mt-6 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-md">{error}</div>}
            
            {videoUrl && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4 text-center">Generated Video</h3>
                    <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg shadow-lg"></video>
                </div>
            )}
        </div>
    );
};

export default VeoGenerator;
