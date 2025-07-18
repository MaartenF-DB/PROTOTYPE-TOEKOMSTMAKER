import { useSurvey } from '@/hooks/useSurvey';
import { EntryChoice } from '@/components/survey/EntryChoice';
import { CheckInIntro } from '@/components/survey/CheckInIntro';
import { Question } from '@/components/survey/Question';
import { CheckInClosing } from '@/components/survey/CheckInClosing';
import { CheckOutIntro } from '@/components/survey/CheckOutIntro';
import { Results } from '@/components/survey/Results';
import { MultipleChoice } from '@/components/survey/MultipleChoice';
import { RankingQuestion } from '@/components/survey/RankingQuestionNew';
import { LikertScale } from '@/components/survey/LikertScale';
import { NameVerification } from '@/components/survey/NameVerification';
import { NameMatching } from '@/components/survey/NameMatching';
import { CheckoutNameInput } from '@/components/survey/CheckoutNameInput';
import { Input } from '@/components/ui/input';
import { 
  VISITING_OPTIONS, 
  ACTION_OPTIONS, 
  LIKERT_SCALE, 
  CONFIDENCE_SCALE, 
  TOPICS,
  VISITING_OPTIONS_EN,
  ACTION_OPTIONS_EN,
  LIKERT_SCALE_EN,
  CONFIDENCE_SCALE_EN
} from '@/types/survey';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { translations, Language } from '@/lib/translations';

