'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Zap, Calendar, TrendingUp, Globe, Shield } from 'lucide-react';
import { LanguageSelector } from '@/lib/i18n/LanguageSelector';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function HomePage() {
  const { t, language } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-cyan-500 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* LogoOnly - Bigger */}
            <Link href="/" className="flex items-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm p-2 shadow-xl hover:scale-105 transition-transform">
                <Image 
                  src="/logo.png" 
                  alt="Sanyla" 
                  width={64} 
                  height={64}
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link href="/pricing" className="px-6 py-2.5 text-white hover:bg-white/10 rounded-lg transition-all font-semibold">
                Pricing
              </Link>
              <Link href="/auth" className="px-6 py-2.5 text-white hover:bg-white/10 rounded-lg transition-all font-semibold">
                {t('auth.login_button')}
              </Link>
              <Link href="/auth" className="px-6 py-2.5 bg-white text-blue-600 hover:bg-white/90 rounded-lg transition-all font-semibold shadow-lg">
                {t('auth.signup_button')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {language === 'ENGLISH' ? 'AI Marketing Autopilot' : 'AI Marketingo Autopilotas'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
              {language === 'ENGLISH' ? (
                <>
                  Generate a <span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">30-day</span><br />
                  marketing plan in <span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">30 seconds</span>
                </>
              ) : (
                <>
                  Generuok <span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">30 dienų</span><br />
                  marketingo planą per <span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">30 sekundžių</span>
                </>
              )}
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {language === 'ENGLISH' 
                ? `AI creates strategies, calendars, posts, and Reels scripts. Supporting 17 languages — from Lithuanian to Spanish.`
                : `AI pagalba sukurk strategijas, kalendorius, postus ir Reels scenarijus. Palaikome 17 kalbų — nuo lietuvių iki ispanų.`
              }
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth" className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-lg">
                <Zap className="w-5 h-5 mr-2" />
                {language === 'ENGLISH' ? 'Start Free' : 'Pradėti Nemokamai'}
              </Link>
              <button className="text-lg px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20">
                {language === 'ENGLISH' ? 'Watch Demo' : 'Žiūrėti Demo'}
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300">Jokių kreditinių kortelių</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-gray-300">GPT-4 Turbo AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-gray-300">17 kalbų palaikymas</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl" />
            <div className="relative bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto" />
                  <p className="text-gray-300">Platformos peržiūra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Viskas, ko reikia <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">marketingui</span></h2>
            <p className="text-xl text-gray-300">5 AI generatoriai. Viena platforma. Begalinės galimybės.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">30 dienų strategija</h3>
              <p className="text-gray-400">
                AI sugeneruoja pilną mėnesio planą su tikslais, taktikomis ir metrikomis.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Turinio kalendorius</h3>
              <p className="text-gray-400">
                4 savaičių kalendorius su post temomis ir platformų rekomendacijomis.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">20 socialinių postų</h3>
              <p className="text-gray-400">
                Paruošti tekstai su hashtag'ais, emojais ir CTA. Copy-paste ir publikuok.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">8 Reels scenarijai</h3>
              <p className="text-gray-400">
                Virusiniai scenarijai su hook'ais, scenomis ir voiceover tekstais.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Savaitiniai insights</h3>
              <p className="text-gray-400">
                AI analizuoja performancą ir pasiūlo, kaip pagerinti rezultatus.
              </p>
            </div>

            <div className="card-feature group">
              <div className="w-12 h-12 bg-accent-blue/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-accent-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">17 kalbų palaikymas</h3>
              <p className="text-muted-foreground">
                Generuok turinį lietuvių, anglų, rusų, vokiečių ir dar 13 kalbų.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">30s</div>
              <div className="text-gray-300">Strategija sugeneruojama</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">17</div>
              <div className="text-gray-300">Palaikomų kalbų</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">5</div>
              <div className="text-gray-300">AI generatoriai</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 text-center space-y-8 p-12 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Pasiruošęs <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">automatizuoti</span><br />
              savo marketingą?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Prisijunk nemokamai ir sugeneruok savo pirmą 30 dienų strategiją per 30 sekundžių.
            </p>
            <Link href="/auth" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-lg px-8 py-4 inline-flex items-center rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Pradėti Dabar
            </Link>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Jokių kreditinių kortelių nereikia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="Sanyla" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-gray-400">
              <span>© 2026 Sanyla. AI Marketing Autopilot.</span>
              <span className="hidden md:inline">•</span>
              <span className="text-cyan-400 font-medium">by Vilca</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
