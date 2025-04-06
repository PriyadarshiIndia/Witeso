import { useState, useEffect } from 'preact/hooks';

export default function ViewAnswer({ questions, userAnswers, flaggedQuestions = [], onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [storedAnswers, setStoredAnswers] = useState([]);
  const [storedFlags, setStoredFlags] = useState([]);

  useEffect(() => {
    // Store current URL before redirecting
    localStorage.setItem('redirect_after_login', window.location.pathname);
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    localStorage.setItem('flaggedQuestions', JSON.stringify(flaggedQuestions));

    fetch('/api/user')
      .then(response => response.json())
      .then(data => {
        if (!data.logged_in) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        } else {
          setIsLoggedIn(true);
          
          // Restore test progress if available
          const savedAnswers = localStorage.getItem('userAnswers');
          const savedFlags = localStorage.getItem('flaggedQuestions');

          if (savedAnswers) setStoredAnswers(JSON.parse(savedAnswers));
          if (savedFlags) setStoredFlags(JSON.parse(savedFlags));
        }
      })
      .catch(() => window.location.href = '/login');
  }, []);

  if (isLoggedIn === null) {
    return (
      <section class="bg-gray-900 text-white py-8 pt-30">
        <div class="max-w-6xl mx-auto mt-8 mb-8 px-4 sm:px-6 lg:px-8 animate-pulse">
          <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold">Test Review</h1>
                <button 
                  class="text-green-500 hover:text-green-400 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  Back to Results
                </button>
              </div>
            </div>
            <div class="h-6 w-1/3 bg-gray-700 mb-4 rounded"></div>
            <div class="h-4 w-2/3 bg-gray-700 mb-4 rounded"></div>
            <div class="h-4 w-full bg-gray-700 mb-4 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  const getQuestionStatus = (index) => {
    const answers = storedAnswers.length ? storedAnswers : userAnswers;
    if (!answers[index]) return 'unanswered';
    return answers[index] === questions[index].correctAnswer ? 'correct' : 'incorrect';
  };

  const currentStatus = getQuestionStatus(currentQuestion);
  const currentQuestionData = questions[currentQuestion];
  
  return (
    <section class="bg-gray-900 text-white py-8 pt-30">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            {/* Header */}
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-2xl font-bold">Test Review</h1>
              <button 
                onClick={onBack}
                class="text-green-500 hover:text-green-400 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                Back to Results
              </button>
            </div>

            {/* Main Content */}
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Navigation Sidebar */}
              <div class="lg:col-span-1 bg-gray-700 p-4 rounded-lg">
                <h2 class="text-lg font-bold mb-4">Question Navigation</h2>
                
                {/* Question Grid */}
                <div class="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuestion(index);
                        setShowExplanation(false);
                      }}
                      class={`w-full p-2 rounded-md flex items-center justify-center transition-colors ${
                        currentQuestion === index 
                          ? 'bg-green-600' 
                          : getQuestionStatus(index) === 'correct' 
                            ? 'bg-green-500/30 hover:bg-green-500/40' 
                            : getQuestionStatus(index) === 'incorrect' 
                              ? 'bg-red-500/30 hover:bg-red-500/40' 
                              : 'bg-gray-600 hover:bg-gray-500'
                      } ${
                        Array.isArray(flaggedQuestions) && flaggedQuestions.includes(index) 
                          ? 'ring-2 ring-yellow-500' 
                          : ''
                      }`}
                    >
                      {index + 1}
                      {Array.isArray(flaggedQuestions) && flaggedQuestions.includes(index) && (
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Summary Stats */}
                <div class="mt-6 pt-4 border-t border-gray-600">
                  <div class="flex justify-between mb-2">
                    <span class="text-green-500">Correct:</span>
                    <span>{userAnswers.filter((a, i) => a === questions[i].correctAnswer).length}</span>
                  </div>
                  <div class="flex justify-between mb-2">
                    <span class="text-red-500">Incorrect:</span>
                    <span>{userAnswers.filter((a, i) => a && a !== questions[i].correctAnswer).length}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Unanswered:</span>
                    <span>{userAnswers.filter(a => !a).length}</span>
                  </div>
                </div>
              </div>

              {/* Question Review */}
              <div class="lg:col-span-3">
                <div class="bg-gray-700 p-6 rounded-lg">
                  {/* Question Header */}
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">
                      Question {currentQuestion + 1} of {questions.length}
                    </h3>
                    <span class={`px-3 py-1 rounded-full text-sm ${
                      currentStatus === 'correct' 
                        ? 'bg-green-500/20 text-green-500' 
                        : currentStatus === 'incorrect' 
                          ? 'bg-red-500/20 text-red-500' 
                          : 'bg-gray-600 text-gray-300'
                    }`}>
                      {currentStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div class="text-lg mb-6"
                    dangerouslySetInnerHTML={{ __html: currentQuestionData.question.replace(/style="[^"]*"/g, "")}}
                  ></div>

                  {/* Answer Options */}
                  <div class="space-y-3">
                    {currentQuestionData.options.map((option, index) => {
                      const isCorrect = option === currentQuestionData.correctAnswer;
                      const isUserAnswer = option === userAnswers[currentQuestion];
                      
                      return (
                        <div key={index} class={`p-4 rounded-md border-2 transition-colors ${
                          isCorrect 
                            ? 'border-green-500 bg-green-500/10' 
                            : isUserAnswer 
                              ? 'border-red-500 bg-red-500/10' 
                              : 'border-gray-600'
                        }`}>
                          <div class="flex items-center">
                            {isCorrect && (
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 10.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l5.293-5.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                              </svg>
                            )}
                            <span class={`${isCorrect ? 'font-bold text-green-500' : ''} ${isUserAnswer ? 'font-bold' : ''}`}
                              dangerouslySetInnerHTML={{ __html: option.replace(/style="[^"]*"/g, "") }}
                            >
                            </span>
                          </div>
                          {isUserAnswer && !isCorrect && (
                            <p class="text-red-400 text-sm mt-2">
                              Your answer
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Section */}
                  {currentQuestionData.explanation && (
                    <div class="mt-6 pt-4 border-t border-gray-600">
                      <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        class="flex items-center text-green-500 hover:text-green-400 mb-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                        </svg>
                        {showExplanation ? 'Hide' : 'View'} Explanation
                      </button>
                      {showExplanation && (
                        <>
                          {currentQuestionData.explanation.includes("youtube.com/embed") ? (
                            <iframe 
                              src={currentQuestionData.explanation.match(/(https:\/\/www\.youtube\.com\/embed\/[^"']+)/)?.[0] || ''} 
                              className="w-full h-64 mt-4"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <div
                              className="text-gray-300"
                              dangerouslySetInnerHTML={{
                                __html: currentQuestionData.explanation.replace('/_files', 'https://indiabix.com//_files')
                              }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}