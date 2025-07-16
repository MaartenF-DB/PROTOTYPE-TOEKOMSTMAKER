export interface SurveyAnswers {
  name: string;
  age: string;
  visitingWith: string;
  visitingWithOther?: string;
  topicRanking: string[];
  mostImportantTopic: string;
  feelingBefore: number | null;
  confidenceBefore: number | null;
  feelingAfter: number | null;
  actionChoice: string;
  confidenceAfter: number | null;
  result: string;
}

export interface SurveyState {
  currentSection: string;
  currentQuestion: number;
  answers: SurveyAnswers;
  isComplete: boolean;
}

export const TOPICS = {
  VREDE: { name: 'VREDE', color: 'bg-emerald-500', icon: '🕊️' },
  GEZONDHEID: { name: 'GEZONDHEID', color: 'bg-amber-500', icon: '💗' },
  RIJKDOM: { name: 'RIJKDOM', color: 'bg-purple-500', icon: '💰' },
  'VRIJE TIJD': { name: 'VRIJE TIJD', color: 'bg-red-500', icon: '🎮' },
  KLIMAAT: { name: 'KLIMAAT', color: 'bg-cyan-500', icon: '🌱' },
  WONEN: { name: 'WONEN', color: 'bg-orange-500', icon: '🏠' }
} as const;

export type TopicKey = keyof typeof TOPICS;

export const VISITING_OPTIONS = [
  { value: 'alone', label: 'Alleen', icon: '👤' },
  { value: 'family', label: 'Met mijn familie', icon: '👨‍👩‍👧‍👦' },
  { value: 'school', label: 'Met school', icon: '🏫' },
  { value: 'babysitter', label: 'Met mijn oppas', icon: '👤' },
  { value: 'other', label: 'Anders...', icon: '❓' }
] as const;

export const ACTION_OPTIONS = [
  { value: 'uitvinden', label: 'Ik ga iets uitvinden', icon: '🔬' },
  { value: 'actie', label: 'Ik ga in actie komen', icon: '📢' },
  { value: 'veranderen', label: 'Ik ga zelf iets veranderen', icon: '🌟' }
] as const;

export const LIKERT_SCALE = [
  { value: 1, label: 'Ik maak me zorgen', emoji: '😟' },
  { value: 2, label: 'Ik vind het oké', emoji: '😐' },
  { value: 3, label: 'Ik voel me neutraal', emoji: '🙂' },
  { value: 4, label: 'Ik voel me positief', emoji: '😊' },
  { value: 5, label: 'Ik heb er zin in!', emoji: '🤩' }
] as const;

export const CONFIDENCE_SCALE = [
  { value: 1, label: 'Ik heb een ienie mini beetje vertrouwen', emoji: '🤏' },
  { value: 2, label: 'Ik heb een beetje vertrouwen', emoji: '🤔' },
  { value: 3, label: 'Ik heb gewoon vertrouwen', emoji: '😐' },
  { value: 4, label: 'Ik heb veel vertrouwen', emoji: '💪' },
  { value: 5, label: 'Ik heb héééél veel vertrouwen!', emoji: '🚀' }
] as const;
