export default function QuestionDisplay({ 
    question, 
    current, 
    total, 
    answer, 
    onAnswer, 
    onFlag, 
    isFlagged, 
    onPrev, 
    onNext 
  }) {
    return (
      <section class="bg-gray-900 text-white py-6">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-700">
                <div>
                  <h2 class="text-xl font-bold mt-2">Question {current + 1} of {total}</h2>
                </div>
                <div class="flex mt-3 sm:mt-0">
                  <button 
                    class="flex items-center text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md mr-3 transition duration-300"
                    onClick={onFlag}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"></path>
                    </svg>
                    {isFlagged ? 'Unflag' : 'Flag'} Review
                  </button>
                  <button 
                    class="flex items-center text-sm bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md transition duration-300"
                    onClick={() => onAnswer(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    Clear Answer
                  </button>
                </div>
              </div>

              {question["direction"] && (
                <div class="mb-8">
                  <div
                      className="text-gray-300 rounded bg-gray-700 p-4"
                      dangerouslySetInnerHTML={{ __html: question["direction"].replace('/_files', 'https://indiabix.com//_files') }}
                  />
                </div>
              )}
              
              <div class="mb-8">
                <div class="mb-6">
                  <div class="text-lg !text-gray-300" dangerouslySetInnerHTML={{ __html: question["question"].replace(/style="[^"]*"/g, "")}}></div>
                </div>
                
                <div class="space-y-3 max-w-3xl">
                  {question.options.map((option, index) => (
                    <label 
                      key={index}
                      class={`flex items-center p-4 rounded-md cursor-pointer transition-colors ${
                        answer === option ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="answer" 
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600 bg-gray-700"
                        checked={answer === option}
                        onChange={() => onAnswer(option)}
                      />
                      <span class="ml-3 text-white" dangerouslySetInnerHTML={{ __html: option.replace(/style="[^"]*"/g, "")}}></span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row justify-between">
                <div class="flex mb-3 sm:mb-0">
                  <button 
                    class="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg mr-3 transition duration-300 flex items-center"
                    onClick={onPrev}
                    disabled={current === 0}
                  >
                    Previous
                  </button>
                  <button 
                    class="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition duration-300 flex items-center"
                    onClick={onNext}
                    disabled={current === total - 1}
                  >
                    Next
                  </button>
                </div>
                <button 
                  class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition duration-300 flex items-center justify-center"
                  onClick={onNext}
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }