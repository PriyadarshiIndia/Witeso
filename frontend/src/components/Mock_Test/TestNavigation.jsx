export default function TestNavigation({ questions, current, answers, flagged, onChangeQuestion }) {
    return (
      <section class="bg-gray-900 text-white py-6">
        <div class="max-w-6xl mx-auto px-4 mr-4">
          <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div class="p-4">
              <h2 class="text-lg font-medium mb-3">Question Navigation</h2>
              
              {/* Status Legend */}
              <div class="mb-4">
                <div class="flex items-center mb-3 text-sm">
                  <div class="flex items-center mr-4">
                    <div class="w-4 h-4 bg-green-600 rounded-sm mr-2"></div>
                    <span class="text-gray-300">Answered</span>
                  </div>
                  <div class="flex items-center mr-4">
                    <div class="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
                    <span class="text-gray-300">Flagged for Review</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-4 h-4 bg-gray-600 rounded-sm border border-gray-500 mr-2"></div>
                    <span class="text-gray-300">Current</span>
                  </div>
                </div>
              </div>
              
              {/* Question Grid */}
              <div class="overflow-x-auto">
                <div class="grid grid-cols-5 gap-2 md:grid-cols-3 lg:grid-cols-5 min-w-max">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => onChangeQuestion(index)}
                      class={`w-10 h-10 rounded-md flex items-center justify-center font-medium transition duration-300 ${
                        current === index 
                          ? 'bg-gray-600 border border-green-500'
                          : flagged.includes(index)
                            ? 'bg-yellow-500'
                            : answers[index]
                              ? 'bg-green-600'
                              : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div class="flex justify-between mt-4">
                <div class="text-sm text-gray-400">
                  <span class="font-medium text-green-500">{answers.filter(a => a).length}</span> Answered
                  <span class="mx-2">|</span>
                  <span class="font-medium text-yellow-500">{flagged.length}</span> Flagged
                  <span class="mx-2">|</span>
                  <span class="font-medium text-white">{questions.length - answers.filter(a => a).length}</span> Remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }