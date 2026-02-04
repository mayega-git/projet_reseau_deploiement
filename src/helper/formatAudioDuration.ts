export const formatHumanReadableDuration = (timeNumber: number): string => {
  // Convert number to string and ensure it's formatted as hh:mm:ss
  const timeString = timeNumber.toString();

  // Split into hours, minutes, and seconds
  const [hh, mm, ss] = timeString.split(':').map(Number);

  let result = '';

  if (hh > 0) result += `${hh} ${hh === 1 ? 'hour' : 'hours'} `;
  if (mm > 0) result += `${mm} ${mm === 1 ? 'minute' : 'minutes'} `;
  if (ss > 0) result += `${ss} ${ss === 1 ? 'second' : 'seconds'}`;

  return result.trim(); // Remove trailing space
};
