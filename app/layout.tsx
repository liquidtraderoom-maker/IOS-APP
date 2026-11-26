import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ApexHQ Virtual Office',
  description: 'Your AI-powered virtual office for hands-free revenue generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-apex-dark min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
