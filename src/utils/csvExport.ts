import { TournamentApplication } from '../types/tournament';

export function exportApplicationsToCSV(applications: TournamentApplication[]): boolean {
  if (applications.length === 0) {
    return false;
  }

  let csvContent = '\uFEFF접수번호,부수,종목,소속,선수1이름,선수1연락처,선수2이름,선수2연락처,입금자명,상태,신청일시\n';

  applications.forEach((a) => {
    const row = [
      a.regNumber,
      a.division,
      a.eventType || '혼합복식',
      `"${(a.clubName || '').replace(/"/g, '""')}"`,
      `"${(a.player1Name || '').replace(/"/g, '""')}"`,
      `"${(a.player1Phone || '').replace(/"/g, '""')}"`,
      `"${(a.player2Name || '').replace(/"/g, '""')}"`,
      `"${(a.player2Phone || '').replace(/"/g, '""')}"`,
      `"${(a.depositorName || '').replace(/"/g, '""')}"`,
      `"${(a.status || '').replace(/"/g, '""')}"`,
      `"${(a.createdAt || '').replace(/"/g, '""')}"`,
    ];
    csvContent += row.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const today = new Date().toISOString().slice(0, 10);
  link.download = `2027_피클볼대회_참가신청목록_${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
