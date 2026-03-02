import React, { useState } from 'react';
import { ALGORITHMS } from '../constants';
import { getPredictedPerformance, getBigOExplanation } from '../utils/helpers';
import { apiService } from '../services/apiService';
import { Algorithm } from '../types';

interface AnalysisResult {
  algorithm: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  predicted: string;
}

const COMPLEXITY_DATA = {
    [Algorithm.QuickSort]: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n^2)' },
    [Algorithm.MergeSort]: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
    [Algorithm.SelectionSort]: { best: 'O(n^2)', avg: 'O(n^2)', worst: 'O(n^2)' },
    [Algorithm.InsertionSort]: { best: 'O(n)', avg: 'O(n^2)', worst: 'O(n^2)' },
    [Algorithm.LinearSearch]: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' },
    [Algorithm.BinarySearch]: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' },
};


const ComplexityAnalyzer: React.FC = () => {
    const [userInput, setUserInput] = useState('44, 75, 23, 43, 55, 12, 64, 77, 33');
    const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        const parsedArray = userInput.split(',').map(s => s.trim()).filter(Boolean).map(Number);
        if (parsedArray.some(isNaN)) {
            setError("Invalid input. Please enter comma-separated numbers only.");
            setAnalysisResults([]);
            setAiSummary(null);
            return;
        }
        if (parsedArray.length === 0) {
            setError("Input cannot be empty.");
            setAnalysisResults([]);
            setAiSummary(null);
            return;
        }

        setError(null);
        setIsLoading(true);
        setAiSummary(null);

        const results: AnalysisResult[] = ALGORITHMS.map(alg => ({
            algorithm: alg,
            bestCase: COMPLEXITY_DATA[alg]?.best || 'N/A',
            averageCase: COMPLEXITY_DATA[alg]?.avg || 'N/A',
            worstCase: COMPLEXITY_DATA[alg]?.worst || 'N/A',
            predicted: getPredictedPerformance(alg, parsedArray),
        }));

        setAnalysisResults(results);

        try {
            const summary = await apiService.getComplexityAnalysis(parsedArray);
            setAiSummary(summary);
        } catch (err: any) {
            setAiSummary(err.message || "An unknown error occurred during AI analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Complexity Analyzer</h2>
            <p className="text-center text-gray-400 mb-6">Enter an array to compare algorithm performance and get an AI-powered recommendation.</p>
            
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-grow bg-gray-700 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g., 5, 2, 8, 1, 9"
                />
                <button onClick={handleAnalyze} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 p-2 px-6 rounded-md font-semibold disabled:opacity-50">
                    {isLoading ? 'Analyzing...' : 'Analyze'}
                </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            {analysisResults.length > 0 && (
                <div className="mt-8 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="p-3 font-semibold">Algorithm</th>
                                <th className="p-3 font-semibold">Best Case</th>
                                <th className="p-3 font-semibold">Average Case</th>
                                <th className="p-3 font-semibold">Worst Case</th>
                                <th className="p-3 font-semibold text-yellow-300">Predicted on Input</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysisResults.map((res, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                                    <td className="p-3 font-medium">{res.algorithm}</td>
                                    <td className="p-3 font-mono">
                                        <span data-tooltip={getBigOExplanation(res.bestCase)}>{res.bestCase}</span>
                                    </td>
                                    <td className="p-3 font-mono">
                                        <span data-tooltip={getBigOExplanation(res.averageCase)}>{res.averageCase}</span>
                                    </td>
                                    <td className="p-3 font-mono">
                                        <span data-tooltip={getBigOExplanation(res.worstCase)}>{res.worstCase}</span>
                                    </td>
                                    <td className="p-3 font-mono text-yellow-300 bg-gray-900/30">
                                        <span data-tooltip={getBigOExplanation(res.predicted)}>{res.predicted}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <div className="mt-8">
                {isLoading && !aiSummary && <div className="text-center p-4">Fetching AI-powered analysis...</div>}
                {aiSummary && (
                    <div className="p-1 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30 transition-shadow duration-300">
                        {aiSummary.startsWith('AI Analysis Failed:') ? (
                            <div className="prose prose-sm prose-invert max-w-none bg-gray-900 p-4 rounded-[7px] text-red-300">
                                <h3 className="text-red-400 font-bold">Analysis Error</h3>
                                <p>{aiSummary}</p>
                            </div>
                        ) : (
                            <div className="prose prose-sm prose-invert max-w-none bg-gray-900 p-4 rounded-[7px]" dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br />') }}>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplexityAnalyzer;
