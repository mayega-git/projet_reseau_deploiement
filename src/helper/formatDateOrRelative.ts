export const formatDateOrRelative = (dateString: any): string => {
  let inputDate: Date;

  if (Array.isArray(dateString)) {
    // Handle Spring Boot style date arrays [year, month, day, hour, minute, second]
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateString;
    inputDate = new Date(year, month - 1, day, hour, minute, second);
  } else {
    inputDate = new Date(dateString);
  }

  // Check if date is valid
  if (isNaN(inputDate.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();

  // Calculate difference in milliseconds & convert to days
  const diffInMs = now.getTime() - inputDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 1) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;

  // Format date as "DD/MM/YYYY"
  const day = inputDate.getDate().toString().padStart(2, '0');
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = inputDate.getFullYear();

  return `${day}/${month}/${year}`;
};

const result = formatDateOrRelative('2024-09-08T08:45:00.000Z');
console.log('Formatted Date:', result);


