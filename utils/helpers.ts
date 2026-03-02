// Fix: Correct import path for types.
import { Algorithm } from '../types';

export const generateRandomArray = (size: number = 20): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
};

export const getPredictedPerformance = (algorithm: string, array: number[]): string => {
    const n = array.length;
    if (n <= 1) return "O(1)";

    // Use a more robust check for sortedness
    let isSorted = true;
    for (let i = 1; i < n; i++) {
        if (array[i] < array[i-1]) {
            isSorted = false;
            break;
        }
    }
    
    let isReversed = true;
    for (let i = 1; i < n; i++) {
        if (array[i] > array[i-1]) {
            isReversed = false;
            break;
        }
    }

    switch (algorithm) {
        case Algorithm.QuickSort:
            return isSorted || isReversed ? `Worst: O(n^2)` : `Average: O(n log n)`;
        case Algorithm.MergeSort:
            return `All Cases: O(n log n)`;
        case Algorithm.SelectionSort:
            return `All Cases: O(n^2)`;
        case Algorithm.InsertionSort:
            if (isSorted) return `Best: O(n)`;
            if (isReversed) return `Worst: O(n^2)`;
            return `Average: O(n^2)`;
        case Algorithm.BinarySearch:
             return isSorted ? `O(log n)` : 'N/A (needs sorted array)';
        case Algorithm.LinearSearch:
            return `Worst: O(n)`;
        default:
            return "N/A";
    }
};

// Fix: Add fileToBase64 utility function for VeoGenerator component.
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // The API for image bytes expects just the base64 data, not the data URL prefix.
            if (result.includes(',')) {
                resolve(result.split(',')[1]);
            } else {
                resolve(result);
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

export const BIG_O_EXPLANATIONS: { [key: string]: string } = {
  'O(1)': 'Constant Time: The algorithm\'s execution time is constant, regardless of the input size. This is the most efficient complexity.',
  'O(log n)': 'Logarithmic Time: The execution time grows logarithmically with the input size. Very efficient for large datasets, common in search algorithms on sorted data.',
  'O(n)': 'Linear Time: The execution time is directly proportional to the input size. The algorithm processes each item once.',
  'O(n log n)': 'Log-Linear Time: A highly efficient complexity for sorting algorithms. It scales well as the data grows. Examples: Quick Sort (average), Merge Sort.',
  'O(n^2)': 'Quadratic Time: The execution time is proportional to the square of the input size. Becomes inefficient for large datasets. Examples: Selection Sort, Insertion Sort (worst).',
  'N/A': 'Not Applicable: This metric does not apply in this context, often because a precondition (like a sorted array) is not met.'
};

export const getBigOExplanation = (notation: string): string => {
    // Find the Big O part in a string like "Worst: O(n^2)" or "N/A (needs sorted array)"
    const match = notation.match(/O\([\w\s^]+\)|N\/A/);
    if (match && BIG_O_EXPLANATIONS[match[0]]) {
        return BIG_O_EXPLANATIONS[match[0]];
    }
    // Fallback for combined strings to find the core notation
    if (notation.includes('O(n^2)')) return BIG_O_EXPLANATIONS['O(n^2)'];
    if (notation.includes('O(n log n)')) return BIG_O_EXPLANATIONS['O(n log n)'];
    if (notation.includes('O(n)')) return BIG_O_EXPLANATIONS['O(n)'];
    if (notation.includes('O(log n)')) return BIG_O_EXPLANATIONS['O(log n)'];
    if (notation.includes('O(1)')) return BIG_O_EXPLANATIONS['O(1)'];
    if (notation.includes('N/A')) return BIG_O_EXPLANATIONS['N/A'];
    
    return "Click to see performance characteristics."; // Default text
};
