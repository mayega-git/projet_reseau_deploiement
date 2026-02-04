import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { GlobalStateProvider } from '@/context/GlobalStateContext';
import { Toaster } from 'sonner';
import { getCurrentUser } from '@/actions/auth';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'LetsGo Blog And Podcast',
  description: 'LetsGo Blog And Podcast',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pre-load user on the server so the AuthProvider gets initial state
  // without needing localStorage or useEffect hydration.
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <AuthProvider initialUser={user}>
          <GlobalStateProvider>
            <main>{children}</main>
            <Toaster />
          </GlobalStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
