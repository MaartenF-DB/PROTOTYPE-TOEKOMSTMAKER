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
import { VISITING_OPTIONS, ACTION_OPTIONS, LIKERT_SCALE, CONFIDENCE_SCALE, TOPICS } from '@/types/survey';

// Import topic illustrations
import vredeImg from '@assets/VREDE_1752670457359.png';
import gezondheidImg from '@assets/GEZONDHEID_1752670458852.png';
import rijkdomImg from '@assets/RIJKDOM_1752670460242.png';
import vrijeTijdImg from '@assets/VRIJE TIJD_1752670475302.png';
import klimaatImg from '@assets/KLIMAAT_1752670476669.png';
import wonenImg from '@assets/WONEN_1752670478064.png';

const topicImages = {
  VREDE: vredeImg,
  GEZONDHEID: gezondheidImg,
  RIJKDOM: rijkdomImg,
  'VRIJE TIJD': vrijeTijdImg,
  KLIMAAT: klimaatImg,
  WONEN: wonenImg
};

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
  
  // Get topic data for theming
  const topicData = TOPICS[answers.mostImportantTopic as keyof typeof TOPICS];
  const topicImage = topicImages[answers.mostImportantTopic as keyof typeof topicImages];
  
  // Create topic-specific gradient based on hex color
  const getTopicGradient = (hexColor: string) => {
    // Create a gradient that transitions from the topic color to a slightly darker version
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      const darkerRgb = {
        r: Math.max(0, rgb.r - 30),
        g: Math.max(0, rgb.g - 30),
        b: Math.max(0, rgb.b - 30)
      };
      return `linear-gradient(135deg, ${hexColor} 0%, rgb(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b}) 100%)`;
    }
    return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
  };
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

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
            <div className="flex flex-col items-center space-y-6">
              {topicImage && (
                <div className="mb-4">
                  <img 
                    src={topicImage} 
                    alt={answers.mostImportantTopic} 
                    className="w-1/2 h-auto max-h-48 object-contain rounded-[20px] bg-white bg-opacity-20 p-4"
                  />
                </div>
              )}
              <LikertScale
                options={LIKERT_SCALE}
                value={answers.feelingBefore}
                onValueChange={(value) => updateAnswers({ feelingBefore: value })}
              />
            </div>
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
            <div className="flex flex-col items-center space-y-6">
              {topicImage && (
                <div className="mb-4">
                  <img 
                    src={topicImage} 
                    alt={answers.mostImportantTopic} 
                    className="w-1/2 h-auto max-h-48 object-contain rounded-[20px] bg-white bg-opacity-20 p-4"
                  />
                </div>
              )}
              <LikertScale
                options={CONFIDENCE_SCALE}
                value={answers.confidenceBefore}
                onValueChange={(value) => updateAnswers({ confidenceBefore: value })}
              />
            </div>
          </Question>
        );

      case 'checkin-closing':
        return (
          <CheckInClosing 
            onComplete={() => setCurrentSection('name-verification')}
          />
        );

      case 'name-verification':
        return (
          <Question
            questionNumber={0}
            question="Kun je je naam nog een keer invullen?"
            bgGradient="from-blue-500 to-teal-500"
            buttonColor="bg-blue-600 hover:bg-blue-700"
            onNext={() => setCurrentSection('checkout-intro')}
            showPrevious={false}
            isValid={nameVerification.length > 0}
          >
            <div className="space-y-4">
              <Input
                value={nameVerification}
                onChange={(e) => setNameVerification(e.target.value)}
                placeholder="Typ hier je naam..."
                className="w-full p-4 text-2xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
              />
              <p className="text-sm text-white opacity-80">
                Als er meer mensen zijn met dezelfde naam, typ dan je naam met een nummer (bijvoorbeeld: {answers.name} 1)
              </p>
            </div>
          </Question>
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
          <div 
            className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
            style={{ background: topicData?.hexColor ? getTopicGradient(topicData.hexColor) : 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)' }}
          >
            <div className="text-center max-w-5xl w-full">
              <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">{`Hoe voel je je nu over het onderwerp ${answers.mostImportantTopic}?`}</h2>
                
                {topicImage && (
                  <div className="mb-6">
                    <img 
                      src={topicImage} 
                      alt={answers.mostImportantTopic} 
                      className="w-1/2 h-auto max-h-48 mx-auto object-contain rounded-[20px] bg-white bg-opacity-20 p-4"
                    />
                  </div>
                )}
                
                <LikertScale
                  options={LIKERT_SCALE}
                  value={answers.feelingAfter}
                  onValueChange={(value) => updateAnswers({ feelingAfter: value })}
                />
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setCurrentSection('question-7')}
                  disabled={answers.feelingAfter === null}
                  className={`px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
                    answers.feelingAfter !== null 
                      ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white' 
                      : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Volgende
                </button>
              </div>
            </div>
          </div>
        );

      case 'question-7':
        return (
          <div 
            className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
            style={{ background: topicData?.hexColor ? getTopicGradient(topicData.hexColor) : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }}
          >
            <div className="text-center max-w-5xl w-full">
              <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">{`Wat zou je doen voor ${answers.mostImportantTopic} in de toekomst?`}</h2>
                
                {topicImage && (
                  <div className="mb-6">
                    <img 
                      src={topicImage} 
                      alt={answers.mostImportantTopic} 
                      className="w-1/2 h-auto max-h-48 mx-auto object-contain rounded-[20px] bg-white bg-opacity-20 p-4"
                    />
                  </div>
                )}
                
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
                            {answers.actionChoice === option.value && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topicData?.hexColor || '#06b6d4' }} />}
                          </div>
                        </label>
                      </div>
                    ))}
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
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setCurrentSection('question-6')}
                  className="px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                >
                  Vorige
                </button>
                <button 
                  onClick={() => setCurrentSection('question-8')}
                  disabled={answers.actionChoice.length === 0}
                  className={`px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
                    answers.actionChoice.length > 0 
                      ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white' 
                      : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Volgende
                </button>
              </div>
            </div>
          </div>
        );

      case 'question-8':
        return (
          <div 
            className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
            style={{ background: topicData?.hexColor ? getTopicGradient(topicData.hexColor) : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <div className="text-center max-w-5xl w-full">
              <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">{`Hoeveel vertrouwen heb je dat je iets kan veranderen aan ${answers.mostImportantTopic} in de toekomst?`}</h2>
                
                {topicImage && (
                  <div className="mb-6">
                    <img 
                      src={topicImage} 
                      alt={answers.mostImportantTopic} 
                      className="w-1/2 h-auto max-h-48 mx-auto object-contain rounded-[20px] bg-white bg-opacity-20 p-4"
                    />
                  </div>
                )}
                
                <LikertScale
                  options={CONFIDENCE_SCALE}
                  value={answers.confidenceAfter}
                  onValueChange={(value) => updateAnswers({ confidenceAfter: value })}
                />
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setCurrentSection('question-7')}
                  className="px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                >
                  Vorige
                </button>
                <button 
                  onClick={() => {
                    completeSurvey();
                    setCurrentSection('results');
                  }}
                  disabled={answers.confidenceAfter === null}
                  className={`px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
                    answers.confidenceAfter !== null 
                      ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white' 
                      : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Voltooien
                </button>
              </div>
            </div>
          </div>
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

      {/* Dashboard Link for Staff */}
      <div className="fixed top-4 right-4 z-50">
        <a 
          href="/dashboard" 
          className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
        >
          Dashboard
        </a>
      </div>

      {renderCurrentSection()}
    </div>
  );
}
