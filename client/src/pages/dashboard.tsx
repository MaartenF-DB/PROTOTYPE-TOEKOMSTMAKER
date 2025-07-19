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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal Antwoorden</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complete Responses</CardTitle>
              <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">Check-in + Check-out</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completeResponses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check-in Only</CardTitle>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">Incomplete</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{checkInOnlyResponses.length}</div>
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
              <CardTitle>Recent Responses</CardTitle>
              <CardDescription>Laatste survey antwoorden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nog geen responses</p>
                ) : (
                  responses.slice(0, 10).map((response) => (
                    <div key={response.id} className="border border-gray-200 bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">{response.name}</span>
                          <Badge variant={response.result ? "default" : "secondary"}>
                            {response.result ? "Complete" : "Incomplete"}
                          </Badge>
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}