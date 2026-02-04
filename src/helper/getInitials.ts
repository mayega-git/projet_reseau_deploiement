export const getInitials = (name: string | undefined): string | undefined => {
  if (!name) return undefined;

  const words = name.trim().split(/\s+/); // supprime les espaces en trop

  const firstInitial = words[0]?.[0]?.toUpperCase() ?? '';
  const secondInitial = words[1]?.[0]?.toUpperCase() ?? '';

  const initials = firstInitial + secondInitial;

  return initials || undefined;
};
