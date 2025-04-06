import { useState } from 'preact/hooks';
import ViewAnswers from './ViewAnswers';

export default function TestCompletion({ test_title, score, questions, answers, flagged, totalTiming, timeRemaining, totalTimingInSeconds }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const [showAnswers, setShowAnswers] = useState(false);
  const correctAnswers = questions.reduce((acc, q, index) => 
    acc + (answers[index] === q.correctAnswer ? 1 : 0), 0);
  
  const totalTime = totalTiming;
  const totalRemaining = formatTime(totalTimingInSeconds - timeRemaining)
  const percentile = '-'; // This would normally be calculated

  if (showAnswers) {
    return (
      <ViewAnswers 
        questions={questions} 
        userAnswers={answers} 
        flaggedQuestions={flagged}
        onBack={() => setShowAnswers(false)}
      />
    );
  }

  return (
    <section id="test-completion" class="bg-gray-900 text-white py-8 pt-30">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            {/* Header Section */}
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900 bg-opacity-20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 class="text-3xl font-bold text-green-500 mb-2">Test Completed Successfully!</h1>
              <p class="text-gray-400 max-w-2xl mx-auto">
                You scored {score}% with {correctAnswers} out of {questions.length} correct answers.
              </p>
            </div>

            {/* Test Summary */}
            <div class="bg-gray-700 rounded-lg p-6 mb-8">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-600">
                <div>
                  <h2 class="text-xl font-bold text-white">{test_title}</h2>
                </div>
                <div class="mt-3 md:mt-0">
                  <span class="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">COMPLETED</span>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-gray-800 rounded p-4">
                  <p class="text-sm text-gray-400">Total Time</p>
                  <p class="text-xl font-bold">{totalRemaining}</p>
                  <p class="text-xs text-gray-500">Out of {totalTime}</p>
                </div>
                <div class="bg-gray-800 rounded p-4">
                  <p class="text-sm text-gray-400">Score</p>
                  <p class="text-xl font-bold text-green-500">{score}%</p>
                  <p class="text-xs text-gray-500">{correctAnswers}/{questions.length} Correct</p>
                </div>
                <div class="bg-gray-800 rounded p-4">
                  <p class="text-sm text-gray-400">Percentile</p>
                  <p class="text-xl font-bold text-blue-500">{percentile}<sup>th</sup></p>
                  <p class="text-xs text-gray-500">Above average</p>
                </div>
                <div class="bg-gray-800 rounded p-4">
                  <p class="text-sm text-gray-400">Status</p>
                  <p class="text-xl font-bold text-green-500">{
                    score >= 70 ? 'PASSED' : 'FAILED'
                  }</p>
                  <p class="text-xs text-gray-500">Min. required: 70%</p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div class="mb-8">
              <h3 class="text-xl font-bold mb-4">Score Breakdown</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                  <thead>
                    <tr class="bg-gray-600">
                      <th class="py-3 px-4 text-left text-sm font-medium">Category</th>
                      <th class="py-3 px-4 text-center text-sm font-medium">Correct</th>
                      <th class="py-3 px-4 text-center text-sm font-medium">Incorrect</th>
                      <th class="py-3 px-4 text-center text-sm font-medium">Not Attempted</th>
                      <th class="py-3 px-4 text-right text-sm font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-600">
                    {/* <tr class="hover:bg-gray-650">
                      <td class="py-3 px-4 text-left">
                        <div class="flex items-center">
                          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <span>Logical Reasoning</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-center text-green-500">6</td>
                      <td class="py-3 px-4 text-center text-red-500">1</td>
                      <td class="py-3 px-4 text-center text-gray-400">0</td>
                      <td class="py-3 px-4 text-right font-medium">86%</td>
                    </tr> */}
                    {/* Add other categories similarly */}
                    <tr class="bg-gray-600 font-medium">
                      <td class="py-3 px-4 text-left">Overall</td>
                      <td class="py-3 px-4 text-center text-green-500">{correctAnswers}</td>
                      <td class="py-3 px-4 text-center text-red-500">{answers.filter(a => a).length - correctAnswers}</td>
                      <td class="py-3 px-4 text-center text-gray-400">{questions.length - answers.filter(a => a).length}</td>
                      <td class="py-3 px-4 text-right text-green-500">{score}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Certificate and Actions */}
            <div class="flex flex-col md:flex-row items-center justify-between border-t border-gray-700 pt-6">
              <div class="mb-4 md:mb-0">
                <div class="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                  <h3 class="text-lg font-bold">Certificate Available</h3>
                </div>
                {score >= 70 && (
                  <p class="text-gray-400 text-sm">You've earned a certificate for completing this mock test with a passing score.</p>
                )}
                <p class="text-gray-400 text-sm">Try again to improve your score and earn a certificate.</p>
              </div>
              <div class="flex flex-wrap gap-3">
                <button 
                  class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center"
                  onClick={() => setShowAnswers(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                  </svg>
                  View Answers with Explanations
                </button>
                {score >= 70 && (
                  <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clip-rule="evenodd"></path>
                    </svg>
                    Download Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}