export default function Home() {
  const {
    state,
    updateAnswers,
    setCurrentSection,
    setCurrentQuestion,
    completeSurvey,
    saveCheckInData,
    resetSurvey,
    getCurrentProgress,
    nameVerification,
    setNameVerification
  } = useSurvey();

  const { currentSection, answers } = state;
  const [checkoutOnly, setCheckoutOnly] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem('survey-language');
    return (savedLanguage as Language) || 'nl';
  });
  const t = translations[language];

  // Save language preference to localStorage whenever it changes
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('survey-language', newLanguage);
  };

  // Helper functions to get language-specific options
  const getVisitingOptions = () => language === 'en' ? VISITING_OPTIONS_EN : VISITING_OPTIONS;
  const getActionOptions = () => language === 'en' ? ACTION_OPTIONS_EN : ACTION_OPTIONS;
  const getLikertScale = () => language === 'en' ? LIKERT_SCALE_EN : LIKERT_SCALE;
  const getConfidenceScale = () => language === 'en' ? CONFIDENCE_SCALE_EN : CONFIDENCE_SCALE;

  const progressPercentage = getCurrentProgress();
  
  // Query to check for existing names
  const { data: existingResponses = [], isLoading: isLoadingResponses } = useQuery({
    queryKey: ['/api/survey-responses'],
    enabled: true
  });

  console.log('🔍 EXISTING RESPONSES QUERY:', { existingResponses, isLoadingResponses });
  
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
              setCurrentSection('checkout-name');
            }}
            language={language}
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
            language={language}
          />
        );

      case 'question-0':
        return (
          <Question
            questionNumber={0}
            question={t.questions.name}
            bgGradient="from-blue-500 to-teal-500"
            buttonColor="bg-blue-600 hover:bg-blue-700"
            onNext={() => setCurrentSection('question-1')}
            showPrevious={false}
            showNext={true}
            isValid={answers.name.length > 0}
            language={language}
          >
            <div className="space-y-4">
              <Input
                value={answers.name}
                onChange={(e) => updateAnswers({ name: e.target.value })}
                placeholder={t.placeholders.typeName}
                className="w-full p-4 text-2xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
              />
              {hasNameConflict && (
                <p className="text-sm text-white opacity-80">
                  {t.validation.nameConflict}
                </p>
              )}
              {answers.name.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
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
            question={t.questions.age}
            bgGradient="from-green-500 to-blue-500"
            buttonColor="bg-green-600 hover:bg-green-700"
            onNext={() => setCurrentSection('question-2')}
            onPrevious={() => setCurrentSection('question-0')}
            showPrevious={true}
            showNext={true}
            isValid={answers.age.length > 0}
            language={language}
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
                  { value: 'other', label: language === 'en' ? 'Other...' : 'Anders...' }
                ]}
                value={answers.age}
                onValueChange={(value) => updateAnswers({ age: value })}
                otherValue={answers.age === 'other' ? answers.age : ''}
                onOtherValueChange={(value) => updateAnswers({ age: value })}
                columns={8}
                language={language}
              />
              {answers.age.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
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
            question={t.questions.visitingWith}
            bgGradient="from-purple-500 to-pink-500"
            buttonColor="bg-purple-600 hover:bg-purple-700"
            onNext={() => setCurrentSection('question-3')}
            onPrevious={() => setCurrentSection('question-1')}
            showPrevious={true}
            showNext={true}
            isValid={answers.visitingWith.length > 0}
            language={language}
          >
            <div className="space-y-4">
              <MultipleChoice
                options={getVisitingOptions()}
                value={answers.visitingWith}
                onValueChange={(value) => updateAnswers({ visitingWith: value })}
                otherValue={answers.visitingWithOther}
                onOtherValueChange={(value) => updateAnswers({ visitingWithOther: value })}
                columns={5}
                language={language}
              />
              {answers.visitingWith.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
                  <p className="text-white text-lg">
                    {answers.visitingWith === 'other' ? answers.visitingWithOther : 
                     getVisitingOptions().find(opt => opt.value === answers.visitingWith)?.label}
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
            question={t.questions.topicRanking}
            bgGradient="from-yellow-500 to-orange-500"
            buttonColor="bg-orange-600 hover:bg-orange-700"
            onNext={() => {
              const mostImportant = answers.topicRanking[answers.topicRanking.length - 1];
              updateAnswers({ mostImportantTopic: mostImportant });
              if (checkoutOnly) {
                // For checkout-only users, go to question 6 after topic selection
                setCurrentSection('question-6');
              } else {
                // For regular check-in users, continue to question 4
                setCurrentSection('question-4');
              }
            }}
            onPrevious={() => {
              if (checkoutOnly) {
                // For checkout-only users, go back to name input
                setCurrentSection('checkout-name');
              } else {
                // For regular check-in users, go to question 2
                setCurrentSection('question-2');
              }
            }}
            showPrevious={true}
            showNext={true}
            isValid={answers.topicRanking.length === 6}
            language={language}
          >
            <div className="space-y-4">
              <RankingQuestion
                ranking={answers.topicRanking}
                onRankingChange={(ranking) => updateAnswers({ topicRanking: ranking })}
                language={language}
              />
            </div>
          </Question>
        );

      case 'question-4':
        return (
          <Question
            questionNumber={4}
            question={`${t.questions.feelingBefore.replace('{topic}', answers.mostImportantTopic)}`}
            bgGradient={topicData?.hexColor ? '' : 'from-red-500 to-pink-500'}
            buttonColor={topicData?.hexColor ? '' : 'bg-red-600 hover:bg-red-700'}
            style={topicData?.hexColor ? { background: getTopicGradient(topicData.hexColor) } : {}}
            onNext={() => setCurrentSection('question-5')}
            onPrevious={() => setCurrentSection('question-3')}
            showPrevious={true}
            showNext={true}
            isValid={answers.feelingBefore !== null}
            language={language}
          >
            <div className="space-y-6">
              {topicData && (
                <div className="mb-6 p-8 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <div className="text-9xl mb-4 text-center">{topicData.icon}</div>
                  <div className="text-2xl font-semibold text-white mb-2 text-center">{language === 'en' ? topicData.nameEn : answers.mostImportantTopic}</div>
                  <div className="text-base text-white opacity-90 max-w-lg mx-auto text-center">
                    {language === 'en' ? topicData.descriptionEn : topicData.description}
                  </div>
                </div>
              )}
              
              <LikertScale
                options={getLikertScale()}
                value={answers.feelingBefore}
                onValueChange={(value) => updateAnswers({ feelingBefore: value })}
                language={language}
              />
              {answers.feelingBefore !== null && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
                  <p className="text-white text-lg">{getLikertScale().find(opt => opt.value === answers.feelingBefore)?.label}</p>
                </div>
              )}
            </div>
          </Question>
        );

      case 'question-5':
        return (
          <Question
            questionNumber={5}
            question={`${t.questions.confidenceBefore.replace('{topic}', answers.mostImportantTopic)}`}
            bgGradient={topicData?.hexColor ? '' : 'from-blue-500 to-purple-600'}
            buttonColor={topicData?.hexColor ? '' : 'bg-blue-600 hover:bg-blue-700'}
            style={topicData?.hexColor ? { background: getTopicGradient(topicData.hexColor) } : {}}
            onComplete={() => {
              // Save check-in data immediately when question-5 is completed
              console.log('✅ CHECK-IN COMPLETED - SAVING DATA TO DATABASE');
              saveCheckInData();
              setCurrentSection('checkin-closing');
            }}
            onPrevious={() => setCurrentSection('question-4')}
            showPrevious={true}
            showComplete={true}
            isValid={answers.confidenceBefore !== null}
            language={language}
          >
            <div className="space-y-6">
              {topicData && (
                <div className="mb-6 p-8 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <div className="text-9xl mb-4 text-center">{topicData.icon}</div>
                  <div className="text-2xl font-semibold text-white mb-2 text-center">{language === 'en' ? topicData.nameEn : answers.mostImportantTopic}</div>
                  <div className="text-base text-white opacity-90 max-w-lg mx-auto text-center">
                    {language === 'en' ? topicData.descriptionEn : topicData.description}
                  </div>
                </div>
              )}
              
              <LikertScale
                options={getConfidenceScale()}
                value={answers.confidenceBefore}
                onValueChange={(value) => updateAnswers({ confidenceBefore: value })}
                language={language}
              />
              {answers.confidenceBefore !== null && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
                  <p className="text-white text-lg">{getConfidenceScale().find(opt => opt.value === answers.confidenceBefore)?.label}</p>
                </div>
              )}
            </div>
          </Question>
        );

      case 'checkin-closing':
        return (
          <CheckInClosing 
            onComplete={() => {
              console.log('✅ CHECK-IN CLOSING - RETURNING TO ENTRY CHOICE');
              setCheckoutOnly(false);
              setCurrentSection('entry-choice');
            }}
          />
        );

      case 'checkout-intro':
        // Skip checkout intro, go directly to name input
        updateAnswers({ name: '' });
        setCurrentSection('checkout-name');
        return null;
      case 'checkout-name':
        return (
          <CheckoutNameInput
            existingResponses={existingResponses}
            onNameConfirm={(name, isNewUser) => {
              console.log('🔍 NAME CONFIRMATION:', { name, isNewUser });
              updateAnswers({ name, isNewCheckoutUser: isNewUser });
              
              // ALWAYS check if this name exists in our database (case-insensitive)
              // Look for users who have check-in data (age, visitingWith, mostImportantTopic)
              const existingResponse = existingResponses.find((r: any) => 
                r.name.toLowerCase() === name.toLowerCase() && 
                r.age && r.visitingWith && r.mostImportantTopic && // Has check-in data
                r.feelingAfter === null // But hasn't completed checkout yet
              );
              
              console.log('🔍 SEARCHING FOR EXISTING USER:', { 
                searchName: name.toLowerCase(),
                existingResponse,
                allResponses: existingResponses.map(r => ({ 
                  name: r.name, 
                  hasCheckIn: !!(r.age && r.visitingWith && r.mostImportantTopic),
                  hasCheckOut: r.feelingAfter !== null 
                }))
              });
              
              if (existingResponse) {
                // EXISTING USER WITH CHECK-IN DATA - Skip ALL preliminary questions
                console.log('✅ EXISTING USER FOUND - SKIPPING ALL PRELIMINARY QUESTIONS');
                console.log('🚀 LOADING EXISTING USER DATA:', {
                  name: existingResponse.name,
                  age: existingResponse.age,
                  visitingWith: existingResponse.visitingWith,
                  mostImportantTopic: existingResponse.mostImportantTopic
                });
                
                updateAnswers({ 
                  mostImportantTopic: existingResponse.mostImportantTopic,
                  topicRanking: existingResponse.topicRanking || [],
                  age: existingResponse.age,
                  visitingWith: existingResponse.visitingWith,
                  visitingWithOther: existingResponse.visitingWithOther || '',
                  feelingBefore: existingResponse.feelingBefore || null,
                  confidenceBefore: existingResponse.confidenceBefore || null
                });
                
                console.log('🚀 JUMPING DIRECTLY TO QUESTION-6 (FEELING AFTER)');
                setCheckoutOnly(false); // They are returning users
                setCurrentSection('question-6');
              } else {
                // NEW USER - Must answer all preliminary questions first
                console.log('📝 NEW USER - GOING TO PRELIMINARY QUESTIONS');
                setCheckoutOnly(true);
                setCurrentSection('checkout-age');
              }
            }}
            language={language}
          />
        );
      
      case 'checkout-age':
        return (
          <Question
            questionNumber={1}
            question={t.questions.age}
            bgGradient="from-green-500 to-blue-500"
            buttonColor="bg-green-600 hover:bg-green-700"
            onNext={() => setCurrentSection('checkout-visiting')}
            showNext={true}
            isValid={answers.age.length > 0}
            language={language}
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
                  { value: 'other', label: language === 'en' ? 'Other...' : 'Anders...' }
                ]}
                value={answers.age}
                onValueChange={(value) => updateAnswers({ age: value })}
                otherValue={answers.age === 'other' ? answers.age : ''}
                onOtherValueChange={(value) => updateAnswers({ age: value })}
                columns={8}
                language={language}
              />
              {answers.age.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
                  <p className="text-white text-lg">{answers.age} {language === 'en' ? 'years old' : 'jaar oud'}</p>
                </div>
              )}
            </div>
          </Question>
        );
      
      case 'checkout-visiting':
        return (
          <Question
            questionNumber={2}
            question={t.questions.visitingWith}
            bgGradient="from-purple-500 to-pink-500"
            buttonColor="bg-purple-600 hover:bg-purple-700"
            onNext={() => setCurrentSection('question-3')}
            onPrevious={() => setCurrentSection('checkout-age')}
            showPrevious={true}
            showNext={true}
            isValid={answers.visitingWith.length > 0}
            language={language}
          >
            <div className="space-y-4">
              <MultipleChoice
                options={getVisitingOptions()}
                value={answers.visitingWith}
                onValueChange={(value) => updateAnswers({ visitingWith: value })}
                otherValue={answers.visitingWithOther}
                onOtherValueChange={(value) => updateAnswers({ visitingWithOther: value })}
                columns={5}
                language={language}
              />
              {answers.visitingWith.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
                  <p className="text-white text-lg">
                    {answers.visitingWith === 'other' ? answers.visitingWithOther : 
                     getVisitingOptions().find(opt => opt.value === answers.visitingWith)?.label}
                  </p>
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
            question={`${t.checkOutQuestions.feeling} ${language === 'en' ? topicData.nameEn : answers.mostImportantTopic} ${t.checkOutQuestions.future}?`}
            bgGradient={topicData?.hexColor ? '' : 'from-pink-500 to-red-500'}
            buttonColor={topicData?.hexColor ? '' : 'bg-pink-600 hover:bg-pink-700'}
            style={topicData?.hexColor ? { background: getTopicGradient(topicData.hexColor) } : {}}
            onNext={() => setCurrentSection('question-7')}
            onPrevious={() => {
              if (checkoutOnly) {
                // For checkout-only users, go back to topic selection
                setCurrentSection('question-3');
              } else {
                // For existing users who skipped ALL preliminary questions, go back to checkout name
                setCurrentSection('checkout-name');
              }
            }}
            showPrevious={true}
            showNext={true}
            isValid={answers.feelingAfter !== null}
            language={language}
          >
            <div className="space-y-6">
              {topicData && (
                <div className="mb-6 p-8 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <div className="text-9xl mb-4 text-center">{topicData.icon}</div>
                  <div className="text-2xl font-semibold text-white mb-2 text-center">{language === 'en' ? topicData.nameEn : answers.mostImportantTopic}</div>
                  <div className="text-base text-white opacity-90 max-w-lg mx-auto text-center">
                    {language === 'en' ? topicData.descriptionEn : topicData.description}
                  </div>
                </div>
              )}
              
              {answers.age && (
                <div className="mb-4 p-4 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <p className="text-white text-center">
                    {t.checkOutQuestions.futureContext.replace('{age}', String(parseInt(answers.age) + 10))}
                  </p>
                </div>
              )}
              
              <LikertScale
                options={getLikertScale()}
                value={answers.feelingAfter}
                onValueChange={(value) => updateAnswers({ feelingAfter: value })}
                language={language}
              />
              
              {/* Show read-only notice for existing users */}
              {!checkoutOnly && answers.feelingBefore !== null && (
                <div className="mt-4 p-3 bg-blue-100 rounded-lg text-blue-800 text-sm">
                  Je hebt al eerder de check-in ingevuld. Je antwoorden worden gebruikt voor vergelijking.
                </div>
              )}
              {answers.feelingAfter !== null && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
                  <p className="text-white text-lg">{getLikertScale().find(opt => opt.value === answers.feelingAfter)?.label}</p>
                </div>
              )}
            </div>
          </Question>
        );

      case 'question-7':
        return (
          <Question
            questionNumber={7}
            question={`${t.checkOutQuestions.action} ${language === 'en' ? topicData.nameEn : answers.mostImportantTopic} ${t.checkOutQuestions.future}?`}
            bgGradient={topicData?.hexColor ? '' : 'from-cyan-500 to-blue-500'}
            buttonColor={topicData?.hexColor ? '' : 'bg-cyan-600 hover:bg-cyan-700'}
            style={topicData?.hexColor ? { background: getTopicGradient(topicData.hexColor) } : {}}
            onNext={() => setCurrentSection('question-8')}
            onPrevious={() => {
              if (checkoutOnly) {
                // For checkout-only users, go back to topic selection
                setCurrentSection('question-3');
              } else {
                // For regular users, go to question 6
                setCurrentSection('question-6');
              }
            }}
            showPrevious={true}
            showNext={true}
            isValid={answers.actionChoice.length > 0}
            language={language}
          >
            <div className="space-y-6">
              {topicData && (
                <div className="mb-6 p-8 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <div className="text-9xl mb-4 text-center">{topicData.icon}</div>
                  <div className="text-2xl font-semibold text-white mb-2 text-center">{language === 'en' ? topicData.nameEn : answers.mostImportantTopic}</div>
                  <div className="text-base text-white opacity-90 max-w-lg mx-auto text-center">
                    {language === 'en' ? topicData.descriptionEn : topicData.description}
                  </div>
                </div>
              )}
              
              <MultipleChoice
                options={getActionOptions()}
                value={answers.actionChoice}
                onValueChange={(value) => updateAnswers({ actionChoice: value })}
                columns={3}
                language={language}
              />
              
              {answers.actionChoice && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getActionOptions().find(opt => opt.value === answers.actionChoice)?.icon}</span>
                    <span className="text-white text-lg">{getActionOptions().find(opt => opt.value === answers.actionChoice)?.label}</span>
                  </div>
                </div>
              )}
            </div>
          </Question>
        );

      case 'question-8':
        return (
          <Question
            questionNumber={8}
            question={`${t.checkOutQuestions.confidence} ${language === 'en' ? topicData.nameEn : answers.mostImportantTopic} ${t.checkOutQuestions.future}?`}
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
            language={language}
          >
            <div className="space-y-6">
              {topicData && (
                <div className="mb-6 p-8 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                  <div className="text-9xl mb-4 text-center">{topicData.icon}</div>
                  <div className="text-2xl font-semibold text-white mb-2 text-center">{language === 'en' ? topicData.nameEn : answers.mostImportantTopic}</div>
                  <div className="text-base text-white opacity-90 max-w-lg mx-auto text-center">
                    {language === 'en' ? topicData.descriptionEn : topicData.description}
                  </div>
                </div>
              )}
              
              <LikertScale
                options={getConfidenceScale()}
                value={answers.confidenceAfter}
                onValueChange={(value) => updateAnswers({ confidenceAfter: value })}
                language={language}
              />
              {answers.confidenceAfter !== null && (
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white font-semibold">{t.yourAnswer}:</p>
                  <p className="text-white text-lg">{getConfidenceScale().find(opt => opt.value === answers.confidenceAfter)?.label}</p>
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
            language={language}
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
      
      <LanguageSelector 
        currentLanguage={language} 
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}
