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

  // Create proper CSV with UTF-8 BOM for Numbers compatibility
  const csvWithBOM = '\uFEFF' + csvContent.replace(/,/g, ';');
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8' });
  const downloadFilename = filename || `tentoonstelling_evaluatie_${new Date().toISOString().split('T')[0]}.csv`;
  
  // Check if we're on iOS/iPad for special handling
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isIOS || isSafari) {
    // iOS/Safari specific download handling
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    // Use proper click event for iOS
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    link.dispatchEvent(clickEvent);
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } else if (link.download !== undefined) {
    // Standard browser download
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', downloadFilename);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}
