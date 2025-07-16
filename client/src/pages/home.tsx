import { useSurvey } from '@/hooks/useSurvey';
import { EntryChoice } from '@/components/survey/EntryChoice';
import { CheckInIntro } from '@/components/survey/CheckInIntro';
import { Question } from '@/components/survey/Question';
import { CheckInClosing } from '@/components/survey/CheckInClosing';
import { CheckOutIntro } from '@/components/survey/CheckOutIntro';
import { Results } from '@/components/survey/Results';
import { MultipleChoice } from '@/components/survey/MultipleChoice';
import { RankingQuestion } from '@/components/survey/RankingQuestion';
import { LikertScale } from '@/components/survey/LikertScale';
import { NameVerification } from '@/components/survey/NameVerification';
import { NameMatching } from '@/components/survey/NameMatching';
import { Input } from '@/components/ui/input';
import { VISITING_OPTIONS, ACTION_OPTIONS, LIKERT_SCALE, CONFIDENCE_SCALE, TOPICS } from '@/types/survey';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

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
  const [checkoutOnly, setCheckoutOnly] = useState(false);

  const progressPercentage = getCurrentProgress();
  
  // Query to check for existing names
  const { data: existingResponses = [] } = useQuery({
    queryKey: ['/api/survey-responses'],
    enabled: true
  });
  
  // Check if current name already exists and get similar names
  const hasNameConflict = existingResponses.some((response: any) => 
    response.name === answers.name && answers.name.length > 0
  );
  
  // Find similar names for checkout flow
  const findSimilarNames = (inputName: string) => {
    if (!inputName.trim()) return [];
    const lowerInput = inputName.toLowerCase();
    return existingResponses
      .filter((response: any) => response.name.toLowerCase().includes(lowerInput) || lowerInput.includes(response.name.toLowerCase()))
      .map((response: any) => response.name);
  };
  
  const similarNames = findSimilarNames(answers.name);
  
  // Get topic data for theming
  const topicData = TOPICS[answers.mostImportantTopic as keyof typeof TOPICS];
  
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
      case 'entry-choice':
        return (
          <EntryChoice
            onCheckIn={() => {
              setCheckoutOnly(false);
              setCurrentSection('checkin-intro');
            }}
            onCheckOut={() => {
              setCheckoutOnly(false);
              setCurrentSection('checkout-intro');
            }}
          />
        );
      case 'name-verification':
        return (
          <NameVerification
            originalName={answers.name}
            nameVerification={nameVerification}
            onNameVerificationChange={setNameVerification}
            onContinue={() => {
              updateAnswers({ name: nameVerification });
              setCurrentSection('question-6');
            }}
          />
        );
      case 'checkin-intro':
        return (
          <CheckInIntro 
            onStart={() => {
              // Clear name to force re-entry
              updateAnswers({ name: '' });
              setCurrentSection('question-0');
            }}
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
              {hasNameConflict && (
                <p className="text-sm text-white opacity-80">
                  Als er meer mensen zijn met dezelfde naam, typ dan je naam met een nummer (bijvoorbeeld: Jan 1)
                </p>
              )}
              {answers.name.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">Jouw antwoord:</p>
                  <p className="text-white text-lg">{answers.name}</p>
                </div>
              )}
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
            <div className="space-y-4">
              <MultipleChoice
                options={[
                  { value: '6', label: '6' },
                  { value: '7', label: '7' },
                  { value: '8', label: '8' },
                  { value: '9', label: '9' },
                  { value: '10', label: '10' },
                  { value: '11', label: '11' },
                  { value: '12', label: '12' },
                  { value: 'other', label: 'Anders...' }
                ]}
                value={answers.age}
                onValueChange={(value) => updateAnswers({ age: value })}
                otherValue={answers.age === 'other' ? answers.age : ''}
                onOtherValueChange={(value) => updateAnswers({ age: value })}
                columns={8}
              />
              {answers.age.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">Jouw antwoord:</p>
                  <p className="text-white text-lg">{answers.age === 'other' ? answers.age : `${answers.age} jaar`}</p>
                </div>
              )}
            </div>
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
            <div className="space-y-4">
              <MultipleChoice
                options={VISITING_OPTIONS}
                value={answers.visitingWith}
                onValueChange={(value) => updateAnswers({ visitingWith: value })}
                otherValue={answers.visitingWithOther}
                onOtherValueChange={(value) => updateAnswers({ visitingWithOther: value })}
                columns={5}
              />
              {answers.visitingWith.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">Jouw antwoord:</p>
                  <p className="text-white text-lg">
                    {answers.visitingWith === 'other' ? answers.visitingWithOther : 
                     VISITING_OPTIONS.find(opt => opt.value === answers.visitingWith)?.label}
                  </p>
                </div>
              )}
            </div>
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
            <div className="space-y-4">
              <RankingQuestion
                ranking={answers.topicRanking}
                onRankingChange={(ranking) => updateAnswers({ topicRanking: ranking })}
              />
            </div>
          </Question>
        );

      case 'question-4':
        return (
          <div 
            className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
            style={{ background: topicData?.hexColor ? getTopicGradient(topicData.hexColor) : 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)' }}
          >
            <div className="text-center max-w-5xl w-full">
              <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">{`Hoe voel je je over het onderwerp ${answers.mostImportantTopic}?`}</h2>
                
                <div className="flex flex-col items-center space-y-6">
                  {topicData && (
                    <div className="mb-4 p-6 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                      <div className="text-8xl mb-4 text-center">{topicData.icon}</div>
                      <div className="text-xl font-semibold text-white mb-2 text-center">{answers.mostImportantTopic}</div>
                      <div className="text-sm text-white opacity-90 max-w-md mx-auto text-center">
                        {topicData.description}
                      </div>
                    </div>
                  )}
                  <LikertScale
                    options={LIKERT_SCALE}
                    value={answers.feelingBefore}
                    onValueChange={(value) => updateAnswers({ feelingBefore: value })}
                  />
                  {answers.feelingBefore !== null && (
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-white font-semibold">Jouw antwoord:</p>
                      <p className="text-white text-lg">{LIKERT_SCALE.find(opt => opt.value === answers.feelingBefore)?.label}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setCurrentSection('question-3')}
                  className="px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                >
                  Vorige
                </button>
                <button 
                  onClick={() => setCurrentSection('question-5')}
                  disabled={answers.feelingBefore === null}
                  className={`px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
                    answers.feelingBefore !== null 
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

      case 'question-5':
        return (
          <div 
            className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
            style={{ background: topicData?.hexColor ? getTopicGradient(topicData.hexColor) : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
          >
            <div className="text-center max-w-5xl w-full">
              <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
                <h2 className="text-3xl font-bold mb-6">{`Hoeveel vertrouwen heb je dat je iets kan veranderen aan ${answers.mostImportantTopic} in de toekomst?`}</h2>
                
                <div className="flex flex-col items-center space-y-6">
                  {topicData && (
                    <div className="mb-4 p-6 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                      <div className="text-8xl mb-4 text-center">{topicData.icon}</div>
                      <div className="text-xl font-semibold text-white mb-2 text-center">{answers.mostImportantTopic}</div>
                      <div className="text-sm text-white opacity-90 max-w-md mx-auto text-center">
                        {topicData.description}
                      </div>
                    </div>
                  )}
                  <LikertScale
                    options={CONFIDENCE_SCALE}
                    value={answers.confidenceBefore}
                    onValueChange={(value) => updateAnswers({ confidenceBefore: value })}
                  />
                  {answers.confidenceBefore !== null && (
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-white font-semibold">Jouw antwoord:</p>
                      <p className="text-white text-lg">{CONFIDENCE_SCALE.find(opt => opt.value === answers.confidenceBefore)?.label}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setCurrentSection('question-4')}
                  className="px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                >
                  Vorige
                </button>
                <button 
                  onClick={() => setCurrentSection('checkin-closing')}
                  disabled={answers.confidenceBefore === null}
                  className={`px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
                    answers.confidenceBefore !== null 
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

      case 'checkin-closing':
        return (
          <CheckInClosing 
            onComplete={() => {
              setCheckoutOnly(false);
              setCurrentSection('entry-choice');
            }}
          />
        );

      case 'checkout-intro':
        return (
          <CheckOutIntro 
            onStart={() => {
              // For checkout, go directly to name input
              updateAnswers({ name: '' });
              setCurrentSection('checkout-name');
            }}
            mostImportantTopic={answers.mostImportantTopic}
          />
        );
      case 'checkout-name':
        return (
          <Question
            questionNumber={0}
            question="Wat is je naam?"
            bgGradient="from-orange-500 to-red-500"
            buttonColor="bg-orange-600 hover:bg-orange-700"
            onNext={() => {
              // If checkout only, skip name matching and go directly to questions
              if (checkoutOnly) {
                setCurrentSection('question-6');
                return;
              }
              
              // For regular checkout, check if name exists
              if (similarNames.length > 0) {
                setCurrentSection('name-matching');
              } else if (answers.name.length > 0) {
                // Name entered but no match found - this shouldn't happen now
                // since we only allow existing names or checkout-only
                setCurrentSection('question-6');
              }
            }}
            showPrevious={false}
            isValid={answers.name.length > 0 || checkoutOnly}
          >
            <div className="space-y-4">
              <Input
                value={answers.name}
                onChange={(e) => updateAnswers({ name: e.target.value })}
                placeholder="Typ hier je naam..."
                className="w-full p-4 text-2xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-orange-300 outline-none"
                disabled={false}
              />
              
              {/* Show existing names for selection */}
              {existingResponses.length > 0 && !checkoutOnly && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-medium mb-2">Of kies je naam uit de lijst:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {existingResponses.map((response: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => updateAnswers({ name: response.name })}
                        className="p-2 bg-white bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all text-white text-left"
                      >
                        {response.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Checkbox for checkout only */}
              <div className="border-t border-white border-opacity-30 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkoutOnly}
                    onChange={(e) => {
                      setCheckoutOnly(e.target.checked);
                      if (e.target.checked) {
                        updateAnswers({ name: `Checkout-${Date.now()}`, isNewCheckoutUser: true });
                      } else {
                        updateAnswers({ name: '', isNewCheckoutUser: false });
                      }
                    }}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-white text-lg">Ik heb de eerdere vragen niet beantwoord</span>
                </label>
              </div>
              
              {answers.name.length > 0 && !checkoutOnly && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">Jouw antwoord:</p>
                  <p className="text-white text-lg">{answers.name}</p>
                </div>
              )}
              
              {checkoutOnly && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">Alleen checkout evaluatie</p>
                  <p className="text-white text-sm opacity-80">Je hebt de eerdere vragen niet beantwoord</p>
                </div>
              )}
            </div>
          </Question>
        );
      case 'name-matching':
        return (
          <NameMatching
            enteredName={answers.name}
            existingNames={similarNames}
            onNameMatch={(matchedName) => {
              updateAnswers({ name: matchedName });
              setCurrentSection('question-6');
            }}
            onProceedAnyway={() => {
              // Keep the entered name and mark as new checkout user
              updateAnswers({ isNewCheckoutUser: true });
              setCurrentSection('question-6');
            }}
          />
        );

      case 'question-6':
        return (
          <Question
            questionNumber={6}
            question={`Hoe voel je je nu over het onderwerp ${answers.mostImportantTopic}?`}
            bgGradient={topicData?.hexColor ? '' : 'from-pink-500 to-red-500'}
            buttonColor={topicData?.hexColor ? '' : 'bg-pink-600 hover:bg-pink-700'}
            style={topicData?.hexColor ? { background: getTopicGradient(topicData.hexColor) } : {}}
            onNext={() => setCurrentSection('question-7')}
            showPrevious={false}
            isValid={answers.feelingAfter !== null}
          >
            <div className="space-y-6">
              {topicData && (
                <div className="mb-6 p-8 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <div className="text-9xl mb-4 text-center">{topicData.icon}</div>
                  <div className="text-2xl font-semibold text-white mb-2 text-center">{answers.mostImportantTopic}</div>
                  <div className="text-base text-white opacity-90 max-w-lg mx-auto text-center">
                    {topicData.description}
                  </div>
                </div>
              )}
              
              <LikertScale
                options={LIKERT_SCALE}
                value={answers.feelingAfter}
                onValueChange={(value) => updateAnswers({ feelingAfter: value })}
              />
              {answers.feelingAfter !== null && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">Jouw antwoord:</p>
                  <p className="text-white text-lg">{LIKERT_SCALE.find(opt => opt.value === answers.feelingAfter)?.label}</p>
                </div>
              )}
            </div>
          </Question>
        );

      case 'question-7':
        return (
          <Question
            questionNumber={7}
            question={`Wat zou je doen voor ${answers.mostImportantTopic} in de toekomst?`}
            bgGradient={topicData?.hexColor ? '' : 'from-cyan-500 to-blue-500'}
            buttonColor={topicData?.hexColor ? '' : 'bg-cyan-600 hover:bg-cyan-700'}
            style={topicData?.hexColor ? { background: getTopicGradient(topicData.hexColor) } : {}}
            onNext={() => setCurrentSection('question-8')}
            onPrevious={() => setCurrentSection('question-6')}
            showPrevious={true}
            isValid={answers.actionChoice.length > 0}
          >
            <div className="space-y-6">
              {topicData && (
                <div className="mb-6 p-8 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <div className="text-9xl mb-4 text-center">{topicData.icon}</div>
                  <div className="text-2xl font-semibold text-white mb-2 text-center">{answers.mostImportantTopic}</div>
                  <div className="text-base text-white opacity-90 max-w-lg mx-auto text-center">
                    {topicData.description}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {ACTION_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center space-x-4 cursor-pointer p-4 bg-white bg-opacity-10 rounded-xl hover:bg-opacity-20 transition-all">
                    <input
                      type="radio"
                      name="action-choice"
                      value={option.value}
                      checked={answers.actionChoice === option.value}
                      onChange={() => updateAnswers({ actionChoice: option.value })}
                      className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{option.icon}</span>
                      <span className="text-white text-lg font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {answers.actionChoice && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">Jouw antwoord:</p>
                  <p className="text-white text-lg">
                    {ACTION_OPTIONS.find(opt => opt.value === answers.actionChoice)?.label}
                  </p>
                </div>
              )}
            </div>
          </Question>
        );

      case 'question-8':
        return (
          <Question
            questionNumber={8}
            question={`Hoeveel vertrouwen heb je dat je iets kan veranderen aan ${answers.mostImportantTopic} in de toekomst?`}
            bgGradient={topicData?.hexColor ? '' : 'from-green-500 to-emerald-600'}
            buttonColor={topicData?.hexColor ? '' : 'bg-green-600 hover:bg-green-700'}
            style={topicData?.hexColor ? { background: getTopicGradient(topicData.hexColor) } : {}}
            onComplete={() => {
              completeSurvey();
              setCurrentSection('results');
            }}
            onPrevious={() => setCurrentSection('question-7')}
            showPrevious={true}
            showComplete={true}
            isValid={answers.confidenceAfter !== null}
          >
            <div className="space-y-6">
              {topicData && (
                <div className="mb-6 p-8 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <div className="text-9xl mb-4 text-center">{topicData.icon}</div>
                  <div className="text-2xl font-semibold text-white mb-2 text-center">{answers.mostImportantTopic}</div>
                  <div className="text-base text-white opacity-90 max-w-lg mx-auto text-center">
                    {topicData.description}
                  </div>
                </div>
              )}
              
              <LikertScale
                options={CONFIDENCE_SCALE}
                value={answers.confidenceAfter}
                onValueChange={(value) => updateAnswers({ confidenceAfter: value })}
              />
              {answers.confidenceAfter !== null && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">Jouw antwoord:</p>
                  <p className="text-white text-lg">{CONFIDENCE_SCALE.find(opt => opt.value === answers.confidenceAfter)?.label}</p>
                </div>
              )}
            </div>
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
