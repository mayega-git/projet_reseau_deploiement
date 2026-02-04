export const formatHumanReadableDuration = (
  timeValue: number | string | undefined | null
): string => {
  if (timeValue === undefined || timeValue === null || timeValue === '') {
    return '';
  }

  let hh = 0,
    mm = 0,
    ss = 0;

  if (typeof timeValue === 'string' && timeValue.includes(':')) {
    // Split into hours, minutes, and seconds from "hh:mm:ss"
    const parts = timeValue.split(':').map(Number);
    if (parts.length === 3) {
      [hh, mm, ss] = parts;
    } else if (parts.length === 2) {
      [mm, ss] = parts;
    } else if (parts.length === 1) {
      [ss] = parts;
    }
  } else {
    // Assume it's a number representing seconds
    const totalSeconds = Number(timeValue);
    if (isNaN(totalSeconds)) return '';

    hh = Math.floor(totalSeconds / 3600);
    mm = Math.floor((totalSeconds % 3600) / 60);
    ss = Math.floor(totalSeconds % 60);
  }

  let result = '';

  if (hh > 0) result += `${hh} ${hh === 1 ? 'hour' : 'hours'} `;
  if (mm > 0) result += `${mm} ${mm === 1 ? 'minute' : 'minutes'} `;
  if (ss > 0) result += `${ss} ${ss === 1 ? 'second' : 'seconds'}`;

  return result.trim(); // Remove trailing space
};
