import { MainLayout } from '@/components/layout/main-layout';

export default function SpendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}