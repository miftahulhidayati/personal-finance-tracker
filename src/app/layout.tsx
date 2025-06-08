import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinanceFlow - Personal Finance Tracker',
  description: 'Modern financial dashboard with intelligent insights and clean design',
  keywords: ['finance', 'budgeting', 'expense-tracking', 'dashboard', 'money-management'],
  authors: [{ name: 'FinanceFlow Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#c6ef4e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className="h-full antialiased bg-neutral-50 text-neutral-900 font-sans"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}