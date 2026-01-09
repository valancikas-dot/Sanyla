import { MainNav, ProjectNav } from '@/components/navigation';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  return (
    <>
      <MainNav />
      <ProjectNav projectId={params.projectId} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
}
