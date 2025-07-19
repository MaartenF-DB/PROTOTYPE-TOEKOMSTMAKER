import { useQuery } from '@tanstack/react-query';
// overige imports blijven hetzelfde

export default function Dashboard() {
  const { data: responses = [], isLoading } = useQuery<SurveyResponse[]>({
    queryKey: ['/api/survey-responses'],
    select: (data) => data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });

  const [initialData, setInitialData] = useState(responses);

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

    // Reset de data na het exporteren
    setInitialData([]);  // reset de initial data
  };

  // andere logica blijft gelijk

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* rest van de component blijft gelijk */}
    </div>
  );
}