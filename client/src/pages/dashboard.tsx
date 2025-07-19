import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { SurveyResponse } from '@shared/schema';
import { TOPICS, ACTION_OPTIONS } from '@/types/survey';
import { Download, Users, TrendingUp, BarChart3, Trash2, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import jsPDF from 'jspdf';

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
      
      console.log('🔐 Authentication successful, starting export and reset');
      
      // Get current data before reset
      const currentResponses = responses;
      
      // Generate CSV first
      console.log('📊 Generating CSV...');
      const csvContent = generateCSV(currentResponses);
      downloadCSV(csvContent);
      
      // Small delay to ensure CSV download starts
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate PDF
      console.log('📋 Generating PDF...');
      generatePDF();
      
      // Small delay to ensure PDF is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        title: "Export Voltooid",
        description: "CSV en PDF gedownload, alle data is gereset. Nieuwe antwoorden worden nu als verse data behandeld.",
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

  const generatePDF = () => {
    try {
      if (responses.length === 0) {
        toast({
          title: "Geen data",
          description: "Er zijn geen antwoorden om een PDF van te maken",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting PDF generation with', responses.length, 'responses');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Title page
      doc.setFontSize(20);
      doc.text('Museum Dashboard Rapport', pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Gegenereerd op: ${new Date().toLocaleDateString('nl-NL')}`, pageWidth / 2, 45, { align: 'center' });
      doc.text(`Totaal aantal responses: ${responses.length}`, pageWidth / 2, 55, { align: 'center' });
      
      // Statistics section
      doc.setFontSize(16);
      doc.text('Statistieken', 20, 80);
      
      doc.setFontSize(10);
      const statsY = 95;
      doc.text(`Totaal antwoorden: ${stats.totalResponses}`, 20, statsY);
      doc.text(`Complete responses: ${stats.completeResponses}`, 20, statsY + 10);
      doc.text(`Check-in alleen: ${stats.checkInOnlyResponses}`, 20, statsY + 20);
      doc.text(`Gemiddelde leeftijd: ${stats.averageAge} jaar`, 20, statsY + 30);
      
      // Topics section
      doc.setFontSize(14);
      doc.text('Populaire Onderwerpen', 20, statsY + 50);
      
      let topicY = statsY + 65;
      Object.entries(stats.topTopics)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .forEach(([topic, count], index) => {
          doc.setFontSize(9);
          doc.text(`${index + 1}. ${topic}: ${count} keer gekozen`, 20, topicY);
          topicY += 10;
        });

      // Add new page for detailed responses
      doc.addPage();
      
      // Detailed responses table
      doc.setFontSize(16);
      doc.text('Gedetailleerde Antwoorden', 20, 20);
      
      // Table headers
      doc.setFontSize(9);
      const startY = 35;
      const rowHeight = 15;
      let currentY = startY;
      
      // Headers
      doc.setFont(undefined, 'bold');
      doc.text('Naam', 15, currentY);
      doc.text('Leeftijd', 45, currentY);
      doc.text('Met wie', 70, currentY);
      doc.text('Onderwerp', 105, currentY);
      doc.text('Gevoel Voor/Na', 140, currentY);
      doc.text('Actie & Result', 175, currentY);
      currentY += rowHeight;
      
      // Draw header line
      doc.line(10, currentY - 5, 200, currentY - 5);
      
      // Table rows
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      
      responses.forEach((response, index) => {
        if (currentY > 260) { // New page if needed
          doc.addPage();
          currentY = 30;
          
          // Repeat headers on new page
          doc.setFont(undefined, 'bold');
          doc.setFontSize(9);
          doc.text('Naam', 15, currentY);
          doc.text('Leeftijd', 45, currentY);
          doc.text('Met wie', 70, currentY);
          doc.text('Onderwerp', 105, currentY);
          doc.text('Gevoel Voor/Na', 140, currentY);
          doc.text('Actie & Result', 175, currentY);
          currentY += rowHeight;
          doc.line(10, currentY - 5, 200, currentY - 5);
          doc.setFont(undefined, 'normal');
          doc.setFontSize(8);
        }
        
        // Row data
        doc.text(response.name || '', 15, currentY);
        doc.text(response.age || '', 45, currentY);
        doc.text(response.visitingWith || '', 70, currentY);
        doc.text(response.mostImportantTopic || '', 105, currentY);
        doc.text(`${response.feelingBefore || '-'}→${response.feelingAfter || '-'}`, 140, currentY);
        doc.text(`${response.actionChoice || '-'}`, 175, currentY);
        
        // Second line for result if it exists
        if (response.result) {
          currentY += 8;
          doc.setFontSize(7);
          const resultText = response.result.length > 40 ? response.result.substring(0, 40) + '...' : response.result;
          doc.text(resultText, 15, currentY);
          doc.setFontSize(8);
        }
        
        currentY += rowHeight;
        
        // Light separator line
        if (index < responses.length - 1) {
          doc.setDrawColor(220, 220, 220);
          doc.line(10, currentY - 5, 200, currentY - 5);
          doc.setDrawColor(0, 0, 0);
        }
      });

      console.log('PDF generation completed, saving file');
      
      // Save the PDF
      doc.save(`museum-dashboard-rapport-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "PDF Rapport Gedownload",
        description: "Gedetailleerd dashboard rapport met statistieken en tabellen",
      });
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Fout",
        description: "Er is een fout opgetreden bij het genereren van de PDF",
        variant: "destructive",
      });
    }
  };

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
                      <div key={action} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                          {actionData?.icon || '❓'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{actionData?.label || action}</div>
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

        {/* Before vs After Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Gevoel Verandering</CardTitle>
              <CardDescription>Voor vs Na tentoonstelling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.feelingChanges.map((change, index) => {
                  const topicData = TOPICS[change.topic as keyof typeof TOPICS];
                  const changeColor = change.change >= 0 ? 'text-green-600' : 'text-red-600';
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
                      >
                        {topicData?.icon || '❓'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{change.topic}</div>
                        <div className="text-sm text-gray-500">
                          {change.before} → {change.after}
                        </div>
                      </div>
                      <div className={`font-bold ${changeColor}`}>
                        {change.change >= 0 ? '+' : ''}{change.change}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vertrouwen Verandering</CardTitle>
              <CardDescription>Voor vs Na tentoonstelling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.confidenceChanges.map((change, index) => {
                  const topicData = TOPICS[change.topic as keyof typeof TOPICS];
                  const changeColor = change.change >= 0 ? 'text-green-600' : 'text-red-600';
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
                      >
                        {topicData?.icon || '❓'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{change.topic}</div>
                        <div className="text-sm text-gray-500">
                          {change.before} → {change.after}
                        </div>
                      </div>
                      <div className={`font-bold ${changeColor}`}>
                        {change.change >= 0 ? '+' : ''}{change.change}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export and Reset Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Export & Reset
            </CardTitle>
            <CardDescription>
              Download CSV + PDF rapport met alle antwoorden en reset daarna alle data. Nieuwe antwoorden worden als nieuw gezien.
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
                      <FileText className="mr-2 h-4 w-4" />
                      <Trash2 className="mr-2 h-4 w-4" />
                      Export CSV + PDF & Reset ({responses.length})
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  ⚠️ Downloadt CSV + PDF rapport, daarna verwijdert ALLE data permanent
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
      </div>
    </div>
  );
}