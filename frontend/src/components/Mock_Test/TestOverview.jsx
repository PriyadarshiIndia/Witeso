import { useState } from "react";

export default function TestOverview({ onStart, duration, totalQuestions, mockTestTitle }) {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <section class="bg-gray-900 text-white py-8 pt-30">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div class="p-6">
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                            <div>
                                <h1 class="text-2xl font-bold text-green-500 mb-2">{mockTestTitle} Mock Test</h1>
                                <p class="text-gray-300 text-sm mb-2">Test your {mockTestTitle} with questions designed to mimic real assessment process</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div class="bg-gray-700 rounded-lg p-4">
                                <p class="text-gray-400 text-sm mb-1">Duration</p>
                                <p class="text-xl font-semibold">{duration} minutes</p>
                            </div>
                            <div class="bg-gray-700 rounded-lg p-4">
                                <p class="text-gray-400 text-sm mb-1">Total Questions</p>
                                <p class="text-xl font-semibold">{totalQuestions} questions</p>
                            </div>
                            <div class="bg-gray-700 rounded-lg p-4">
                                <p class="text-gray-400 text-sm mb-1">Difficulty</p>
                                <p class="text-xl font-semibold">Medium</p>
                            </div>
                            <div class="bg-gray-700 rounded-lg p-4">
                                <p class="text-gray-400 text-sm mb-1">Passing Score</p>
                                <p class="text-xl font-semibold">70%</p>
                            </div>
                        </div>

                        <div class="mb-6">
                            <h2 class="text-xl font-semibold mb-3">Test Instructions</h2>
                            <ul class="list-disc pl-5 space-y-2 text-gray-300">
                                <li>This test contains multiple-choice questions from various technical aptitude categories.</li>
                                <li>Each question has a single correct answer.</li>
                                <li>You can navigate between questions and review your answers before submission.</li>
                                <li>The timer will start once you begin the test and cannot be paused.</li>
                                <li>Ensure you have a stable internet connection before starting.</li>
                            </ul>
                        </div>

                        {/* <div class="bg-gray-700 rounded-lg p-5 mb-6">
                            <h3 class="font-semibold mb-3">Question Categories</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                    <span class="text-gray-300">Logical Reasoning</span>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <span class="text-gray-300">Data Interpretation</span>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                    <span class="text-gray-300">Quantitative Aptitude</span>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                    <span class="text-gray-300">Verbal Ability</span>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <span class="text-gray-300">Technical Knowledge</span>
                                </div>
                                <div class="flex items-center">
                                    <div class="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                                    <span class="text-gray-300">Problem Solving</span>
                                </div>
                            </div>
                        </div> */}

                        <div class="flex flex-col sm:flex-row justify-between items-center">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <input 
                                    type="checkbox" 
                                    id="agreement" 
                                    className="w-4 h-4 mr-2 bg-gray-700 border-gray-600 rounded focus:ring-green-600 ring-offset-gray-800 focus:ring-2 text-green-600" 
                                    checked={isChecked} 
                                    onChange={() => setIsChecked(!isChecked)}
                                />
                                <label htmlFor="agreement" className="text-sm text-gray-300">
                                    I have read and understood the instructions
                                </label>
                            </div>
                            <div className="flex">
                                <button 
                                    onClick={onStart} 
                                    disabled={!isChecked} 
                                    className={`px-5 py-2 rounded-lg font-medium transition duration-300 ${
                                        isChecked 
                                            ? "bg-green-600 hover:bg-green-700 text-white" 
                                            : "bg-gray-500 opacity-50 cursor-not-allowed"
                                    }`}
                                >
                                    Start Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}