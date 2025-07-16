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
  result: ''
};

export function useSurvey() {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SurveyState>({
    currentSection: 'checkin-intro',
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
        result: answers.result
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
      currentSection: 'checkin-intro',
      currentQuestion: 0,
      answers: initialAnswers,
      isComplete: false
    });
  }, []);

  const getTopicColor = useCallback((topic: string) => {
    return TOPICS[topic as keyof typeof TOPICS]?.color || 'bg-gray-500';
  }, []);

  const getTopicIcon = useCallback((topic: string) => {
    return TOPICS[topic as keyof typeof TOPICS]?.icon || '❓';
  }, []);

  const getCurrentProgress = useCallback(() => {
    const sectionProgress = {
      'checkin-intro': 0,
      'question-0': 8,
      'question-1': 16,
      'question-2': 24,
      'question-3': 32,
      'question-4': 40,
      'question-5': 48,
      'checkin-closing': 56,
      'name-verification': 64,
      'checkout-intro': 72,
      'question-6': 80,
      'question-7': 88,
      'question-8': 96,
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
