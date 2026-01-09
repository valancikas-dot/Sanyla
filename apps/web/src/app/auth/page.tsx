'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSelector } from '@/lib/i18n/LanguageSelector';

export default function AuthPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login({ email, password });
        localStorage.setItem('token', res.data.token);
      } else {
        const res = await api.signup({ email, password, name });
        localStorage.setItem('token', res.data.token);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.error.login'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    setLoading(true);

    try {
      const res = await api.login({ 
        email: 'demo@example.com', 
        password: 'demo123' 
      });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.demo_failed'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Language Selector */}
          <div className="flex justify-end">
            <LanguageSelector />
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="Sanyla" 
                width={48} 
                height={48}
                className="object-contain"
              />
            </div>
            <span className="text-3xl font-bold text-gradient">Sanyla</span>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              {isLogin ? t('auth.welcome_back') : t('auth.create_account')}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? t('auth.login_subtitle') : t('auth.signup_subtitle')}
            </p>
          </div>

          {/* Form */}
          <div className="card-glass p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('auth.name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('auth.name_placeholder')}
                      className="input-modern pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.email_placeholder')}
                    required
                    className="input-modern pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.password_placeholder')}
                    required
                    className="input-modern pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded-xl">
                  <p className="text-sm text-accent-red">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full group"
              >
                {loading ? (
                  t('auth.loading')
                ) : (
                  <>
                    {isLogin ? t('auth.login_button') : t('auth.signup_button')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">{t('auth.or')}</span>
              </div>
            </div>

            {/* Demo Login */}
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn-secondary w-full"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t('auth.demo_login')}
            </button>

            {/* Toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                {isLogin ? t('auth.no_account') : t('auth.have_account')}
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('auth.back_home')}
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-accent-blue/10 to-background p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">
              AI marketingo <span className="text-gradient">autopilot</span> verslui
            </h2>
            <p className="text-lg text-muted-foreground">
              Generuokite strategijas, postus, Reels scenarijus 17 kalbų. 
              Vieną kartą sukonfigūruokite — visam mėnesiui turite turinį.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-surface/50 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">GPT-4 Turbo</h3>
                <p className="text-sm text-muted-foreground">
                  Naujausia OpenAI technologija generuoja kokybišką turinį
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-surface/50 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-10 h-10 bg-accent-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">17 kalbų palaikymas</h3>
                <p className="text-sm text-muted-foreground">
                  Lietuvių, anglų, rusų, vokiečių, ispanų ir dar 12 kalbų
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-surface/50 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Saugumas</h3>
                <p className="text-sm text-muted-foreground">
                  AES-256 šifravimas, JWT autentifikacija, SOC 2 Type II
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
