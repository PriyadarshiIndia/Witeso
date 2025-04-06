export default function TimerSection({ timeRemaining, totalTiming, totalTimingInSeconds, onEndTest }) {
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    return (
      <section id="timer-section" class="pt-30 bg-gray-900 text-white py-4">
        <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div class="p-4">
              <div class="flex flex-col sm:flex-row justify-between items-center">
                {/* Progress Bar */}
                <div class="mb-4 sm:mb-0">
                  <h2 class="text-lg font-medium mb-1">Test Progress</h2>
                  <div class="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      class="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(timeRemaining / totalTimingInSeconds) * 100}%` }}
                    ></div>
                  </div>
                  <div class="flex justify-between mt-1 text-sm text-gray-400">
                    <span>{formatTime(totalTimingInSeconds - timeRemaining)} Elapsed</span>
                    <span class='px-6'>{Math.round((1 - timeRemaining / totalTimingInSeconds) * 100)}% Complete</span>
                  </div>
                </div>
                
                {/* Timer Display */}
                <div class="flex flex-col items-center">
                  <h2 class="text-lg font-medium mb-1">Time Remaining</h2>
                  <div class="bg-gray-700 rounded-lg p-3 flex items-center">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div class="text-2xl font-bold tracking-wider">
                        <span class="text-white">{formatTime(timeRemaining)}</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">{totalTiming} Minutes Total</p>
                </div>
                
                {/* End Test Button */}
                <div class="mt-4 sm:mt-0 flex items-center">
                  <button 
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center"
                    onClick={onEndTest}
                  >
                    End Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }