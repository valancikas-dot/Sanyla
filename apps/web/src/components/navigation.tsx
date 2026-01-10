'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSelector } from '@/lib/i18n/LanguageSelector';
import Image from 'next/image';

interface NavProps {
  projectId?: string;
}

export function ProjectNav({ projectId }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  if (!projectId) return null;

  const navItems = [
    { label: t('nav.overview'), path: `/project/${projectId}/overview` },
    { label: t('nav.generate'), path: `/project/${projectId}/generate` },
    { label: t('nav.content'), path: `/project/${projectId}/content` },
    { label: '🎬 AI Reklamos', path: `/project/${projectId}/ads` },
    { label: '🎨 AI Images', path: `/project/${projectId}/ai-image` },
    { label: '📹 AI Video', path: `/project/${projectId}/ai-video` },
    { label: '📱 Social', path: `/project/${projectId}/social-accounts` },
    { label: t('nav.schedule'), path: `/project/${projectId}/schedule` },
    { label: t('nav.analytics'), path: `/project/${projectId}/analytics` },
    { label: t('nav.brand_kit'), path: `/project/${projectId}/brand-kit` },
  ];

  return (
    <nav className="bg-white border-b mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={pathname === item.path ? 'default' : 'ghost'}
              onClick={() => router.push(item.path)}
              className="whitespace-nowrap"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function MainNav() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity" 
          onClick={() => router.push('/dashboard')}
        >
          <Image 
            src="/logo.png" 
            alt="Sanyla" 
            width={48} 
            height={48}
            className="object-contain drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold drop-shadow-md">Sanyla</h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            {t('nav.logout')}
          </Button>
        </div>
      </div>
    </nav>
  );
}
