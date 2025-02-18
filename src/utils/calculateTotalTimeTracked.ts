import { TTimeEntrie } from 'src/types/timeEntries';

export function calculateTotalTimeTracked(timeEntries: TTimeEntrie[]): string {
  const totalTimeTracked = timeEntries
    .filter((entry) => entry.startTime && entry.endTime)
    .reduce((total, entry) => {
      const start = new Date(entry.startTime).getTime();
      const end = new Date(entry.endTime).getTime();
      return total + (end - start);
    }, 0);

  const totalTimeInHours = Math.floor(totalTimeTracked / 1000 / 60 / 60);
  const totalTimeInMinutes = Math.floor((totalTimeTracked / 1000 / 60) % 60);
  return `${totalTimeInHours}hr:${totalTimeInMinutes.toString().padStart(2, '0')}min`;
}
