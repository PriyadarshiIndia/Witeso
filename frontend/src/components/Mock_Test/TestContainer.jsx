// TestContainer.jsx
import { useState, useEffect } from 'preact/hooks';
import TestOverview from './TestOverview';
import TestNavigation from './TestNavigation';
import QuestionDisplay from './QuestionDisplay';
import TimerSection from './TimerSection';
import AnswerSubmission from './AnswerSubmission';
import TestCompletion from './TestCompletion';

export default function TestContainer({ questions, test_title, duration=null }) {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const initialDuration = duration ? duration * 60 : questions.length * 60 * 1.5;

  const [testState, setTestState] = useState({
    test_title: test_title,
    started: false,
    completed: false,
    currentQuestion: 0,
    answers: [],
    flagged: [],
    timeRemaining: initialDuration,
    totalTiming: formatTime(initialDuration),
    totalTimingInSeconds: initialDuration,
    showSubmission: false,
    score: 0
  });

  // Timer effect
  useEffect(() => {
    if (testState.started && !testState.completed && !testState.showSubmission) {
      const timer = setInterval(() => {
        setTestState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining > 0 ? prev.timeRemaining - 1 : 0
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testState.started, testState.completed, testState.showSubmission]);

  const handleAnswer = (answer) => {
    const newAnswers = [...testState.answers];
    newAnswers[testState.currentQuestion] = answer;
    setTestState(prev => ({ ...prev, answers: newAnswers }));
  };

  const handleQuestionChange = (index) => {
    setTestState(prev => ({ ...prev, currentQuestion: index }));
  };

  const handleFlag = () => {
    const newFlagged = [...testState.flagged];
    const index = newFlagged.indexOf(testState.currentQuestion);
    if (index === -1) {
      newFlagged.push(testState.currentQuestion);
    } else {
      newFlagged.splice(index, 1);
    }
    setTestState(prev => ({ ...prev, flagged: newFlagged }));
  };

  const handleSubmit = () => {
    const correct = testState.answers.reduce((acc, answer, index) => (
      acc + (answer === questions[index].correctAnswer ? 1 : 0)
    ), 0);
    setTestState(prev => ({
      ...prev,
      completed: true,
      score: Math.round((correct / questions.length) * 100)
    }));
  };

  if (testState.completed) {
    return <TestCompletion test_title={testState.test_title} score={testState.score} questions={questions} answers={testState.answers} totalTiming={testState.totalTiming} timeRemaining={testState.timeRemaining} totalTimingInSeconds={testState.totalTimingInSeconds} />;
  }

  if (testState.showSubmission) {
    return (
      <AnswerSubmission
        onCancel={() => setTestState(prev => ({ ...prev, showSubmission: false }))}
        onSubmit={handleSubmit}
        {...testState}
        questions={questions}
      />
    );
  }

  if (!testState.started) {
    return <TestOverview duration={initialDuration/60} totalQuestions={questions.length} mockTestTitle={testState.test_title} onStart={() => setTestState(prev => ({ ...prev, started: true }))} />;
  }

  return (
    <div>
      <TimerSection
        {...testState}
        onEndTest={() => setTestState(prev => ({ ...prev, showSubmission: true }))}
      />
      
      <div class="grid md:grid-cols-3 bg-gray-900">
        <div class="md:col-span-2">
          <QuestionDisplay
            question={questions[testState.currentQuestion]}
            current={testState.currentQuestion}
            total={questions.length}
            answer={testState.answers[testState.currentQuestion]}
            onAnswer={handleAnswer}
            onFlag={handleFlag}
            isFlagged={testState.flagged.includes(testState.currentQuestion)}
            onPrev={() => handleQuestionChange(Math.max(0, testState.currentQuestion - 1))}
            onNext={() => handleQuestionChange(Math.min(questions.length - 1, testState.currentQuestion + 1))}
          />
        </div>
        
        <div class="md:col-span-1 bg-gray-900">
          <TestNavigation
            questions={questions}
            current={testState.currentQuestion}
            answers={testState.answers}
            flagged={testState.flagged}
            onChangeQuestion={handleQuestionChange}
          />
        </div>
      </div>
    </div>
  );
}