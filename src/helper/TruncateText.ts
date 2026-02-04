/* eslint-disable @typescript-eslint/no-unused-vars */
const maxLength: number = 100;
const maxLengthTitle: number = 40;
export const truncateText = (text: string | null | undefined): string => {
  if (!text) return ''; // retourne une chaîne vide si text est null/undefined
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const truncateTitleText = (text: string): string => {
  if (text.length <= maxLengthTitle) return text;
  return text.slice(0, maxLengthTitle) + '...';
};
