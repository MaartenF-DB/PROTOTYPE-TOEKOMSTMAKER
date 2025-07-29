import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SurveyResponse } from '@shared/schema';
import { TOPICS, ACTION_OPTIONS } from '@/types/survey';
import { Download, Users, TrendingUp, BarChart3, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

export default function Dashboard() {
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteError, setDeleteError] = useState('');
  
  const queryClient = useQueryClient();
  
  const { data: responses = [], isLoading } = useQuery<SurveyResponse[]>({
    queryKey: ['/api/survey-responses'],
    select: (data) => data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });

  const clearDataMutation = useMutation({
    mutationFn: async (code: string) => {
      console.log('🗑️ Clearing data with code:', code);
      const response = await apiRequest('POST', '/api/survey-responses/reset', { code });
      console.log('✅ Data cleared successfully:', response);
      return response;
    },
    onSuccess: () => {
      console.log('🔄 Refreshing data...');
      queryClient.invalidateQueries({ queryKey: ['/api/survey-responses'] });
      queryClient.refetchQueries({ queryKey: ['/api/survey-responses'] });
      setDeleteCode('');
      setDeleteError('');
      alert('✅ Alle data is succesvol verwijderd!');
    },
    onError: (error: any) => {
      console.error('❌ Error clearing data:', error);
      setDeleteError(error.message || 'Fout bij het wissen van data');
    }
  });

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
      'Kennis voor (1-5)': response.knowledgeBefore || '',
      'Gevoel na (1-5)': response.feelingAfter || '',
      'Actie keuze': response.actionChoice || '',
      'Vertrouwen na (1-5)': response.confidenceAfter || '',
      'Iets nieuws geleerd (1-5)': response.learnedSomethingNew || '',
      'Interessantste geleerd': response.mostInterestingLearned || '',
      'Persoonlijkheid': response.result || '',
      'Is checkout-only gebruiker': response.isNewCheckoutUser ? 'Ja' : 'Nee',
      'Datum': new Date(response.createdAt).toLocaleDateString('nl-NL'),
      'Tijd': new Date(response.createdAt).toLocaleTimeString('nl-NL')
    }));

    // Create proper CSV with UTF-8 BOM for Numbers compatibility
    const headers = Object.keys(csvContent[0]).join(';');
    const rows = csvContent.map(row => 
      Object.values(row).map(val => {
        const stringVal = String(val || '');
        // Escape quotes and wrap in quotes if contains special characters
        if (stringVal.includes(';') || stringVal.includes('"') || stringVal.includes('\n')) {
          return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
      }).join(';')
    );
    
    // Add UTF-8 BOM for proper Numbers import
    const csv = '\uFEFF' + [headers, ...rows].join('\n');

    const filename = `museum-responses-${new Date().toISOString().split('T')[0]}.csv`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    
    // Check if we're on iOS/iPad
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS || isSafari) {
      // For iOS/Safari, use a different approach to ensure Downloads folder
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      
      // Add to DOM and trigger download
      document.body.appendChild(a);
      
      // Use user interaction event for iOS
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      
      a.dispatchEvent(clickEvent);
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } else {
      // Standard download for other browsers
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  const handleExportAndDeleteAll = async () => {
    // Check if code is correct
    if (deleteCode !== 'HNIlina') {
      setDeleteError('Onjuiste code. Gebruik "HNIlina" om te exporteren en data te wissen.');
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      '⚠️ WAARSCHUWING: Alle data wordt verwijderd!\n\n' +
      'Deze actie:\n' +
      '1. Downloadt alle survey data als CSV\n' +
      '2. VERWIJDERT PERMANENT ALLE DATA\n' +
      '3. Kan NIET ongedaan gemaakt worden\n\n' +
      'Weet je zeker dat je wilt doorgaan?'
    );
    
    if (!confirmed) {
      return;
    }
    
    setDeleteError('');
    
    try {
      console.log('🚨 STARTING EXPORT AND DELETE ALL');
      // First export the data
      exportAllData();
      
      // Wait a moment for download to start, then clear data
      setTimeout(() => {
        console.log('🗑️ STARTING DATA DELETE');
        clearDataMutation.mutate(deleteCode);
      }, 1000);
    } catch (error) {
      console.error('❌ Export and delete error:', error);
      setDeleteError('Er is een fout opgetreden bij het exporteren.');
    }
  };

  // Separate responses by type - now that check-in and check-out are combined, we have simpler logic
  const completeResponses = responses.filter(r => 
    r.feelingAfter !== null && 
    r.feelingAfter !== 0 &&
    r.actionChoice && 
    r.actionChoice.trim() !== '' &&
    r.confidenceAfter !== null &&
    r.confidenceAfter !== 0
  );
  
  const checkInOnlyResponses = responses.filter(r => 
    (r.feelingAfter === null || r.feelingAfter === 0) &&
    (!r.actionChoice || r.actionChoice.trim() === '') &&
    (r.confidenceAfter === null || r.confidenceAfter === 0)
  );
  
  // No more separate checkout-only responses since they get merged into existing check-in records
  const checkOutOnlyResponses: SurveyResponse[] = [];

  const stats = {
    totalResponses: responses.length,
    completeResponses: completeResponses.length,
    checkInOnlyResponses: checkInOnlyResponses.length,
    checkOutOnlyResponses: checkOutOnlyResponses.length,
    averageAge: responses.length > 0 ? Math.round(responses.reduce((acc, r) => acc + parseInt(r.age), 0) / responses.length) : 0,
    ageDistribution: responses.reduce((acc, r) => {
      acc[r.age] = (acc[r.age] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    visitingWithDistribution: responses.reduce((acc, r) => {
      acc[r.visitingWith] = (acc[r.visitingWith] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    topTopics: responses.reduce((acc, r) => {
      acc[r.mostImportantTopic] = (acc[r.mostImportantTopic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    topActions: completeResponses.reduce((acc, r) => {
      if (r.actionChoice) {
        acc[r.actionChoice] = (acc[r.actionChoice] || 0) + 1;
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
    }))
  };

  const mostPopularTopic = Object.entries(stats.topTopics).sort(([,a], [,b]) => b - a)[0]?.[0];
  const topicData = mostPopularTopic ? TOPICS[mostPopularTopic as keyof typeof TOPICS] : null;

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
              <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">[zonder Check-out]</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.checkInOnlyResponses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check-out Only</CardTitle>
              <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">[zonder Check-in]</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.checkOutOnlyResponses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">📊 Onderwerp 1: Visie van de Toekomst</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-4 text-green-600">
                    {stats.feelingChanges.length > 0 ? 
                      `+${Math.round(stats.feelingChanges.reduce((acc, item) => acc + item.change, 0) / stats.feelingChanges.length * 100) / 100}` : 
                      '0'
                    }
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.feelingChanges.length} complete responses
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {stats.feelingChanges.length > 0 ? 
                          (stats.feelingChanges.reduce((acc, item) => acc + item.before, 0) / stats.feelingChanges.length).toFixed(1) : 
                          '0'
                        }
                      </div>
                      <div className="text-sm text-gray-600">Check-in (Voor)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.feelingChanges.length > 0 ? 
                          (stats.feelingChanges.reduce((acc, item) => acc + item.after, 0) / stats.feelingChanges.length).toFixed(1) : 
                          '0'
                        }
                      </div>
                      <div className="text-sm text-gray-600">Check-out (Na)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">🎯 Onderwerp 2: Vertrouwen in de Toekomst</CardTitle>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-4 text-blue-600">
                    {stats.confidenceChanges.length > 0 ? 
                      `+${Math.round(stats.confidenceChanges.reduce((acc, item) => acc + item.change, 0) / stats.confidenceChanges.length * 100) / 100}` : 
                      '0'
                    }
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.confidenceChanges.length} complete responses
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.confidenceChanges.length > 0 ? 
                          (stats.confidenceChanges.reduce((acc, item) => acc + item.before, 0) / stats.confidenceChanges.length).toFixed(1) : 
                          '0'
                        }
                      </div>
                      <div className="text-sm text-gray-600">Check-in (Voor)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.confidenceChanges.length > 0 ? 
                          (stats.confidenceChanges.reduce((acc, item) => acc + item.after, 0) / stats.confidenceChanges.length).toFixed(1) : 
                          '0'
                        }
                      </div>
                      <div className="text-sm text-gray-600">Check-out (Na)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demographics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>🎂 Hoe oud ben je?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['6', '7', '8', '9', '10', '11', '12', 'anders'].map((ageOption) => {
                  const count = stats.ageDistribution[ageOption] || 0;
                  const percentage = stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0;
                  return (
                    <div key={ageOption} className="flex items-center space-x-4">
                      <div className="w-16 text-sm font-medium">
                        {ageOption === 'anders' ? 'Anders' : `${ageOption} jaar`}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-6">
                          <div 
                            className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                            style={{ width: `${Math.max(percentage, 8)}%` }}
                          >
                            {count}
                          </div>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-gray-500">{Math.round(percentage)}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👥 Met wie bezoek je de tentoonstelling?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { value: 'school', label: 'School', icon: '🏫' },
                  { value: 'alleen', label: 'Alleen', icon: '🚶' },
                  { value: 'babysitter', label: 'Oppas', icon: '👩‍🍼' },
                  { value: 'anders', label: 'Anders', icon: '👪' }
                ].map(({ value, label, icon }) => {
                  const count = stats.visitingWithDistribution[value] || 0;
                  const percentage = stats.totalResponses > 0 ? (count / stats.totalResponses) * 100 : 0;
                  return (
                    <div key={value} className="flex items-center space-x-4">
                      <div className="w-20 text-sm font-medium flex items-center space-x-2">
                        <span>{icon}</span>
                        <span>{label}</span>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-6">
                          <div 
                            className="bg-green-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                            style={{ width: `${Math.max(percentage, 8)}%` }}
                          >
                            {count}
                          </div>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-gray-500">{Math.round(percentage)}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>🏆 Meest Populaire Onderwerpen</CardTitle>
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
                          <div className="font-medium flex items-center space-x-2">
                            <span>{topicData?.icon}</span>
                            <span>{topic}</span>
                          </div>
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
              <CardTitle>⚡ Meest Populaire Acties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.topActions)
                  .sort(([,a], [,b]) => b - a)
                  .map(([action, count]) => {
                    const actionData = ACTION_OPTIONS.find(opt => opt.value === action);
                    return (
                      <div key={action} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                          {actionData?.icon || '🎯'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center space-x-2">
                            <span>{actionData?.icon}</span>
                            <span>{actionData?.label || action}</span>
                          </div>
                          <div className="text-sm text-gray-500">{count} keer gekozen</div>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export and Data Management */}
        <div className="mb-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Download alle survey responses als CSV bestand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accessCode">Toegangscode</Label>
                  <Input
                    id="accessCode"
                    type="text"
                    value={deleteCode}
                    onChange={(e) => setDeleteCode(e.target.value)}
                    placeholder="Voer toegangscode in..."
                    className="max-w-sm"
                  />
                </div>
                
                {deleteError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                    {deleteError}
                  </div>
                )}
                
                <button
                  onClick={handleExportAndDeleteAll}
                  disabled={responses.length === 0 || clearDataMutation.isPending}
                  style={{
                    backgroundColor: deleteCode === 'HNIlina' ? '#dc2626' : '#9ca3af',
                    color: 'white',
                    border: '2px solid',
                    borderColor: deleteCode === 'HNIlina' ? '#991b1b' : '#6b7280',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: responses.length === 0 || clearDataMutation.isPending ? 'not-allowed' : 'pointer',
                    opacity: responses.length === 0 || clearDataMutation.isPending ? 0.5 : 1
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>
                    {clearDataMutation.isPending ? 'Bezig met verwijderen...' : `Download CSV (${responses.length} responses)`}
                  </span>
                </button>
                
                {deleteCode === 'HNIlina' && (
                  <div className="text-sm text-red-700 bg-red-100 border border-red-300 rounded-md p-3">
                    <strong>WAARSCHUWING:</strong> Deze actie downloadt de data en verwijdert alle responses permanent!
                  </div>
                )}
              </div>
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
                            <span className="text-gray-600">Bezoekt met:</span> {response.visitingWith}
                          </div>
                          <div>
                            <span className="text-gray-600">Actie:</span> {response.actionChoice}
                          </div>
                          <div>
                            <span className="text-gray-600">Gevoel voor:</span> {response.feelingBefore || 'N/A'}
                          </div>
                          <div>
                            <span className="text-gray-600">Gevoel na:</span> {response.feelingAfter}
                          </div>
                          <div>
                            <span className="text-gray-600">Vertrouwen voor:</span> {response.confidenceBefore || 'N/A'}
                          </div>
                          <div>
                            <span className="text-gray-600">Vertrouwen na:</span> {response.confidenceAfter}
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded border">
                          <span className="text-sm font-medium text-gray-600">Resultaat: </span>
                          <span className="text-sm font-semibold" style={{ color: topicData?.hexColor || '#6B7280' }}>
                            {response.result}
                          </span>
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
              <CardDescription>Bezoekers die alleen check-in hebben gedaan [zonder Check-out]</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkInOnlyResponses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nog geen check-in only responses</p>
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
                            <Badge className="bg-yellow-100 text-yellow-800">[zonder Check-out]</Badge>
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

          <Card>
            <CardHeader>
              <CardTitle>Check-out Only Responses</CardTitle>
              <CardDescription>Bezoekers die alleen check-out hebben gedaan [zonder Check-in]</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkOutOnlyResponses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nog geen check-out only responses</p>
                ) : (
                  checkOutOnlyResponses.slice(0, 10).map((response) => {
                    const topicData = TOPICS[response.mostImportantTopic as keyof typeof TOPICS];
                    return (
                      <div key={response.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                              style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
                            >
                              {topicData?.icon || '❓'}
                            </div>
                            <span className="font-semibold">{response.name}</span>
                            <Badge className="bg-blue-100 text-blue-800">[zonder Check-in]</Badge>
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
                            <span className="text-gray-600">Bezoekt met:</span> {response.visitingWith}
                          </div>
                          <div>
                            <span className="text-gray-600">Actie:</span> {response.actionChoice}
                          </div>
                          <div>
                            <span className="text-gray-600">Gevoel na:</span> {response.feelingAfter}
                          </div>
                          <div>
                            <span className="text-gray-600">Vertrouwen na:</span> {response.confidenceAfter}
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-white rounded border">
                          <span className="text-sm font-medium text-gray-600">Resultaat: </span>
                          <span className="text-sm font-semibold" style={{ color: topicData?.hexColor || '#6B7280' }}>
                            {response.result}
                          </span>
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
    </div>
  );
}