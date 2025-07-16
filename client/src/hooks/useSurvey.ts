import { useState, useCallback } from 'react';
import { SurveyAnswers, SurveyState, TOPICS } from '@/types/survey';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const initialAnswers: SurveyAnswers = {
  name: '',
  age: '',
  visitingWith: '',
  visitingWithOther: '',
  topicRanking: ['VREDE', 'GEZONDHEID', 'RIJKDOM', 'VRIJE TIJD', 'KLIMAAT', 'WONEN'],
  mostImportantTopic: '',
  feelingBefore: null,
  confidenceBefore: null,
  feelingAfter: null,
  actionChoice: '',
  confidenceAfter: null,
  result: '',
  isNewCheckoutUser: false
};

export function useSurvey() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SurveyState>({
    currentSection: 'entry-choice',
    currentQuestion: 0,
    answers: initialAnswers,
    isComplete: false
  });
  
  const [nameVerification, setNameVerification] = useState('');

  const saveResponseMutation = useMutation({
    mutationFn: async (answers: SurveyAnswers) => {
      const response = await apiRequest('POST', '/api/survey-responses', {
        name: answers.name,
        age: answers.age,
        visitingWith: answers.visitingWith,
        visitingWithOther: answers.visitingWithOther,
        topicRanking: answers.topicRanking,
        mostImportantTopic: answers.mostImportantTopic,
        feelingBefore: answers.feelingBefore || 0,
        confidenceBefore: answers.confidenceBefore || 0,
        feelingAfter: answers.feelingAfter || 0,
        actionChoice: answers.actionChoice,
        confidenceAfter: answers.confidenceAfter || 0,
        result: answers.result,
        isNewCheckoutUser: answers.isNewCheckoutUser || false
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/survey-responses'] });
    }
  });

  const updateAnswers = useCallback((updates: Partial<SurveyAnswers>) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, ...updates }
    }));
  }, []);

  const setCurrentSection = useCallback((section: string) => {
    setState(prev => ({ ...prev, currentSection: section }));
  }, []);

  const setCurrentQuestion = useCallback((question: number) => {
    setState(prev => ({ ...prev, currentQuestion: question }));
  }, []);

  const generateResult = useCallback(() => {
    const { mostImportantTopic, actionChoice } = state.answers;
    
    const actionTypeMap = {
      'uitvinden': 'UITVINDER',
      'actie': 'ACTIEVOERDER',
      'veranderen': 'VERANDERAAR'
    };

    const resultType = actionTypeMap[actionChoice as keyof typeof actionTypeMap] || 'TOEKOMSTMAKER';
    const result = `Jij bent een ${resultType} voor ${mostImportantTopic}`;
    
    updateAnswers({ result });
    return result;
  }, [state.answers, updateAnswers]);

  const completeSurvey = useCallback(() => {
    const result = generateResult();
    setState(prev => ({ ...prev, isComplete: true }));
    saveResponseMutation.mutate({ ...state.answers, result });
  }, [generateResult, saveResponseMutation, state.answers]);

  const resetSurvey = useCallback(() => {
    setState({
      currentSection: 'entry-choice',
      currentQuestion: 0,
      answers: initialAnswers,
      isComplete: false
    });
    setNameVerification('');
  }, []);

  const getTopicColor = useCallback((topic: string) => {
    return TOPICS[topic as keyof typeof TOPICS]?.color || 'bg-gray-500';
  }, []);

  const getTopicIcon = useCallback((topic: string) => {
    return TOPICS[topic as keyof typeof TOPICS]?.icon || '❓';
  }, []);

  const getCurrentProgress = useCallback(() => {
    const sectionProgress = {
      'entry-choice': 0,
      'checkin-intro': 5,
      'question-0': 10,
      'question-1': 18,
      'question-2': 26,
      'question-3': 34,
      'question-4': 42,
      'question-5': 50,
      'checkin-closing': 58,
      'name-verification': 66,
      'checkout-intro': 74,
      'checkout-name': 76,
      'question-6': 82,
      'question-7': 90,
      'question-8': 98,
      'results': 100
    };
    return sectionProgress[state.currentSection as keyof typeof sectionProgress] || 0;
  }, [state.currentSection]);

  return {
    state,
    updateAnswers,
    setCurrentSection,
    setCurrentQuestion,
    generateResult,
    completeSurvey,
    resetSurvey,
    getTopicColor,
    getTopicIcon,
    getCurrentProgress,
    saveResponseMutation,
    nameVerification,
    setNameVerification
  };
}
