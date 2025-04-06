import { useState } from 'react';

export default function AnswerSubmission({ 
  questions,
  answers,
  flagged,
  onCancel,
  onSubmit 
}) {
  const answeredCount = answers.filter(a => a).length;
  const flaggedCount = flagged.length;
  const remainingCount = questions.length - answeredCount;

  const [isChecked, setIsChecked] = useState(false);

  return (
    <section id="answer-submission" class="w-full bg-gray-900 text-white py-6 pt-30">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Submit Your Test</h2>
            
            <div class="flex flex-col sm:flex-row items-center justify-between">
              <div class="flex items-center mb-4 sm:mb-0">
                <input 
                  type="checkbox" 
                  id="confirm-submit" 
                  class="w-4 h-4 mr-2 text-green-600 bg-gray-700 rounded border-gray-600 focus:ring-green-500 focus:ring-2"
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <label for="confirm-submit" class="text-gray-300 text-sm">
                  I confirm I want to submit my test answers
                </label>
              </div>
              <div class="flex w-full sm:w-auto">
                <button 
                  class="w-1/2 sm:w-auto bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg mr-3 transition duration-300"
                  onClick={onCancel}
                >
                  Return to Test
                </button>
                <button 
                  class={`w-1/2 sm:w-auto px-5 py-2 rounded-lg transition duration-300 flex items-center justify-center ${isChecked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                  onClick={onSubmit}
                  disabled={!isChecked}
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}