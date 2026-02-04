// app/(protected)/layout.tsx
// Route protection is now handled by middleware.ts.
// This layout is a simple pass-through.

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
