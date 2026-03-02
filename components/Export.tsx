import React, { useRef, useEffect, useState } from 'react';
import type { User, VisualizationReportData, QuizSession } from '../types';
import { getBigOExplanation } from '../utils/helpers';


// Declare types for window-injected libraries
declare const html2canvas: any;
declare const jspdf: any;
declare const Chart: any;

interface ExportProps {
  user: User;
}

const ReportContent: React.FC<{ user: User; reportData: VisualizationReportData | null; quizHistory: QuizSession[] }> = ({ user, reportData, quizHistory }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Prevent crash if Chart.js hasn't loaded yet.
        if (typeof Chart === 'undefined') {
            console.warn("Chart.js not loaded. Chart will not be rendered in the report.");
            return;
        }

        if (chartRef.current && reportData?.sortedArray) {
            const chartInstance = Chart.getChart(chartRef.current);
            if (chartInstance) {
                chartInstance.destroy();
            }

            new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: reportData.sortedArray.map((_, index) => `${index}`),
                    datasets: [{
                        label: 'Sorted Array Values',
                        data: reportData.sortedArray,
                        backgroundColor: 'rgba(129, 140, 248, 0.5)',
                        borderColor: 'rgba(129, 140, 248, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#E2E8F0', font: { size: 10 } },
                            grid: { color: '#4A5568' }
                        },
                        x: {
                            ticks: { color: '#E2E8F0', font: { size: 10 } },
                            grid: { color: '#4A5568' }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#E2E8F0'
                            }
                        }
                    }
                }
            });
        }
    }, [reportData]);
    
    if (!reportData && quizHistory.length === 0) {
      return (
          <div style={{ fontFamily: 'sans-serif', backgroundColor: '#1A202C', color: '#E2E8F0', padding: '20px', width: '800px', minHeight: '1120px' }}>
              <div style={{ maxWidth: '800px', margin: 'auto', backgroundColor: '#2D3748', padding: '20px', borderRadius: '8px', border: '1px solid #4A5568' }}>
                  <h1 style={{ color: '#9F7AEA', borderBottom: '2px solid #6B46C1', paddingBottom: '5px' }}>AlgoVision Learning Report</h1>
                  <p>No report data found.</p>
                  <p>Please complete a visualization or a quiz to generate a report.</p>
              </div>
          </div>
      );
    }

    return (
        <div style={{ fontFamily: 'sans-serif', backgroundColor: '#1A202C', color: '#E2E8F0', padding: '20px', width: '800px' }}>
            <div style={{ maxWidth: '800px', margin: 'auto', backgroundColor: '#2D3748', padding: '20px', borderRadius: '8px', border: '1px solid #4A5568' }}>
                <h1 style={{ color: '#9F7AEA', borderBottom: '2px solid #6B46C1', paddingBottom: '5px' }}>AlgoVision Progress Report</h1>
                <p><strong>Student Name:</strong> {user.name}</p>
                <p><strong>Student ID:</strong> {user.studentId}</p>
                <p><strong>Report Generated:</strong> {new Date().toLocaleString()}</p>
                
                {reportData && (
                    <>
                        <h2 style={{ color: '#9F7AEA', borderBottom: '2px solid #6B46C1', paddingBottom: '5px', marginTop: '30px' }}>Visualization Analysis</h2>
                        <p style={{fontSize: '0.9em', color: '#A0AEC0'}}><em>Completed on: {new Date(reportData.timestamp).toLocaleString()}</em></p>
                        <p><strong>Algorithm:</strong> {reportData.algorithm}</p>
                        <p><strong>Initial Array:</strong> [{reportData.initialArray.join(', ')}]</p>

                        <h3 style={{ color: '#7f9cf5', borderBottom: '1px solid #4A5568', paddingBottom: '5px', marginTop: '20px' }}>Performance</h3>
                        <p><strong>Predicted Complexity:</strong> {reportData.complexity}</p>
                        <p style={{fontSize: '0.9em', color: '#A0AEC0', marginTop: '5px'}}><em>Explanation: {getBigOExplanation(reportData.complexity)}</em></p>
                        <p><strong>Comparisons:</strong> {reportData.stats.comparisons}</p>
                        <p><strong>Array Accesses:</strong> {reportData.stats.arrayAccesses}</p>
                        
                        <h3 style={{ color: '#7f9cf5', borderBottom: '1px solid #4A5568', paddingBottom: '5px', marginTop: '20px' }}>Sorted Array Visualization</h3>
                         <div style={{ marginTop: '20px', backgroundColor: '#1A202C', padding: '10px', borderRadius: '8px' }}>
                            <canvas ref={chartRef} width="700" height="350"></canvas>
                         </div>
                    </>
                )}

                {quizHistory.length > 0 && (
                    <>
                        <h2 style={{ color: '#9F7AEA', borderBottom: '2px solid #6B46C1', paddingBottom: '5px', marginTop: '30px' }}>
                            Quiz Report
                        </h2>
                        {quizHistory.map((quizData, sessionIndex) => (
                            <div key={sessionIndex} style={{ marginTop: sessionIndex > 0 ? '25px' : '0', paddingTop: sessionIndex > 0 ? '25px' : '0', borderTop: sessionIndex > 0 ? '2px dotted #4A5568' : 'none' }}>
                                <h3 style={{ color: '#7f9cf5', borderBottom: '1px solid #4A5568', paddingBottom: '5px', marginTop: '0px' }}>
                                    Quiz Session #{sessionIndex + 1}
                                </h3>
                                <p style={{fontSize: '0.9em', color: '#A0AEC0'}}><em>Completed on: {new Date(quizData.timestamp).toLocaleString()}</em></p>
                                <p><strong>Final Score:</strong> {quizData.score} / {quizData.total}</p>
                                <p><strong>Time Taken:</strong> {quizData.duration} seconds</p>
                                
                                <h4 style={{ color: '#A0AEC0', borderBottom: '1px dotted #4A5568', paddingBottom: '5px', marginTop: '20px', fontSize: '1.1em' }}>
                                    Question Breakdown
                                </h4>
                                {quizData.attempts.map((attempt, index) => (
                                    <div key={index} style={{ border: '1px solid #4A5568', borderRadius: '8px', padding: '15px', marginTop: '15px', backgroundColor: '#1A202C' }}>
                                        <p style={{ fontWeight: 'bold' }}>Q{index + 1}: {attempt.question}</p>
                                        <p style={{ marginTop: '10px', color: attempt.isCorrect ? '#48BB78' : '#F56565' }}>
                                            <strong>Your Answer:</strong> {attempt.selectedAnswer} {attempt.isCorrect ? ' (Correct)' : ' (Incorrect)'}
                                        </p>
                                        {!attempt.isCorrect && (
                                            <p style={{ marginTop: '5px', color: '#63B3ED' }}>
                                                <strong>Correct Answer:</strong> {attempt.correctAnswer}
                                            </p>
                                        )}
                                        <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#A0AEC0' }}>
                                            <em><strong>Explanation:</strong> {attempt.explanation}</em>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export const Export: React.FC<ExportProps> = ({ user }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState<VisualizationReportData | null>(null);
    const [quizHistory, setQuizHistory] = useState<QuizSession[]>([]);
    const [exportError, setExportError] = useState<string | null>(null);

    useEffect(() => {
        const visData = localStorage.getItem('lastVisualizationReport');
        if (visData) {
            setReportData(JSON.parse(visData));
        }
        const quizHistoryData = localStorage.getItem('quizHistory');
        if (quizHistoryData) {
            const history: QuizSession[] = JSON.parse(quizHistoryData);
            setQuizHistory(history);
        }
    }, []);

    const handleExport = async () => {
        setExportError(null);
        if (isLoading) return;

        if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined' || typeof Chart === 'undefined') {
            setExportError("Report generation libraries failed to load. Please check your internet connection and refresh the page.");
            return;
        }

        if (!reportRef.current) {
            setExportError("Report content is not available.");
            return;
        }
        
        setIsLoading(true);

        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#1A202C' });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('AlgoVision_Report.pdf');
           
        } catch (error) {
            console.error("Failed to export report:", error);
            setExportError("An error occurred while generating the report. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Off-screen element for rendering the report to be captured */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div ref={reportRef}>
                    <ReportContent user={user} reportData={reportData} quizHistory={quizHistory} />
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-center">Export Progress Report</h2>
                
                {reportData || quizHistory.length > 0 ? (
                    <>
                        <p className="text-center text-gray-400 mb-8">Download a PDF report of your recent activity, including your last algorithm visualization and all quiz attempts.</p>
                        
                        {exportError && (
                            <div className="p-4 mb-6 bg-red-900/50 text-red-300 border border-red-700 rounded-md text-center">
                                {exportError}
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                onClick={handleExport}
                                disabled={isLoading}
                                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
                            >
                               {isLoading ? 'Generating...' : 'Download PDF Report'}
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-400 mb-8">Please run an algorithm visualization or complete a quiz to generate a report.</p>
                )}
            </div>
        </>
    );
};