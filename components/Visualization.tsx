import React, { useState, useEffect, useCallback } from 'react';
import { ALGORITHMS, COLORS } from '../constants';
import type { VisualizationStep, VisualizationReportData } from '../types';
import { Algorithm } from '../types';
import { apiService } from '../services/apiService';
import { getPredictedPerformance, getBigOExplanation } from '../utils/helpers';

const Visualization: React.FC = () => {
    const [userInput, setUserInput] = useState('15, 3, 18, 5, 1, 9, 12, 7, 20, 11');
    const [array, setArray] = useState<number[]>(userInput.split(',').map(s => parseInt(s.trim(), 10)));
    const [inputError, setInputError] = useState<string | null>(null);
    const [algorithm, setAlgorithm] = useState<string>(Algorithm.QuickSort);
    const [searchTarget, setSearchTarget] = useState<string>('');
    const [targetError, setTargetError] = useState<string | null>(null);
    const [steps, setSteps] = useState<VisualizationStep[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [stats, setStats] = useState({ comparisons: 0, arrayAccesses: 0 });
    const [complexity, setComplexity] = useState('');
    const [showSpeedControl, setShowSpeedControl] = useState(false);

    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);

    const generateSteps = useCallback(() => {
        let newSteps: VisualizationStep[] = [];
        let comparisons = 0;
        let arrayAccesses = 0;
        const arr = [...array];
        
        setSuggestion(null);

        const addStep = (
            tempArr: number[],
            highlights: { [key: number]: string },
            message: string,
            sorted: number[] = []
        ) => {
            newSteps.push({
                array: [...tempArr],
                highlights,
                message,
                sortedIndices: [...(newSteps[newSteps.length - 1]?.sortedIndices || []), ...sorted],
                comparisons,
                arrayAccesses,
            });
        };

        if (algorithm === Algorithm.QuickSort) {
            const quickSort = (items: number[], left: number, right: number) => {
                let index;
                if (items.length > 1) {
                    index = partition(items, left, right);
                    if (left < index - 1) {
                        quickSort(items, left, index - 1);
                    }
                    if (index < right) {
                        quickSort(items, index, right);
                    }
                }
                for (let i = left; i <= right; i++) {
                     if(!newSteps[newSteps.length - 1]?.sortedIndices.includes(i)) {
                          newSteps[newSteps.length - 1]?.sortedIndices.push(i);
                     }
                 }
                  addStep(items, {}, `Partition from ${left} to ${right} is sorted.`);
                return items;
            };
            const partition = (items: number[], left: number, right: number) => {
                const pivotIndex = Math.floor((right + left) / 2);
                const pivot = items[pivotIndex];
                let i = left;
                let j = right;
                addStep(items, { [pivotIndex]: COLORS.pivot }, `Pivot selected: ${pivot}`);

                while (i <= j) {
                    while (items[i] < pivot) {
                        comparisons++;
                        addStep(items, { [i]: COLORS.comparing, [pivotIndex]: COLORS.pivot }, `Comparing ${items[i]} < ${pivot}`);
                        i++;
                    }
                    while (items[j] > pivot) {
                        comparisons++;
                        addStep(items, { [j]: COLORS.comparing, [pivotIndex]: COLORS.pivot }, `Comparing ${items[j]} > ${pivot}`);
                        j--;
                    }
                    if (i <= j) {
                        addStep(items, { [i]: COLORS.swapping, [j]: COLORS.swapping }, `Swapping ${items[i]} and ${items[j]}`);
                        [items[i], items[j]] = [items[j], items[i]];
                        arrayAccesses += 2;
                        addStep(items, { [i]: COLORS.swapping, [j]: COLORS.swapping }, `Swapped ${items[j]} and ${items[i]}`);
                        i++;
                        j--;
                    }
                }
                return i;
            };
            quickSort(arr, 0, arr.length - 1);

        } else if (algorithm === Algorithm.MergeSort) {
             addStep(arr, {}, 'Merge Sort is complex to visualize in-place. This is a conceptual representation.');
             const mergeSortRecursive = (subArr: number[], offset: number) => {
                if (subArr.length <= 1) {
                    return subArr;
                }
                const middle = Math.floor(subArr.length / 2);
                const left = subArr.slice(0, middle);
                const right = subArr.slice(middle);

                addStep(arr, {}, `Dividing: [${subArr.join(', ')}]`);

                const sortedLeft = mergeSortRecursive(left, offset);
                const sortedRight = mergeSortRecursive(right, offset + middle);

                return merge(sortedLeft, sortedRight, offset);
             };
             const merge = (left: number[], right: number[], offset: number) => {
                let resultArray = [], leftIndex = 0, rightIndex = 0;
                 addStep(arr, {}, `Merging [${left.join(', ')}] and [${right.join(', ')}]`);
                while (leftIndex < left.length && rightIndex < right.length) {
                    comparisons++;
                    if (left[leftIndex] < right[rightIndex]) {
                        resultArray.push(left[leftIndex]);
                        leftIndex++;
                    } else {
                        resultArray.push(right[rightIndex]);
                        rightIndex++;
                    }
                    arrayAccesses++;
                }
                const final = resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
                
                const tempArr = [...arr];
                final.forEach((val, i) => tempArr[offset + i] = val);
                Object.assign(arr, tempArr);

                addStep(arr, {}, `Merged result: [${final.join(', ')}]`);

                return final;
             };
             mergeSortRecursive([...arr], 0);
             addStep(arr, {}, 'Array is sorted.', Array.from(Array(arr.length).keys()));

        } else if (algorithm === Algorithm.SelectionSort) {
            for (let i = 0; i < arr.length - 1; i++) {
                let minIndex = i;
                addStep(arr, { [i]: COLORS.comparing }, `Finding minimum for index ${i}. Current min: ${arr[minIndex]}`);
                for (let j = i + 1; j < arr.length; j++) {
                    comparisons++;
                    addStep(arr, { [i]: COLORS.range, [j]: COLORS.comparing, [minIndex]: COLORS.pivot }, `Comparing ${arr[j]} with current minimum ${arr[minIndex]}`);
                    if (arr[j] < arr[minIndex]) {
                        minIndex = j;
                        addStep(arr, { [i]: COLORS.range, [j]: COLORS.comparing, [minIndex]: COLORS.pivot }, `New minimum found: ${arr[minIndex]}`);
                    }
                }
                if (minIndex !== i) {
                    addStep(arr, { [i]: COLORS.swapping, [minIndex]: COLORS.swapping }, `Swapping ${arr[i]} with minimum ${arr[minIndex]}`);
                    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                    arrayAccesses += 2;
                }
                addStep(arr, { [i]: COLORS.sorted }, `${arr[i]} is sorted.`);
            }
             addStep(arr, {}, `Array is sorted.`, Array.from(Array(arr.length).keys()));

        } else if (algorithm === Algorithm.InsertionSort) {
            addStep(arr, {}, "Starting Insertion Sort.");
            for (let i = 1; i < arr.length; i++) {
                let key = arr[i];
                let j = i - 1;
                arrayAccesses++;
                addStep(arr, { [i]: COLORS.pivot }, `Selecting ${key} to insert.`);

                while (j >= 0 && arr[j] > key) {
                    comparisons++;
                    arrayAccesses+=2;
                    addStep(arr, { [j]: COLORS.comparing, [j + 1]: COLORS.comparing }, `Comparing ${key} with ${arr[j]}. Shifting ${arr[j]} right.`);
                    arr[j + 1] = arr[j];
                    j = j - 1;
                }
                arr[j + 1] = key;
                arrayAccesses++;
                addStep(arr, { [j+1]: COLORS.swapping }, `Inserting ${key} at index ${j + 1}.`);
            }
             addStep(arr, {}, `Array is sorted.`, Array.from(Array(arr.length).keys()));
        
        } else if (algorithm === Algorithm.BinarySearch) {
             const sortedArr = [...arr].sort((a,b)=> a - b);
             if (JSON.stringify(arr) !== JSON.stringify(sortedArr)) {
                 addStep(sortedArr, {}, `Binary search requires a sorted array. Sorting first.`);
                 Object.assign(arr, sortedArr);
             }
             const target = Number(searchTarget);
             if (isNaN(target)) {
                 addStep(arr, {}, `Invalid target provided. Please enter a valid number.`);
                 setTargetError('Please enter a valid numeric target for Binary Search.');
                 setSteps(newSteps);
                 setCurrentStep(0);
                 setIsPlaying(false);
                 setComplexity(getPredictedPerformance(algorithm, array));
                 return;
             }
             
             let low = 0;
             let high = arr.length - 1;
 
             addStep(arr, {}, `Searching for ${target}.`);
 
             while(low <= high) {
                 const mid = Math.floor((low+high)/2);
                 const midVal = arr[mid];
                 comparisons++;
                 arrayAccesses++;
 
                 let highlights = { [mid]: COLORS.comparing };
                 for(let i=low; i<=high; i++) if(i !== mid) highlights[i] = COLORS.range;
 
                 addStep(arr, highlights, `Checking middle element ${midVal}`);
 
                 if(midVal === target) {
                     addStep(arr, {[mid]: COLORS.sorted}, `Found ${target} at index ${mid}.`);
                     break;
                 } else if (midVal < target) {
                     addStep(arr, highlights, `${midVal} < ${target}. Searching right half.`);
                     low = mid + 1;
                 } else {
                     addStep(arr, highlights, `${midVal} > ${target}. Searching left half.`);
                     high = mid - 1;
                 }
 
                  if (low > high) {
                     addStep(arr, {}, `${target} not found in the array.`);
                 }
             }

        } else if (algorithm === Algorithm.LinearSearch) {
            const target = Number(searchTarget);
            if (isNaN(target)) {
                addStep(arr, {}, `Invalid target provided. Please enter a valid number.`);
                setTargetError('Please enter a valid numeric target for Linear Search.');
                setSteps(newSteps);
                setCurrentStep(0);
                setIsPlaying(false);
                setComplexity(getPredictedPerformance(algorithm, array));
                return;
            }
            addStep(arr, {}, `Searching for ${target}.`);
            let found = false;
            for(let i=0; i<arr.length; i++) {
                comparisons++;
                arrayAccesses++;
                addStep(arr, {[i]: COLORS.comparing}, `Comparing with ${arr[i]}`);
                if (arr[i] === target) {
                    addStep(arr, {[i]: COLORS.sorted}, `Found ${target} at index ${i}.`);
                    found = true;
                    break;
                }
            }
            if (!found) {
                addStep(arr, {}, `${target} not found.`);
            }
        }
        
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(false);
        setComplexity(getPredictedPerformance(algorithm, array));
    }, [array, algorithm]);
    
    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserInput(value);

        // Real-time validation for invalid characters
        const isValidFormat = /^[0-9,\s]*$/.test(value);
        if (!isValidFormat) {
            setInputError('Invalid characters. Only numbers and commas are allowed.');
        } else {
            setInputError(null);
        }
    };

    const handleTargetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTarget(value);
        if (value && !/^[-+]?[0-9]*$/.test(value)) {
            setTargetError('Invalid target. Only numeric values are allowed.');
        } else {
            setTargetError(null);
        }
    };


    const handleVisualizeClick = () => {
        const parsedArray = userInput.split(',').map(s => s.trim()).filter(Boolean).map(Number);
        if (parsedArray.some(isNaN) || inputError) {
            setInputError("Invalid input. Please enter comma-separated numbers only.");
            return;
        }
        if (parsedArray.length === 0) {
            setInputError("Input cannot be empty.");
            return;
        }
        // Validate target for searching algorithms
        if ((algorithm === Algorithm.BinarySearch || algorithm === Algorithm.LinearSearch)) {
            if (searchTarget.trim() === '' || isNaN(Number(searchTarget))) {
                setTargetError('Please enter a valid numeric target for the selected search algorithm.');
                return;
            }
        }
        setInputError(null);
        setArray(parsedArray);
    };

    useEffect(() => {
        if(array.length > 0) {
            generateSteps();
        }
    }, [array, algorithm, generateSteps]);

    useEffect(() => {
        if (isPlaying && currentStep < steps.length - 1) {
            const timeout = setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 5000 / speed);
            return () => clearTimeout(timeout);
        } else if (currentStep >= steps.length - 1 && steps.length > 0) {
            setIsPlaying(false);
        }
    }, [isPlaying, currentStep, steps, speed]);

    useEffect(() => {
        if (steps.length > 0 && steps[currentStep]) {
            setStats({
                comparisons: steps[currentStep].comparisons,
                arrayAccesses: steps[currentStep].arrayAccesses,
            });
        }
    }, [currentStep, steps]);

    const handleStep = (direction: number) => {
        setIsPlaying(false);
        setCurrentStep(prev => Math.max(0, Math.min(steps.length - 1, prev + direction)));
    };
    
    const currentArray = steps[currentStep]?.array || array;
    const highlights = steps[currentStep]?.highlights || {};
    const message = steps[currentStep]?.message || 'Ready to visualize.';
    const sortedIndices = steps[currentStep]?.sortedIndices || [];
    const isFinished = currentStep === steps.length - 1 && steps.length > 0;

    useEffect(() => {
        const handleGetSuggestion = async () => {
            setIsSuggestionLoading(true);
            setSuggestion(null);
            try {
                const result = await apiService.getAlgorithmSuggestion(array, algorithm);
                setSuggestion(result);
            } catch (error: any) {
                setSuggestion(error.message || "An unknown error occurred while getting an AI suggestion.");
            } finally {
                setIsSuggestionLoading(false);
            }
        };

        if (isFinished) {
            handleGetSuggestion();
            // Save data for export
            const reportData: VisualizationReportData = {
                initialArray: array, // The array before sorting
                sortedArray: steps[steps.length - 1]?.array || array,
                algorithm: algorithm,
                complexity: complexity,
                stats: stats,
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem('lastVisualizationReport', JSON.stringify(reportData));
        }
    }, [isFinished, array, algorithm, steps, complexity, stats]);

    return (
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                 <div className="lg:col-span-2 flex flex-col">
                    <label htmlFor="array-input" className="text-sm text-gray-400 mb-1">Enter comma-separated numbers</label>
                    <div className="flex">
                        <input
                            id="array-input"
                            type="text"
                            value={userInput}
                            onChange={handleUserInputChange}
                            className={`flex-grow bg-gray-700 p-2 rounded-l-md outline-none transition-all ${inputError ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-indigo-500'}`}
                            placeholder="e.g., 5, 2, 8, 1, 9"
                        />
                        <button onClick={handleVisualizeClick} className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-r-md font-semibold">Visualize</button>
                    </div>
                     {inputError && <p className="text-red-400 text-sm mt-1">{inputError}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-400 mb-1">Algorithm</label>
                        <select value={algorithm} onChange={e => setAlgorithm(e.target.value)} className="bg-gray-700 p-2 rounded-md h-full">
                            {ALGORITHMS.map(alg => <option key={alg}>{alg}</option>)}
                        </select>
                    </div>
                    {(algorithm === Algorithm.BinarySearch || algorithm === Algorithm.LinearSearch) && (
                        <div className="flex flex-col">
                            <label htmlFor="target-input" className="text-sm text-gray-400 mb-1">Search Target (number)</label>
                            <input
                                id="target-input"
                                type="text"
                                value={searchTarget}
                                onChange={handleTargetInputChange}
                                className={`bg-gray-700 p-2 rounded-md outline-none transition-all ${targetError ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-indigo-500'}`}
                                placeholder="e.g., 9"
                            />
                            {targetError && <p className="text-red-400 text-sm mt-1">{targetError}</p>}
                        </div>
                    )}
                </div>
            </div>

            <div className="h-80 flex items-end justify-center gap-px bg-gray-900/50 p-2 rounded-md overflow-hidden">
                {currentArray.map((value, index) => {
                    let color = COLORS.default;
                    if (sortedIndices.includes(index)) {
                        color = COLORS.sorted;
                    }
                    if (highlights[index]) {
                        color = highlights[index];
                    }
                    return (
                        <div key={index} className={`relative flex-1 ${color} transition-all duration-300 group`} style={{ height: `${(value / 101) * 100}%` }}>
                           <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">{value}</span>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button onClick={() => handleStep(-1)} disabled={currentStep === 0} className="px-3 py-2 bg-gray-700 rounded-md disabled:opacity-50">&lt;</button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 bg-purple-600 rounded-md w-24">{isPlaying ? 'Pause' : 'Play'}</button>
                    <button onClick={() => handleStep(1)} disabled={currentStep >= steps.length - 1} className="px-3 py-2 bg-gray-700 rounded-md disabled:opacity-50">&gt;</button>
                    <div className="relative">
                        <button onClick={() => setShowSpeedControl(!showSpeedControl)} className="px-4 py-2 bg-gray-700 rounded-md">Speed</button>
                        {showSpeedControl && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-4 bg-gray-700/80 backdrop-blur-sm rounded-lg shadow-lg">
                               <input
                                  type="range"
                                  min="1" max="100"
                                  value={speed}
                                  onChange={e => setSpeed(Number(e.target.value))}
                                  className="h-32 w-4 cursor-pointer"
                                  // Fix: Corrected CSS properties for vertical slider to be syntactically valid and resolve TypeScript errors.
                                  // The 'appearance' property was incorrect for the non-standard 'slider-vertical' value; 'WebkitAppearance' is used instead.
                                  // The 'writingMode' value 'bt-lr' was invalid and has been corrected to 'vertical-lr'.
                                  // A type cast is used for 'slider-vertical' to accommodate the non-standard value not present in TypeScript's CSS types.
                                  style={{
                                    WebkitAppearance: 'slider-vertical' as any,
                                    writingMode: 'vertical-lr',
                                  }}
                                />
                            </div>
                          )}
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Step {steps.length > 0 ? currentStep + 1 : 0} / {steps.length}</p>
                    <p className="font-mono text-indigo-300 h-5">{message}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm font-mono text-right">
                    <div className="text-sm text-yellow-300 bg-gray-700/50 px-2 py-1 rounded">
                         <span data-tooltip={getBigOExplanation(complexity)}>{complexity}</span>
                    </div>
                    <div>
                        <span>Comparisons: {stats.comparisons}</span><br/>
                        <span>Accesses: {stats.arrayAccesses}</span>
                    </div>
                </div>
            </div>

            {isFinished && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                    {isSuggestionLoading && <div className="text-center p-4">Analyzing performance for AI suggestion...</div>}
                    {suggestion && (
                        <div className="p-1 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30 transition-shadow duration-300">
                             {suggestion.startsWith('AI Suggestion Failed:') ? (
                                <div className="prose prose-sm prose-invert max-w-none bg-gray-900 p-4 rounded-[7px] text-red-300">
                                    <h3 className="text-red-400 font-bold">Suggestion Error</h3>
                                    <p>{suggestion}</p>
                                </div>
                            ) : (
                                <div className="prose prose-sm prose-invert max-w-none bg-gray-900 p-4 rounded-[7px]" dangerouslySetInnerHTML={{ __html: suggestion.replace(/\n/g, '<br />') }}>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Visualization;