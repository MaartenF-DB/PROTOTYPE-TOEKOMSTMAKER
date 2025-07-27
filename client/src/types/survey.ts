export interface SurveyAnswers {
  name: string;
  age: string;
  visitingWith: string;
  visitingWithOther?: string;
  topicRanking: string[];
  mostImportantTopic: string;
  feelingBefore: number | null;
  confidenceBefore: number | null;
  knowledgeBefore: number | null;
  feelingAfter: number | null;
  actionChoice: string;
  confidenceAfter: number | null;
  learnedSomethingNew: number | null;
  mostInterestingLearned: string;
  result: string;
  isNewCheckoutUser?: boolean;
}

export interface SurveyState {
  currentSection: string;
  currentQuestion: number;
  answers: SurveyAnswers;
  isComplete: boolean;
}

export const TOPICS = {
  VREDE: { name: 'VREDE', color: 'bg-emerald-500', icon: '🕊️', description: 'Geen ruzie en we respecteren elkaar!', hexColor: '#999999', nameEn: 'PEACE', descriptionEn: 'No fighting and we respect each other!' },
  GEZONDHEID: { name: 'GEZONDHEID', color: 'bg-amber-500', icon: '💗', description: 'Iedereen is gezond en krijgt goede hulp.', hexColor: '#EC8FBB', nameEn: 'HEALTH', descriptionEn: 'Everyone is healthy and gets good help.' },
  RIJKDOM: { name: 'RIJKDOM', color: 'bg-purple-500', icon: '🤝', description: 'Delen is fijner dan hebben!', hexColor: '#6358A6', nameEn: 'WEALTH', descriptionEn: 'Sharing is better than having!' },
  'VRIJE TIJD': { name: 'VRIJE TIJD', color: 'bg-red-500', icon: '🎨', description: 'Minder werken, meer spelen!', hexColor: '#9E4622', nameEn: 'FREE TIME', descriptionEn: 'Less work, more play!' },
  KLIMAAT: { name: 'KLIMAAT', color: 'bg-cyan-500', icon: '🌱', description: 'We maken de aarde samen groener!', hexColor: '#70C164', nameEn: 'CLIMATE', descriptionEn: 'We make the earth greener together!' },
  WONEN: { name: 'WONEN', color: 'bg-orange-500', icon: '🏠', description: 'Iedereen woont op een goede plek!', hexColor: '#F59E0B', nameEn: 'LIVING', descriptionEn: 'Everyone lives in a good place!' }
} as const;

export type TopicKey = keyof typeof TOPICS;

export const VISITING_OPTIONS = [
  { value: 'alone', label: 'Alleen', icon: '👤' },
  { value: 'family', label: 'Met mijn familie', icon: '👨‍👩‍👧‍👦' },
  { value: 'school', label: 'Met school', icon: '🏫' },
  { value: 'babysitter', label: 'Met mijn oppas', icon: '👶👨' },
  { value: 'other', label: 'Anders...', icon: '❓' }
] as const;

export const VISITING_OPTIONS_EN = [
  { value: 'alone', label: 'Alone', icon: '👤' },
  { value: 'family', label: 'With my family', icon: '👨‍👩‍👧‍👦' },
  { value: 'school', label: 'With school', icon: '🏫' },
  { value: 'babysitter', label: 'With my babysitter', icon: '👶👨' },
  { value: 'other', label: 'Other...', icon: '❓' }
] as const;

export const ACTION_OPTIONS = [
  { value: 'uitvinden', label: 'Ik ga iets uitvinden', icon: '🔬' },
  { value: 'actie', label: 'Ik ga in actie komen', icon: '📢' },
  { value: 'veranderen', label: 'Ik ga zelf iets veranderen', icon: '🌟' }
] as const;

export const ACTION_OPTIONS_EN = [
  { value: 'uitvinden', label: 'I will invent something', icon: '🔬' },
  { value: 'actie', label: 'I will take action', icon: '📢' },
  { value: 'veranderen', label: 'I will change something myself', icon: '🌟' }
] as const;

export const LIKERT_SCALE = [
  { value: 1, label: 'Heel slecht', emoji: '😥' },
  { value: 2, label: 'Slecht', emoji: '😟' },
  { value: 3, label: 'Neutraal', emoji: '😐' },
  { value: 4, label: 'Goed', emoji: '🙂' },
  { value: 5, label: 'Heel goed', emoji: '😊' }
] as const;

export const LIKERT_SCALE_EN = [
  { value: 1, label: 'Very bad', emoji: '😥' },
  { value: 2, label: 'Bad', emoji: '😟' },
  { value: 3, label: 'Neutral', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 5, label: 'Very good', emoji: '😊' }
] as const;

export const CONFIDENCE_SCALE = [
  { value: 1, label: 'Echt niet!', emoji: '❌' },
  { value: 2, label: 'Ik denk het niet', emoji: '👎' },
  { value: 3, label: 'Misschien', emoji: '🤔' },
  { value: 4, label: 'Ik denk het wel', emoji: '👍' },
  { value: 5, label: 'Zeker weten!', emoji: '🚀' }
] as const;

export const CONFIDENCE_SCALE_EN = [
  { value: 1, label: 'Definitely not!', emoji: '❌' },
  { value: 2, label: 'I don\'t think so', emoji: '👎' },
  { value: 3, label: 'Maybe', emoji: '🤔' },
  { value: 4, label: 'I think so', emoji: '👍' },
  { value: 5, label: 'Absolutely!', emoji: '🚀' }
] as const;

export const KNOWLEDGE_SCALE = [
  { value: 1, label: 'Bijna niks.', emoji: '🤷' },
  { value: 2, label: 'Een beetje.', emoji: '🤔' },
  { value: 3, label: 'Heel veel!', emoji: '🧠' }
] as const;

export const KNOWLEDGE_SCALE_EN = [
  { value: 1, label: 'Almost nothing.', emoji: '🤷' },
  { value: 2, label: 'A little bit.', emoji: '🤔' },
  { value: 3, label: 'A lot!', emoji: '🧠' }
] as const;

export const LEARNED_SCALE = [
  { value: 1, label: 'Nee, niet echt.', emoji: '😐' },
  { value: 2, label: 'Ja, een beetje.', emoji: '💡' },
  { value: 3, label: 'Ja, heel veel!', emoji: '🤯' }
] as const;

export const LEARNED_SCALE_EN = [
  { value: 1, label: 'No, not really.', emoji: '😐' },
  { value: 2, label: 'Yes, a little bit.', emoji: '💡' },
  { value: 3, label: 'Yes, a lot!', emoji: '🤯' }
] as const;
