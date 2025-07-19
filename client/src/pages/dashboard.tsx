import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Users, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { SurveyResponse } from '@/../../shared/schema';

// Topic mapping for display
const TOPIC_NAMES: { [key: string]: string } = {
  'WONEN': 'Wonen',
  'KLIMAAT': 'Klimaat',
  'GEZONDHEID': 'Gezondheid',
  'RIJKDOM': 'Rijkdom',
  'VREDE': 'Vrede',
  'VRIJE TIJD': 'Vrije tijd'
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Filter responses based on selected period
  const filteredResponses = responses.filter(response => {
    const responseDate = new Date(response.createdAt);
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'today':
        return responseDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return responseDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return responseDate >= monthAgo;
      default:
        return true;
    }
  });

  // Calculate statistics
  const completeResponses = filteredResponses.filter(r => r.result);
  const averageFeelingBefore = completeResponses.length > 0 
    ? completeResponses.reduce((sum, r) => sum + r.feelingBefore, 0) / completeResponses.length 
    : 0;
  const averageFeelingAfter = completeResponses.length > 0 && completeResponses.filter(r => r.feelingAfter).length > 0
    ? completeResponses.filter(r => r.feelingAfter).reduce((sum, r) => sum + (r.feelingAfter || 0), 0) / completeResponses.filter(r => r.feelingAfter).length
    : 0;

  // Prepare topic distribution data
  const topicData = Object.entries(
    filteredResponses.reduce((acc, response) => {
      const topic = TOPIC_NAMES[response.mostImportantTopic] || response.mostImportantTopic;
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  ).map(([name, value]) => ({ name, value }));

  // Prepare visiting with data
  const visitingData = Object.entries(
    filteredResponses.reduce((acc, response) => {
      acc[response.visitingWith] = (acc[response.visitingWith] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  ).map(([name, value]) => ({ name, value }));

  // Prepare daily response data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  }).reverse();

  const dailyData = last7Days.map(dateStr => {
    const count = responses.filter(r => new Date(r.createdAt).toDateString() === dateStr).length;
    return {
      date: new Date(dateStr).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric' }),
      responses: count
    };
  });

  const handleExportAll = () => {
    if (filteredResponses.length === 0) return;

    const csvData = filteredResponses.map(response => ({
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

    exportToCSV(csvData, `survey_responses_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
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
              Export CSV ({filteredResponses.length})
            </Button>
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'today', label: 'Vandaag' },
            { key: 'week', label: 'Deze week' },
            { key: 'month', label: 'Deze maand' },
            { key: 'all', label: 'Alle tijd' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={selectedPeriod === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(key as any)}
            >
              {label}
            </Button>
          ))}
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
            <div className="text-2xl font-bold">{filteredResponses.length}</div>
            <p className="text-xs text-muted-foreground">
              {completeResponses.length} compleet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gem. Gevoel (Voor)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageFeelingBefore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              van 10 punten
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gem. Gevoel (Na)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageFeelingAfter > 0 ? averageFeelingAfter.toFixed(1) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {averageFeelingAfter > averageFeelingBefore ? 'Verbeterd' : averageFeelingAfter < averageFeelingBefore ? 'Verminderd' : 'Gelijk'}
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Belangrijkste Onderwerpen</CardTitle>
            <CardDescription>
              Verdeling van de gekozen onderwerpen door bezoekers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bezoek Gezelschap</CardTitle>
            <CardDescription>
              Met wie bezoekers de tentoonstelling bezoeken
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Responses per Dag (Laatste 7 dagen)</CardTitle>
          <CardDescription>
            Trends in survey deelname
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="responses" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Response Cards */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recente Responses ({filteredResponses.length})</h2>
        <div className="grid gap-4">
          {filteredResponses.slice(0, 10).map((response, index) => (
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
        
        {filteredResponses.length > 10 && (
          <div className="text-center mt-4">
            <p className="text-gray-500">
              Toont de laatste 10 van {filteredResponses.length} responses. 
              Gebruik de export functie voor alle data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}