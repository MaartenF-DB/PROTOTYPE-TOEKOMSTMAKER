import { useQuery } from '@tanstack/react-query';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { exportToCSV } from '@/lib/csvExport';
 import { SurveyResponse } from '@shared/schema';
 import { TOPICS, ACTION_OPTIONS } from '@/types/survey';
 import { Download, Users, TrendingUp, BarChart3 } from 'lucide-react';

 export default function Dashboard() {
 const { data: responses = [], isLoading } = useQuery<SurveyResponse[]>({
 queryKey: ['/api/survey-responses'],
 select: (data) => data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
 });

 // Separate responses by type
 const completeResponses = responses.filter(r => 
 r.feelingAfter !== null && 
 r.feelingAfter !== 0 &&
 r.actionChoice && 
 r.actionChoice.trim() !== '' &&
 r.confidenceAfter !== null &&
 r.confidenceAfter !== 0
 );
 const checkInOnlyResponses = responses.filter(r => 
 r.feelingAfter === null || 
 r.feelingAfter === 0 ||
 !r.actionChoice || 
 r.actionChoice.trim() === '' ||
 r.confidenceAfter === null ||
 r.confidenceAfter === 0
 );

 const stats = {
 totalResponses: responses.length,
 completeResponses: completeResponses.length,
 checkInOnlyResponses: checkInOnlyResponses.length,
 averageAge: responses.length > 0 ? Math.round(responses.reduce((acc, r) => acc + parseInt(r.age), 0) / responses.length) : 0,
 topTopics: responses.reduce((acc, r) => {
 acc[r.mostImportantTopic] = (acc[r.mostImportantTopic] || 0) + 1;
 return acc;
 }, {} as Record<string, number>),
 topActions: completeResponses.reduce((acc, r) => {
 acc[r.actionChoice] = (acc[r.actionChoice] || 0) + 1;
 return acc;
 }, {} as Record<string, number>),
 feelingChanges: completeResponses.filter(r => r.feelingBefore !== null && r.feelingAfter !== null).map(r => ({
 topic: r.mostImportantTopic,
 before: r.feelingBefore!,
 after: r.feelingAfter!,
 change: r.feelingAfter! - r.feelingBefore!
 })),
 confidenceChanges: completeResponses.filter(r => r.confidenceBefore !== null && r.confidenceAfter !== null).map(r => ({
 topic: r.mostImportantTopic,
 before: r.confidenceBefore!,
 after: r.confidenceAfter!,
 change: r.confidenceAfter! - r.confidenceBefore!
 }))
 };

 const mostPopularTopic = Object.entries(stats.topTopics).sort(([,a], [,b]) => b - a)[0]?.[0];
 const topicData = mostPopularTopic ? TOPICS[mostPopularTopic as keyof typeof TOPICS] : null;

 const handleExportAll = () => {
 if (responses.length === 0) return;

 const csvData = responses.map(response => ({
 naam: response.name,
 leeftijd: response.age,
 bezoek_met: response.visitingWith,
 belangrijkste_onderwerp: response.mostImportantTopic,
 gevoel_voor: response.feelingBefore,
 vertrouwen_voor: response.confidenceBefore,
 gevoel_na: response.feelingAfter,
 actie_keuze: response.actionChoice,
 vertrouwen_na: response.confidenceAfter,
 resultaat: response.result,
 datum: new Date(response.createdAt).toLocaleDateString('nl-NL')
 }));

 exportToCSV({ name: 'alle_responses', ...csvData[0] }, 'alle_survey_responses.csv');
 };

 const exportAllData = () => {
 if (responses.length === 0) return;

 const csvContent = responses.map(response => ({
 Naam: response.name,
 Leeftijd: response.age,
 'Bezoekt met': response.visitingWith,
 'Andere begeleiding': response.visitingWithOther || '',
 'Onderwerp ranking': response.topicRanking.join(', '),
 'Belangrijkste onderwerp': response.mostImportantTopic,
 'Gevoel voor (1-5)': response.feelingBefore || '',
 'Vertrouwen voor (1-5)': response.confidenceBefore || '',
 'Gevoel na (1-5)': response.feelingAfter || '',
 'Actie keuze': response.actionChoice,
 'Vertrouwen na (1-5)': response.confidenceAfter || '',
 'Persoonlijkheid': response.result,
 'Datum': new Date(response.createdAt).toLocaleDateString('nl-NL'),
 'Tijd': new Date(response.createdAt).toLocaleTimeString('nl-NL')
 }));

 const csv = [
 Object.keys(csvContent[0]).join(','),
 ...csvContent.map(row => Object.values(row).map(val => `"${val}"`).join(','))
 ].join('\n');

 const blob = new Blob([csv], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `museum-responses-${new Date().toISOString().split('T')[0]}.csv`;
 a.click();
 URL.revokeObjectURL(url);
 };

 if (isLoading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gray-50 p-6">
 <div className="max-w-7xl mx-auto">
 <div className="mb-8 flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold text-gray-900 mb-2">Museum Dashboard</h1>
 <p className="text-gray-600">Overzicht van alle bezoeker antwoorden</p>
 </div>
 <a 
 href="/" 
 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
 >
 Terug naar Survey
 </a>
 </div>

 {/* Stats Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Totaal Antwoorden</CardTitle>
 <Users className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">{stats.totalResponses}</div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Complete Responses</CardTitle>
 <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">Check-in + Check-out</Badge>
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">{stats.completeResponses}</div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Check-in Only</CardTitle>
 <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">Incomplete</Badge>
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">{stats.checkInOnlyResponses}</div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Gemiddelde Leeftijd</CardTitle>
 <BarChart3 className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">{stats.averageAge} jaar</div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Gevoel Verbetering</CardTitle>
 <TrendingUp className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">
 {stats.feelingChanges.length > 0 ? 
 `${Math.round(stats.feelingChanges.reduce((acc, item) => acc + item.change, 0) / stats.feelingChanges.length * 100) / 100}` : 
 '0'
 }
 </div>
 <p className="text-xs text-muted-foreground">gemiddeld verschil</p>
 </CardContent>
 </Card>

 <Card>
 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
 <CardTitle className="text-sm font-medium">Vertrouwen Verbetering</CardTitle>
 <BarChart3 className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">
 {stats.confidenceChanges.length > 0 ? 
 `${Math.round(stats.confidenceChanges.reduce((acc, item) => acc + item.change, 0) / stats.confidenceChanges.length * 100) / 100}` : 
 '0'
 }
 </div>
 <p className="text-xs text-muted-foreground">gemiddeld verschil</p>
 </CardContent>
 </Card>
 </div>

 {/* Topic Distribution */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
 <Card>
 <CardHeader>
 <CardTitle>Meest Populaire Onderwerpen</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {Object.entries(stats.topTopics)
 .sort(([,a], [,b]) => b - a)
 .map(([topic, count]) => {
 const topicData = TOPICS[topic as keyof typeof TOPICS];
 return (
 <div key={topic} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
 <div 
 className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
 style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
 >
 {topicData?.icon || '❓'}
 </div>
 <div className="flex-1">
 <div className="font-medium">{topic}</div>
 <div className="text-sm text-gray-500">{count} keer gekozen</div>
 </div>
 <Badge variant="secondary">{count}</Badge>
 </div>
 );
 })}
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle>Actie Keuzes</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {Object.entries(stats.topActions)
 .sort(([,a], [,b]) => b - a)
 .map(([action, count]) => {
 const actionData = ACTION_OPTIONS.find(opt => opt.value === action);
 return (
 <div key={action} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
 <div className="font-medium">{actionData?.label || action}</div>
 <Badge variant="secondary">{count}</Badge>
 </div>
 );
 })}
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Export Button */}
 <div className="mb-8">
 <Card>
 <CardHeader>
 <CardTitle>Data Export</CardTitle>
 <CardDescription>Download alle survey responses als CSV bestand</CardDescription>
 </CardHeader>
 <CardContent>
 <Button 
 onClick={exportAllData}
 disabled={responses.length === 0}
 className="flex items-center space-x-2"
 >
 <Download className="h-4 w-4" />
 <span>Download CSV ({responses.length} responses)</span>
 </Button>
 </CardContent>
 </Card>
 </div>

 {/* Recent Responses */}
 <div className="space-y-6">
 <Card>
 <CardHeader>
 <CardTitle>Complete Responses (Check-in + Check-out)</CardTitle>
 <CardDescription>Bezoekers die beide delen van de survey hebben voltooid</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {completeResponses.length === 0 ? (
 <p className="text-gray-500 text-center py-8">Nog geen complete responses</p>
 ) : (
 completeResponses.slice(0, 10).map((response) => {
 const topicData = TOPICS[response.mostImportantTopic as keyof typeof TOPICS];
 return (
 <div key={response.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center space-x-3">
 <div 
 className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
 style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
 >
 {topicData?.icon || '❓'}
 </div>
 <span className="font-semibold">{response.name}</span>
 <Badge className="bg-green-100 text-green-800">Complete</Badge>
 </div>
 <span className="text-sm text-gray-500">
 {new Date(response.createdAt).toLocaleDateString('nl-NL')}
 </span>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
 <div>
 <span className="text-gray-600">Leeftijd:</span> {response.age}
 </div>
 <div>
 <span className="text-gray-600">Onderwerp:</span> {response.mostImportantTopic}
 </div>
 <div>
 <span className="text-gray-600">Resultaat:</span> {response.result}
 </div>
 <div>
 <span className="text-gray-600">Actie:</span> {response.actionChoice}
 </div>
 </div>
 </div>
 );
 })
 )}
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle>Check-in Only Responses</CardTitle>
 <CardDescription>Bezoekers die alleen de check-in hebben voltooid</CardDescription>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {checkInOnlyResponses.length === 0 ? (
 <p className="text-gray-500 text-center py-8">Geen check-in only responses</p>
 ) : (
 checkInOnlyResponses.slice(0, 10).map((response) => {
                  const topicData = TOPICS[response.mostImportantTopic as keyof typeof TOPICS];
                  return (
                    <div key={response.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                            style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
                          >
                            {topicData?.icon || '❓'}
                          </div>
                          <span className="font-semibold">{response.name}</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Incomplete</Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(response.createdAt).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Leeftijd:</span> {response.age}
                        </div>
                        <div>
                          <span className="text-gray-600">Onderwerp:</span> {response.mostImportantTopic}
                        </div>
                        <div>
                          <span className="text-gray-600">Bezoekt met:</span> {response.visitingWith}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}