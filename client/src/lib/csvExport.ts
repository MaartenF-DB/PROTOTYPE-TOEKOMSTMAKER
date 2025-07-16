import { SurveyAnswers } from '@/types/survey';

export function exportToCSV(answers: SurveyAnswers, filename?: string) {
  const headers = [
    'Naam',
    'Leeftijd',
    'Met wie',
    'Belangrijkste onderwerp',
    'Gevoel voor (onderwerp)',
    'Vertrouwen voor (onderwerp)',
    'Gevoel na (onderwerp)',
    'Actie voor (onderwerp)',
    'Vertrouwen na (onderwerp)',
    'Uitkomst'
  ];

  const csvData = [
    answers.name,
    answers.age,
    answers.visitingWith === 'other' ? answers.visitingWithOther || '' : answers.visitingWith,
    answers.mostImportantTopic,
    answers.feelingBefore?.toString() || '',
    answers.confidenceBefore?.toString() || '',
    answers.feelingAfter?.toString() || '',
    answers.actionChoice,
    answers.confidenceAfter?.toString() || '',
    answers.result
  ];

  const csvContent = headers.join(',') + '\n' + csvData.map(field => 
    field.includes(',') ? `"${field}"` : field
  ).join(',');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `tentoonstelling_evaluatie_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
