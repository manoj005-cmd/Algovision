import type { QuizQuestion } from './types';
import { Algorithm } from './types';

export const ALGORITHMS = [
    Algorithm.QuickSort,
    Algorithm.MergeSort,
    Algorithm.SelectionSort,
    Algorithm.InsertionSort,
    Algorithm.LinearSearch,
    Algorithm.BinarySearch
];

export const COLORS = {
  default: 'bg-gradient-to-b from-indigo-500 to-indigo-600',
  comparing: 'bg-gradient-to-b from-yellow-400 to-yellow-500 animate-pulse',
  swapping: 'bg-gradient-to-b from-red-500 to-red-600 animate-pulse',
  pivot: 'bg-gradient-to-b from-purple-500 to-purple-600',
  sorted: 'bg-gradient-to-b from-green-500 to-green-600',
  range: 'bg-gradient-to-b from-cyan-500 to-cyan-600',
};
