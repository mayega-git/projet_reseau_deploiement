export const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  if (wordCount === 0) {
    return 0;
  }

  const minutes = Math.ceil(wordCount / wordsPerMinute);

  // Update state correctly
  return minutes;
};
