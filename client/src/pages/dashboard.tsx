import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Users, Calendar, ArrowLeft } from 'lucide-react';
import { SurveyResponse } from '../../../shared/schema';

// Topic mapping for display
const TOPIC_NAMES: { [key: string]: string } = {
  'WONEN': 'Wonen',
  'KLIMAAT': 'Klimaat',
  'GEZONDHEID': 'Gezondheid',
  'RIJKDOM': 'Rijkdom',
  'VREDE': 'Vrede',
  'VRIJE TIJD': 'Vrije tijd'
};

// CSV Export function
const exportToCSV = (data: any[], filename: string) => {
  const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Dashboard() {
  const { data: responses = [], isLoading } = useQuery<SurveyResponse[]>({
    queryKey: ['/api/survey-responses'],
    select: (data) => data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });

  const completeResponses = responses.filter(r => r.result);

  const handleExportAll = () => {
    if (responses.length === 0) return;

    const csvData = responses.map(response => ({
      naam: response.name,
      leeftijd: response.age,
      bezoek_met: response.visitingWith,
      belangrijkste_onderwerp: TOPIC_NAMES[response.mostImportantTopic] || response.mostImportantTopic,
      gevoel_voor: response.feelingBefore,
      vertrouwen_voor: response.confidenceBefore,
      gevoel_na: response.feelingAfter || '',
      actie_keuze: response.actionChoice || '',
      vertrouwen_na: response.confidenceAfter || '',
      resultaat: response.result || '',
      datum: new Date(response.createdAt).toLocaleDateString('nl-NL')
    }));

    exportToCSV(csvData, `survey_responses_${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard wordt geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Survey Dashboard
            </h1>
            <p className="text-gray-600">
              Overzicht van alle survey responses en statistieken
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Survey
            </a>
            <Button onClick={handleExportAll} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV ({responses.length})
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.length}</div>
            <p className="text-xs text-muted-foreground">
              {completeResponses.length} compleet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vandaag</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responses.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              nieuwe responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Populairste Onderwerp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {(() => {
                const topicCount = responses.reduce((acc, r) => {
                  const topic = TOPIC_NAMES[r.mostImportantTopic] || r.mostImportantTopic;
                  acc[topic] = (acc[topic] || 0) + 1;
                  return acc;
                }, {} as { [key: string]: number });
                
                const mostPopular = Object.entries(topicCount).reduce((max, [topic, count]) => 
                  count > (max.count || 0) ? { topic, count } : max, { topic: '-', count: 0 });
                
                return mostPopular.topic;
              })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gemiddeld Gevoel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completeResponses.length > 0 
                ? (completeResponses.reduce((sum, r) => sum + r.feelingBefore, 0) / completeResponses.length).toFixed(1)
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              van 10 punten
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Response Cards */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recente Responses ({responses.length})</h2>
        <div className="grid gap-4">
          {responses.slice(0, 20).map((response) => (
            <Card key={response.id} className={response.result ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={response.result ? 'default' : 'secondary'}>
                        {response.result ? 'Compleet' : 'Incompleet'}
                      </Badge>
                      <span className="font-medium">{response.name}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{response.age} jaar</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Onderwerp: <strong>{TOPIC_NAMES[response.mostImportantTopic] || response.mostImportantTopic}</strong>
                      {response.result && (
                        <>
                          <span className="mx-2">•</span>
                          Resultaat: <strong>{response.result}</strong>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(response.createdAt).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {responses.length > 20 && (
          <div className="text-center mt-4">
            <p className="text-gray-500">
              Toont de laatste 20 van {responses.length} responses. 
              Gebruik de export functie voor alle data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}