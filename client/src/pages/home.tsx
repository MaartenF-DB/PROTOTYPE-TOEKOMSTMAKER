import { useSurvey } from '@/hooks/useSurvey';
import { CheckInIntro } from '@/components/survey/CheckInIntro';
import { Question } from '@/components/survey/Question';
import { CheckInClosing } from '@/components/survey/CheckInClosing';
import { CheckOutIntro } from '@/components/survey/CheckOutIntro';
import { Results } from '@/components/survey/Results';
import { MultipleChoice } from '@/components/survey/MultipleChoice';
import { RankingQuestion } from '@/components/survey/RankingQuestion';
import { LikertScale } from '@/components/survey/LikertScale';
import { NameVerification } from '@/components/survey/NameVerification';
import { Input } from '@/components/ui/input';
import { VISITING_OPTIONS, ACTION_OPTIONS, LIKERT_SCALE, CONFIDENCE_SCALE } from '@/types/survey';

export default function Home() {
  const {
    state,
    updateAnswers,
    setCurrentSection,
    setCurrentQuestion,
    completeSurvey,
    resetSurvey,
    getCurrentProgress,
    nameVerification,
    setNameVerification
  } = useSurvey();

  const { currentSection, answers } = state;

  const progressPercentage = getCurrentProgress();

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'checkin-intro':
        return (
          <CheckInIntro 
            onStart={() => setCurrentSection('question-0')}
          />
        );

      case 'question-0':
        return (
          <Question
            questionNumber={0}
            question="Wat is je naam?"
            bgGradient="from-blue-500 to-teal-500"
            buttonColor="bg-blue-600 hover:bg-blue-700"
            onNext={() => setCurrentSection('question-1')}
            showPrevious={false}
            isValid={answers.name.length > 0}
          >
            <div className="space-y-4">
              <Input
                value={answers.name}
                onChange={(e) => updateAnswers({ name: e.target.value })}
                placeholder="Typ hier je naam..."
                className="w-full p-4 text-2xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
              />
              <p className="text-sm text-white opacity-80">
                Als er meer mensen zijn met dezelfde naam, typ dan je naam met een nummer (bijvoorbeeld: Jan 1)
              </p>
            </div>
          </Question>
        );

      case 'question-1':
        return (
          <Question
            questionNumber={1}
            question="Hoe oud ben jij?"
            bgGradient="from-green-500 to-blue-500"
            buttonColor="bg-green-600 hover:bg-green-700"
            onNext={() => setCurrentSection('question-2')}
            onPrevious={() => setCurrentSection('question-0')}
            isValid={answers.age.length > 0}
          >
            <MultipleChoice
              options={[
                { value: '6', label: '6' },
                { value: '7', label: '7' },
                { value: '8', label: '8' },
                { value: '9', label: '9' },
                { value: '10', label: '10' },
                { value: '11', label: '11' },
                { value: '12', label: '12' },
                { value: 'other', label: 'Anders...', icon: '❓' }
              ]}
              value={answers.age}
              onValueChange={(value) => updateAnswers({ age: value })}
              otherValue={answers.age === 'other' ? answers.age : ''}
              onOtherValueChange={(value) => updateAnswers({ age: value })}
              columns={8}
            />
          </Question>
        );

      case 'question-2':
        return (
          <Question
            questionNumber={2}
            question="Met wie bezoek je de tentoonstelling?"
            bgGradient="from-purple-500 to-pink-500"
            buttonColor="bg-purple-600 hover:bg-purple-700"
            onNext={() => setCurrentSection('question-3')}
            onPrevious={() => setCurrentSection('question-1')}
            isValid={answers.visitingWith.length > 0}
          >
            <MultipleChoice
              options={VISITING_OPTIONS}
              value={answers.visitingWith}
              onValueChange={(value) => updateAnswers({ visitingWith: value })}
              otherValue={answers.visitingWithOther}
              onOtherValueChange={(value) => updateAnswers({ visitingWithOther: value })}
              columns={5}
            />
          </Question>
        );

      case 'question-3':
        return (
          <Question
            questionNumber={3}
            question="Welk onderwerp voor de toekomst vind jij het belangrijkst?"
            bgGradient="from-yellow-500 to-orange-500"
            buttonColor="bg-orange-600 hover:bg-orange-700"
            onNext={() => {
              const mostImportant = answers.topicRanking[answers.topicRanking.length - 1];
              updateAnswers({ mostImportantTopic: mostImportant });
              setCurrentSection('question-4');
            }}
            onPrevious={() => setCurrentSection('question-2')}
            isValid={true}
          >
            <RankingQuestion
              ranking={answers.topicRanking}
              onRankingChange={(ranking) => updateAnswers({ topicRanking: ranking })}
            />
          </Question>
        );

      case 'question-4':
        return (
          <Question
            questionNumber={4}
            question={`Hoe voel je je over het onderwerp ${answers.mostImportantTopic}?`}
            bgGradient="from-red-500 to-pink-500"
            buttonColor="bg-red-600 hover:bg-red-700"
            onNext={() => setCurrentSection('question-5')}
            onPrevious={() => setCurrentSection('question-3')}
            isValid={answers.feelingBefore !== null}
          >
            <LikertScale
              options={LIKERT_SCALE}
              value={answers.feelingBefore}
              onValueChange={(value) => updateAnswers({ feelingBefore: value })}
            />
          </Question>
        );

      case 'question-5':
        return (
          <Question
            questionNumber={5}
            question={`Hoeveel vertrouwen heb je dat je iets kan veranderen aan ${answers.mostImportantTopic} in de toekomst?`}
            bgGradient="from-indigo-500 to-purple-500"
            buttonColor="bg-purple-600 hover:bg-purple-700"
            onComplete={() => setCurrentSection('checkin-closing')}
            onPrevious={() => setCurrentSection('question-4')}
            showNext={false}
            showComplete={true}
            isValid={answers.confidenceBefore !== null}
          >
            <LikertScale
              options={CONFIDENCE_SCALE}
              value={answers.confidenceBefore}
              onValueChange={(value) => updateAnswers({ confidenceBefore: value })}
            />
          </Question>
        );

      case 'checkin-closing':
        return (
          <CheckInClosing 
            onComplete={() => setCurrentSection('checkout-intro')}
          />
        );

      case 'checkout-intro':
        return (
          <CheckOutIntro 
            onStart={() => setCurrentSection('question-6')}
            mostImportantTopic={answers.mostImportantTopic}
          />
        );

      case 'question-6':
        return (
          <Question
            questionNumber={6}
            question={`Hoe voel je je nu over het onderwerp ${answers.mostImportantTopic}?`}
            bgGradient="from-pink-500 to-red-500"
            buttonColor="bg-pink-600 hover:bg-pink-700"
            onNext={() => setCurrentSection('question-7')}
            showPrevious={false}
            isValid={answers.feelingAfter !== null}
          >
            <LikertScale
              options={LIKERT_SCALE}
              value={answers.feelingAfter}
              onValueChange={(value) => updateAnswers({ feelingAfter: value })}
            />
          </Question>
        );

      case 'question-7':
        return (
          <Question
            questionNumber={7}
            question={`Wat zou je doen voor ${answers.mostImportantTopic} in de toekomst?`}
            bgGradient="from-cyan-500 to-blue-500"
            buttonColor="bg-cyan-600 hover:bg-cyan-700"
            onNext={() => setCurrentSection('question-8')}
            onPrevious={() => setCurrentSection('question-6')}
            isValid={answers.actionChoice.length > 0}
          >
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {ACTION_OPTIONS.map((option) => (
                  <div key={option.value} className="flex flex-col items-center space-y-2">
                    <div className="text-6xl mb-2">{option.icon}</div>
                    <p className="text-lg font-semibold text-center mb-2">{option.label}</p>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="action-choice"
                        value={option.value}
                        checked={answers.actionChoice === option.value}
                        onChange={() => updateAnswers({ actionChoice: option.value })}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all ${
                        answers.actionChoice === option.value 
                          ? 'bg-white' 
                          : 'bg-transparent hover:bg-white hover:bg-opacity-20'
                      }`}>
                        {answers.actionChoice === option.value && <div className="w-3 h-3 rounded-full bg-cyan-600" />}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between items-center px-4">
                <span className="text-sm font-medium">{ACTION_OPTIONS[0]?.label}</span>
                <span className="text-sm font-medium">{ACTION_OPTIONS[ACTION_OPTIONS.length - 1]?.label}</span>
              </div>
              
              {/* Selected option display */}
              <div className="text-center">
                {answers.actionChoice && (
                  <p className="text-lg font-semibold">
                    {ACTION_OPTIONS.find(opt => opt.value === answers.actionChoice)?.label}
                  </p>
                )}
              </div>
            </div>
          </Question>
        );

      case 'question-8':
        return (
          <Question
            questionNumber={8}
            question={`Hoeveel vertrouwen heb je dat je iets kan veranderen aan ${answers.mostImportantTopic} in de toekomst?`}
            bgGradient="from-violet-500 to-purple-500"
            buttonColor="bg-purple-600 hover:bg-purple-700"
            onComplete={() => {
              completeSurvey();
              setCurrentSection('results');
            }}
            onPrevious={() => setCurrentSection('question-7')}
            showNext={false}
            showComplete={true}
            isValid={answers.confidenceAfter !== null}
          >
            <LikertScale
              options={CONFIDENCE_SCALE}
              value={answers.confidenceAfter}
              onValueChange={(value) => updateAnswers({ confidenceAfter: value })}
            />
          </Question>
        );

      case 'results':
        return (
          <Results 
            answers={answers}
            onRestart={resetSurvey}
          />
        );

      default:
        return (
          <CheckInIntro 
            onStart={() => setCurrentSection('question-0')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {renderCurrentSection()}
    </div>
  );
}
