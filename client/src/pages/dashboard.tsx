import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { exportToCSV } from '@/lib/csvExport';
import { SurveyResponse } from '@shared/schema';
import { TOPICS, ACTION_OPTIONS } from '@/types/survey';
import { Download, Users, TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { data: responses = [], isLoading } = useQuery<SurveyResponse[]>({
    queryKey: ['/api/survey-responses'],
    select: (data) => data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });

  const stats = {
    totalResponses: responses.length,
    averageAge: responses.length > 0 ? Math.round(responses.reduce((acc, r) => acc + parseInt(r.age), 0) / responses.length) : 0,
    topTopics: responses.reduce((acc, r) => {
      acc[r.mostImportantTopic] = (acc[r.mostImportantTopic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    topActions: responses.reduce((acc, r) => {
      acc[r.actionChoice] = (acc[r.actionChoice] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    visitingWithStats: responses.reduce((acc, r) => {
      acc[r.visitingWith] = (acc[r.visitingWith] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    // Check-in vs Check-out comparison
    beforeAfterStats: responses.reduce((acc, r) => {
      if (r.feelingBefore !== null && r.feelingAfter !== null) {
        acc.feelingChange.push({
          topic: r.mostImportantTopic,
          before: r.feelingBefore,
          after: r.feelingAfter,
          change: r.feelingAfter - r.feelingBefore
        });
      }
      if (r.confidenceBefore !== null && r.confidenceAfter !== null) {
        acc.confidenceChange.push({
          topic: r.mostImportantTopic,
          before: r.confidenceBefore,
          after: r.confidenceAfter,
          change: r.confidenceAfter - r.confidenceBefore
        });
      }
      return acc;
    }, {
      feelingChange: [] as Array<{topic: string, before: number, after: number, change: number}>,
      confidenceChange: [] as Array<{topic: string, before: number, after: number, change: number}>
    })
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Gemiddelde Leeftijd</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageAge} jaar</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Populairste Onderwerp</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.entries(stats.topTopics).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Geen data'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meest Gekozen Actie</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.entries(stats.topActions).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Geen data'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        <div className="mb-6">
          <Button 
            onClick={exportAllData}
            disabled={responses.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export naar CSV ({responses.length} antwoorden)
          </Button>
        </div>

        {/* Topic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Onderwerp Verdeling</CardTitle>
              <CardDescription>Hoe belangrijk vinden bezoekers elk onderwerp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.topTopics)
                  .sort(([,a], [,b]) => b - a)
                  .map(([topic, count]) => (
                    <div key={topic} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{TOPICS[topic as keyof typeof TOPICS]?.icon || '❓'}</span>
                        <span className="font-medium">{topic}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{count}</Badge>
                        <div className="text-sm text-gray-500">
                          {Math.round((count / responses.length) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actie Keuzes</CardTitle>
              <CardDescription>Welke actie bezoekers willen ondernemen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.topActions)
                  .sort(([,a], [,b]) => b - a)
                  .map(([action, count]) => (
                    <div key={action} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{ACTION_OPTIONS.find(opt => opt.value === action)?.icon || '❓'}</span>
                        <span className="font-medium">{ACTION_OPTIONS.find(opt => opt.value === action)?.label || action}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{count}</Badge>
                        <div className="text-sm text-gray-500">
                          {Math.round((count / responses.length) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Check-in vs Check-out Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Gevoel Verandering</span>
              </CardTitle>
              <CardDescription>Check-in vs Check-out gevoelens per onderwerp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.beforeAfterStats.feelingChange.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                      <div>Onderwerp</div>
                      <div>Voor → Na</div>
                      <div>Verandering</div>
                    </div>
                    {stats.beforeAfterStats.feelingChange.map((change, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{TOPICS[change.topic as keyof typeof TOPICS]?.icon || '❓'}</span>
                          <span className="font-medium text-xs">{change.topic}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">{change.before}</Badge>
                          <span>→</span>
                          <Badge variant="outline" className="text-xs">{change.after}</Badge>
                        </div>
                        <div className="flex items-center">
                          <Badge 
                            variant={change.change > 0 ? "default" : change.change < 0 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {change.change > 0 ? '+' : ''}{change.change}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="text-sm text-gray-600">
                        Gemiddelde verandering: {stats.beforeAfterStats.feelingChange.length > 0 ? 
                          (stats.beforeAfterStats.feelingChange.reduce((acc, c) => acc + c.change, 0) / stats.beforeAfterStats.feelingChange.length).toFixed(1) : 
                          '0'
                        }
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Nog geen complete voor/na data beschikbaar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Vertrouwen Verandering</span>
              </CardTitle>
              <CardDescription>Check-in vs Check-out vertrouwen per onderwerp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.beforeAfterStats.confidenceChange.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                      <div>Onderwerp</div>
                      <div>Voor → Na</div>
                      <div>Verandering</div>
                    </div>
                    {stats.beforeAfterStats.confidenceChange.map((change, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{TOPICS[change.topic as keyof typeof TOPICS]?.icon || '❓'}</span>
                          <span className="font-medium text-xs">{change.topic}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">{change.before}</Badge>
                          <span>→</span>
                          <Badge variant="outline" className="text-xs">{change.after}</Badge>
                        </div>
                        <div className="flex items-center">
                          <Badge 
                            variant={change.change > 0 ? "default" : change.change < 0 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {change.change > 0 ? '+' : ''}{change.change}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="text-sm text-gray-600">
                        Gemiddelde verandering: {stats.beforeAfterStats.confidenceChange.length > 0 ? 
                          (stats.beforeAfterStats.confidenceChange.reduce((acc, c) => acc + c.change, 0) / stats.beforeAfterStats.confidenceChange.length).toFixed(1) : 
                          '0'
                        }
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Nog geen complete voor/na data beschikbaar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Responses */}
        <Card>
          <CardHeader>
            <CardTitle>Recente Antwoorden</CardTitle>
            <CardDescription>Laatste {Math.min(10, responses.length)} antwoorden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {responses.slice(0, 10).map((response, index) => (
                <div key={response.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div className="font-medium">{response.name}</div>
                      <div className="text-sm text-gray-500">{response.age} jaar</div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(response.createdAt).toLocaleDateString('nl-NL')} om {new Date(response.createdAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge style={{ backgroundColor: TOPICS[response.mostImportantTopic as keyof typeof TOPICS]?.hexColor || '#6366f1' }}>
                      {TOPICS[response.mostImportantTopic as keyof typeof TOPICS]?.icon || '❓'} {response.mostImportantTopic}
                    </Badge>
                    <Badge variant="outline">
                      {ACTION_OPTIONS.find(opt => opt.value === response.actionChoice)?.icon || '❓'} {ACTION_OPTIONS.find(opt => opt.value === response.actionChoice)?.label || response.actionChoice}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Gevoel voor:</span>
                      <div className="font-medium">{response.feelingBefore || 'N/A'}/5</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Vertrouwen voor:</span>
                      <div className="font-medium">{response.confidenceBefore || 'N/A'}/5</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Gevoel na:</span>
                      <div className="font-medium">{response.feelingAfter || 'N/A'}/5</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Vertrouwen na:</span>
                      <div className="font-medium">{response.confidenceAfter || 'N/A'}/5</div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-500">Persoonlijkheid:</span>
                    <div className="font-medium text-blue-600">{response.result}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {responses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nog geen antwoorden ontvangen
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}