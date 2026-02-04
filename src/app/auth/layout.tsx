// app/auth/layout.tsx
// Redirect for already-authenticated users is now handled by middleware.ts.
// This layout is a simple pass-through.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
