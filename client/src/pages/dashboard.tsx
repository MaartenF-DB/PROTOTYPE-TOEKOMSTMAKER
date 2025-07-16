import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exportToCSV } from '@/lib/csvExport';
import { SurveyResponse } from '@shared/schema';
import { TOPICS, ACTION_OPTIONS } from '@/types/survey';
import { Download, Users, TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts';

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

  // Data for charts
  const topicChartData = Object.entries(stats.topTopics).map(([topic, count]) => ({
    topic,
    count,
    color: TOPICS[topic as keyof typeof TOPICS]?.hexColor || '#6366f1'
  }));

  const actionChartData = Object.entries(stats.topActions).map(([action, count]) => ({
    action: ACTION_OPTIONS.find(opt => opt.value === action)?.label || action,
    count
  }));

  const feelingComparisonData = stats.beforeAfterStats.feelingChange.map(item => ({
    topic: item.topic,
    voor: item.before,
    na: item.after,
    verandering: item.change
  }));

  const confidenceComparisonData = stats.beforeAfterStats.confidenceChange.map(item => ({
    topic: item.topic,
    voor: item.before,
    na: item.after,
    verandering: item.change
  }));

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
              <Calendar className="h-4 w-4 text-muted-foreground" />
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
                {stats.beforeAfterStats.feelingChange.length > 0 ? 
                  `${Math.round(stats.beforeAfterStats.feelingChange.reduce((acc, item) => acc + item.change, 0) / stats.beforeAfterStats.feelingChange.length * 100) / 100}` : 
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
                {stats.beforeAfterStats.confidenceChange.length > 0 ? 
                  `${Math.round(stats.beforeAfterStats.confidenceChange.reduce((acc, item) => acc + item.change, 0) / stats.beforeAfterStats.confidenceChange.length * 100) / 100}` : 
                  '0'
                }
              </div>
              <p className="text-xs text-muted-foreground">gemiddeld verschil</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Most Important Topics Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Belangrijkste Onderwerpen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={topicChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ topic, percent }) => `${topic} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {topicChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Action Choices Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Actie Keuzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={actionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="action" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Before vs After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Gevoel: Voor vs Na Tentoonstelling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={feelingComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="voor" stroke="#ef4444" strokeWidth={2} name="Voor" />
                  <Line type="monotone" dataKey="na" stroke="#22c55e" strokeWidth={2} name="Na" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Vertrouwen: Voor vs Na Tentoonstelling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={confidenceComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="voor" stroke="#ef4444" strokeWidth={2} name="Voor" />
                  <Line type="monotone" dataKey="na" stroke="#22c55e" strokeWidth={2} name="Na" />
                </LineChart>
              </ResponsiveContainer>
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

        {/* Recent Responses */}
        <Card>
          <CardHeader>
            <CardTitle>Recente Antwoorden</CardTitle>
            <CardDescription>Laatste {Math.min(10, responses.length)} antwoorden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {responses.slice(0, 10).map((response, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{response.name}</span>
                      <span className="text-sm text-gray-500 ml-2">{response.age} jaar</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(response.createdAt).toLocaleDateString('nl-NL')}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{TOPICS[response.mostImportantTopic as keyof typeof TOPICS]?.icon || '❓'}</span>
                    <span className="font-medium">{response.mostImportantTopic}</span>
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