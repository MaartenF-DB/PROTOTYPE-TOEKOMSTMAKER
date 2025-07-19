import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { SurveyResponse } from '@shared/schema';
import { TOPICS, ACTION_OPTIONS } from '@/types/survey';
import { Download, Users, TrendingUp, BarChart3, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Dashboard() {
  const [resetCode, setResetCode] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: responses = [], isLoading } = useQuery<SurveyResponse[]>({
    queryKey: ['/api/survey-responses'],
    select: (data) => data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });

  const exportWithReset = useMutation({
    mutationFn: async (code: string) => {
      if (code !== 'NieuweInstituutLINA') {
        throw new Error('Onjuiste authenticatiecode');
      }
      
      console.log('🔐 Authentication successful, starting CSV export and reset');
      
      // Get current data before reset
      const currentResponses = responses;
      
      // Generate and download CSV
      console.log('📊 Generating CSV...');
      const csvContent = generateCSV(currentResponses);
      downloadCSV(csvContent);
      
      // Small delay to ensure CSV download starts
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset data via API
      console.log('🗑️ Resetting all survey data');
      const response = await fetch('/api/survey-responses/reset', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Reset failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Export and reset successful:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/survey-responses'] });
      toast({
        title: "CSV Export Voltooid",
        description: "CSV gedownload en alle data is gereset. Nieuwe antwoorden worden nu als verse data behandeld.",
      });
      setResetCode('');
    },
    onError: (error: any) => {
      console.error('Export error:', error);
      toast({
        title: "Export Fout",
        description: error.message || "Er is een fout opgetreden tijdens het exporteren",
        variant: "destructive",
      });
    },
  });

  // Enhanced response categorization
  const completeResponses = responses.filter(r => 
    r.feelingAfter !== null && 
    r.feelingAfter !== 0 &&
    r.actionChoice && 
    r.actionChoice.trim() !== '' &&
    r.confidenceAfter !== null &&
    r.confidenceAfter !== 0 &&
    r.mostImportantTopic
  );
  
  const checkInOnlyResponses = responses.filter(r => 
    r.mostImportantTopic && (
      r.feelingAfter === null || 
      r.feelingAfter === 0 ||
      !r.actionChoice || 
      r.actionChoice.trim() === '' ||
      r.confidenceAfter === null ||
      r.confidenceAfter === 0
    )
  );
  
  const checkOutOnlyResponses = responses.filter(r => 
    !r.mostImportantTopic && 
    r.feelingAfter !== null && 
    r.feelingAfter !== 0 &&
    r.actionChoice && 
    r.actionChoice.trim() !== '' &&
    r.confidenceAfter !== null &&
    r.confidenceAfter !== 0
  );

  // Enhanced stats with all requested metrics
  const stats = {
    totalResponses: responses.length,
    completeResponses: completeResponses.length,
    checkInOnlyResponses: checkInOnlyResponses.length,
    checkOutOnlyResponses: checkOutOnlyResponses.length,
    
    // Age distribution for pie chart
    ageDistribution: responses.reduce((acc, r) => {
      if (r.age) {
        const age = parseInt(r.age);
        let ageGroup = '';
        if (age <= 6) ageGroup = '0-6 jaar';
        else if (age <= 9) ageGroup = '7-9 jaar';  
        else if (age <= 12) ageGroup = '10-12 jaar';
        else ageGroup = '13+ jaar';
        acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    
    // Visiting with distribution for pie chart
    visitingWithDistribution: responses.reduce((acc, r) => {
      if (r.visitingWith) {
        let visiting = r.visitingWith;
        if (visiting === 'family') visiting = 'Familie';
        else if (visiting === 'school') visiting = 'School';
        else if (visiting === 'friends') visiting = 'Vrienden';
        else if (visiting === 'parents') visiting = 'Ouders';
        else if (visiting === 'other') visiting = r.visitingWithOther || 'Anders';
        
        acc[visiting] = (acc[visiting] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    
    averageAge: responses.length > 0 ? Math.round(responses.reduce((acc, r) => acc + parseInt(r.age), 0) / responses.length) : 0,
    
    topTopics: responses.reduce((acc, r) => {
      if (r.mostImportantTopic) {
        acc[r.mostImportantTopic] = (acc[r.mostImportantTopic] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    
    actionChoices: completeResponses.reduce((acc, r) => {
      if (r.actionChoice) {
        let action = r.actionChoice;
        if (action === 'uitvinden') action = 'Uitvinden';
        else if (action === 'actie') action = 'Actie ondernemen';
        else if (action === 'veranderen') action = 'Veranderen';
        
        acc[action] = (acc[action] || 0) + 1;
      }
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
    })),
    
    // Average improvements
    averageFeelingImprovement: completeResponses.filter(r => r.feelingBefore !== null && r.feelingAfter !== null).length > 0 ? 
      Math.round(completeResponses.filter(r => r.feelingBefore !== null && r.feelingAfter !== null)
        .reduce((acc, r) => acc + (r.feelingAfter! - r.feelingBefore!), 0) / 
        completeResponses.filter(r => r.feelingBefore !== null && r.feelingAfter !== null).length * 100) / 100 : 0,
        
    averageConfidenceImprovement: completeResponses.filter(r => r.confidenceBefore !== null && r.confidenceAfter !== null).length > 0 ? 
      Math.round(completeResponses.filter(r => r.confidenceBefore !== null && r.confidenceAfter !== null)
        .reduce((acc, r) => acc + (r.confidenceAfter! - r.confidenceBefore!), 0) / 
        completeResponses.filter(r => r.confidenceBefore !== null && r.confidenceAfter !== null).length * 100) / 100 : 0
  };
  
  // Data for pie charts
  const ageChartData = Object.entries(stats.ageDistribution).map(([age, count]) => ({
    name: age,
    value: count
  }));
  
  const visitingChartData = Object.entries(stats.visitingWithDistribution).map(([visiting, count]) => ({
    name: visiting,
    value: count
  }));
  
  const topicsChartData = Object.entries(stats.topTopics).map(([topic, count]) => ({
    name: topic,
    value: count
  }));
  
  const actionsChartData = Object.entries(stats.actionChoices).map(([action, count]) => ({
    name: action,
    value: count
  }));
  
  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];
  
  // Before/After comparison data
  const feelingComparisonData = stats.feelingChanges.map(item => ({
    name: item.topic,
    voor: item.before,
    na: item.after
  }));
  
  const confidenceComparisonData = stats.confidenceChanges.map(item => ({
    name: item.topic,
    voor: item.before,
    na: item.after
  }));

  const mostPopularTopic = Object.entries(stats.topTopics).sort(([,a], [,b]) => b - a)[0]?.[0];
  const topicData = mostPopularTopic ? TOPICS[mostPopularTopic as keyof typeof TOPICS] : null;



  // Helper functions for CSV generation
  const generateCSV = (responseData: SurveyResponse[]) => {
    const csvContent = responseData.map(response => ({
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
    
    const csvHeaders = Object.keys(csvContent[0]);
    const csvRows = csvContent.map(row => Object.values(row).map(val => 
      typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n')) 
        ? `"${val.replace(/"/g, '""')}"` 
        : val
    ));
    
    return [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
  };

  const downloadCSV = (csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
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

        {/* Stats Cards - Row 1: Basic Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">1. Totaal Antwoorden</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResponses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">2. Check-in + Check-out</CardTitle>
              <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">Complete</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completeResponses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">3. Check-in Only</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">Incompleet</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.checkInOnlyResponses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">4. Check-out Only</CardTitle>
              <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">Alleen uitgang</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.checkOutOnlyResponses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1: Age and Visiting Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>5. Leeftijd Verdeling</CardTitle>
              <CardDescription>Cirkeldiagram van bezoeker leeftijden</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Met Wie Bezoek</CardTitle>
              <CardDescription>Cirkeldiagram van begeleiding</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={visitingChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                  >
                    {visitingChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stats Row 2: Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">7. Gevoel Verbetering</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.averageFeelingImprovement}</div>
              <p className="text-xs text-muted-foreground">gemiddeld voor de Toekomst</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">8. Vertrouwen Verbetering</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.averageConfidenceImprovement}</div>
              <p className="text-xs text-muted-foreground">gemiddeld in veranderen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">9. Populairste Onderwerp</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {Object.entries(stats.topTopics).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Geen data'}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.entries(stats.topTopics).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} keer gekozen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">10. Populairste Actie</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {Object.entries(stats.actionChoices).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Geen data'}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.entries(stats.actionChoices).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} keer gekozen
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2: Before/After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>11. Gevoel Verandering</CardTitle>
              <CardDescription>Voor vs Na tentoonstelling</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feelingComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="voor" fill="#8884d8" name="Voor" />
                  <Bar dataKey="na" fill="#82ca9d" name="Na" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Vertrouwen Verandering</CardTitle>
              <CardDescription>Voor vs Na tentoonstelling</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={confidenceComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="voor" fill="#ffc658" name="Voor" />
                  <Bar dataKey="na" fill="#ff7c7c" name="Na" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Export and Reset Section */}

        {/* Export and Reset Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Export & Reset
            </CardTitle>
            <CardDescription>
              Download CSV bestand met alle antwoorden en reset daarna alle data. Nieuwe antwoorden worden als nieuw gezien.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reset-code">Authenticatiecode</Label>
                <Input
                  id="reset-code"
                  type="password"
                  placeholder="Voer authenticatiecode in..."
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  disabled={exportWithReset.isPending}
                />
                <p className="text-sm text-gray-500">
                  Code vereist voor export en reset functionaliteit
                </p>
              </div>
              <div className="flex flex-col justify-end">
                <Button 
                  onClick={() => exportWithReset.mutate(resetCode)}
                  disabled={responses.length === 0 || !resetCode.trim() || exportWithReset.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {exportWithReset.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Bezig...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      <Trash2 className="mr-2 h-4 w-4" />
                      Export CSV & Reset ({responses.length})
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  ⚠️ Downloadt CSV bestand, daarna verwijdert ALLE data permanent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Complete Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Complete Responses
                <Badge className="bg-green-100 text-green-800">{stats.completeResponses}</Badge>
              </CardTitle>
              <CardDescription>Volledige check-in + check-out responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completeResponses.slice(0, 8).map((response, index) => (
                  <div key={index} className="p-4 border rounded-lg border-green-200 bg-green-50">
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
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Gevoel:</span>
                        <div className="font-medium">{response.feelingBefore || 'N/A'} → {response.feelingAfter || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Vertrouwen:</span>
                        <div className="font-medium">{response.confidenceBefore || 'N/A'} → {response.confidenceAfter || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm mt-2">
                      <span className="text-gray-500">Persoonlijkheid:</span>
                      <div className="font-medium text-blue-600">{response.result}</div>
                    </div>
                  </div>
                ))}
                
                {completeResponses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nog geen complete responses
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Check-in Only Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Check-in Only
                <Badge className="bg-yellow-100 text-yellow-800">{stats.checkInOnlyResponses}</Badge>
              </CardTitle>
              <CardDescription>Alleen check-in ingevuld, nog geen check-out</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkInOnlyResponses.slice(0, 8).map((response, index) => (
                  <div key={index} className="p-4 border rounded-lg border-yellow-200 bg-yellow-50">
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
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Gevoel voor:</span>
                        <div className="font-medium">{response.feelingBefore || 'N/A'}/5</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Vertrouwen voor:</span>
                        <div className="font-medium">{response.confidenceBefore || 'N/A'}/5</div>
                      </div>
                    </div>
                    
                    <div className="text-sm mt-2">
                      <span className="text-gray-500">Status:</span>
                      <div className="font-medium text-orange-600">Wacht op check-out</div>
                    </div>
                  </div>
                ))}
                
                {checkInOnlyResponses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Alle check-in responses zijn compleet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3: Topic and Action Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>13. Onderwerp Verdeling</CardTitle>
              <CardDescription>Cirkeldiagram van gekozen onderwerpen</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topicsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topicsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Actie Keuze Verdeling</CardTitle>
              <CardDescription>Cirkeldiagram van gekozen acties</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={actionsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="value"
                  >
                    {actionsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Final Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>15. Samenvatting Dashboard</CardTitle>
            <CardDescription>Overzicht van alle belangrijke statistieken</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalResponses}</div>
                <div className="text-sm text-gray-600">Totaal Bezoekers</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalResponses > 0 ? Math.round((stats.completeResponses / stats.totalResponses) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Complete Responses</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.averageAge}</div>
                <div className="text-sm text-gray-600">Gemiddelde Leeftijd</div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Het dashboard toont alle 15 gewenste statistieken met interactieve cirkeldiagrammen, 
                balkendiagrammen en gedetailleerde response categorieën voor een complete analyse van de museumervaring.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}