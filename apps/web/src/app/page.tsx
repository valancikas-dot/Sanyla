'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Zap, Calendar, TrendingUp, Globe, Shield } from 'lucide-react';
import { LanguageSelector } from '@/lib/i18n/LanguageSelector';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@marketing-autopilot/shared';

// Homepage translations for all languages
const homeTranslations: Record<Language, {
  badge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  subtitle: string;
  startButton: string;
  demoButton: string;
  noCredit: string;
  gpt4: string;
  languages17: string;
  pricing: string;
}> = {
  LITHUANIAN: {
    badge: 'AI Marketingo Autopilotas',
    heroTitle1: 'Generuok',
    heroTitle2: '30 dienų',
    heroTitle3: 'marketingo planą per 30 sekundžių',
    subtitle: 'AI pagalba sukurk strategijas, kalendorius, postus ir Reels scenarijus. Palaikome 17 kalbų — nuo lietuvių iki ispanų.',
    startButton: 'Pradėti Nemokamai',
    demoButton: 'Žiūrėti Demo',
    noCredit: 'Jokių kreditinių kortelių',
    gpt4: 'GPT-4 Turbo AI',
    languages17: '17 kalbų palaikymas',
    pricing: 'Kainoraštis',
  },
  ENGLISH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Generate a',
    heroTitle2: '30-day',
    heroTitle3: 'marketing plan in 30 seconds',
    subtitle: 'AI creates strategies, calendars, posts, and Reels scripts. Supporting 17 languages — from Lithuanian to Spanish.',
    startButton: 'Start Free',
    demoButton: 'Watch Demo',
    noCredit: 'No credit card required',
    gpt4: 'GPT-4 Turbo AI',
    languages17: '17 languages support',
    pricing: 'Pricing',
  },
  RUSSIAN: {
    badge: 'AI Маркетинг Автопилот',
    heroTitle1: 'Создайте',
    heroTitle2: '30-дневный',
    heroTitle3: 'маркетинг-план за 30 секунд',
    subtitle: 'AI создает стратегии, календари, посты и сценарии Reels. Поддержка 17 языков — от литовского до испанского.',
    startButton: 'Начать бесплатно',
    demoButton: 'Смотреть демо',
    noCredit: 'Кредитная карта не требуется',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Поддержка 17 языков',
    pricing: 'Цены',
  },
  POLISH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Wygeneruj',
    heroTitle2: '30-dniowy',
    heroTitle3: 'plan marketingowy w 30 sekund',
    subtitle: 'AI tworzy strategie, kalendarze, posty i scenariusze Reels. Obsługa 17 języków — od litewskiego do hiszpańskiego.',
    startButton: 'Rozpocznij za darmo',
    demoButton: 'Zobacz demo',
    noCredit: 'Nie wymaga karty kredytowej',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Obsługa 17 języków',
    pricing: 'Cennik',
  },
  GERMAN: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Erstellen Sie einen',
    heroTitle2: '30-Tage',
    heroTitle3: 'Marketingplan in 30 Sekunden',
    subtitle: 'AI erstellt Strategien, Kalender, Posts und Reels-Skripte. Unterstützung für 17 Sprachen — von Litauisch bis Spanisch.',
    startButton: 'Kostenlos starten',
    demoButton: 'Demo ansehen',
    noCredit: 'Keine Kreditkarte erforderlich',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Unterstützung für 17 Sprachen',
    pricing: 'Preise',
  },
  FRENCH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Générez un plan',
    heroTitle2: 'marketing de 30 jours',
    heroTitle3: 'en 30 secondes',
    subtitle: 'L\'IA crée des stratégies, calendriers, posts et scripts Reels. Support de 17 langues — du lituanien à l\'espagnol.',
    startButton: 'Commencer gratuitement',
    demoButton: 'Voir la démo',
    noCredit: 'Aucune carte de crédit requise',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Support de 17 langues',
    pricing: 'Tarifs',
  },
  SPANISH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Genera un plan',
    heroTitle2: 'de marketing de 30 días',
    heroTitle3: 'en 30 segundos',
    subtitle: 'AI crea estrategias, calendarios, posts y guiones de Reels. Soporte para 17 idiomas — del lituano al español.',
    startButton: 'Comenzar gratis',
    demoButton: 'Ver demo',
    noCredit: 'No se requiere tarjeta de crédito',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Soporte para 17 idiomas',
    pricing: 'Precios',
  },
  // Other languages use English as fallback
  LATVIAN: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Izveidojiet',
    heroTitle2: '30 dienu',
    heroTitle3: 'mārketinga plānu 30 sekundēs',
    subtitle: 'AI izveido stratēģijas, kalendārus, ierakstus un Reels skriptus. Atbalsta 17 valodas.',
    startButton: 'Sākt bez maksas',
    demoButton: 'Skatīt demo',
    noCredit: 'Nav nepieciešama kredītkarte',
    gpt4: 'GPT-4 Turbo AI',
    languages17: '17 valodu atbalsts',
    pricing: 'Cenas',
  },
  ESTONIAN: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Generate a',
    heroTitle2: '30-day',
    heroTitle3: 'marketing plan in 30 seconds',
    subtitle: 'AI creates strategies, calendars, posts, and Reels scripts. Supporting 17 languages.',
    startButton: 'Start Free',
    demoButton: 'Watch Demo',
    noCredit: 'No credit card required',
    gpt4: 'GPT-4 Turbo AI',
    languages17: '17 languages support',
    pricing: 'Pricing',
  },
  ITALIAN: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Genera un piano',
    heroTitle2: 'di marketing di 30 giorni',
    heroTitle3: 'in 30 secondi',
    subtitle: 'L\'AI crea strategie, calendari, post e script Reels. Supporto per 17 lingue.',
    startButton: 'Inizia gratis',
    demoButton: 'Guarda la demo',
    noCredit: 'Nessuna carta di credito richiesta',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Supporto per 17 lingue',
    pricing: 'Prezzi',
  },
  PORTUGUESE: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Gere um plano',
    heroTitle2: 'de marketing de 30 dias',
    heroTitle3: 'em 30 segundos',
    subtitle: 'A IA cria estratégias, calendários, posts e roteiros de Reels. Suporte para 17 idiomas.',
    startButton: 'Começar grátis',
    demoButton: 'Ver demo',
    noCredit: 'Não é necessário cartão de crédito',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Suporte para 17 idiomas',
    pricing: 'Preços',
  },
  DUTCH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Genereer een',
    heroTitle2: '30-daags',
    heroTitle3: 'marketingplan in 30 seconden',
    subtitle: 'AI creëert strategieën, kalenders, posts en Reels-scripts. Ondersteuning voor 17 talen.',
    startButton: 'Gratis starten',
    demoButton: 'Demo bekijken',
    noCredit: 'Geen creditcard vereist',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Ondersteuning voor 17 talen',
    pricing: 'Prijzen',
  },
  SWEDISH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Skapa en',
    heroTitle2: '30-dagars',
    heroTitle3: 'marknadsplan på 30 sekunder',
    subtitle: 'AI skapar strategier, kalendrar, inlägg och Reels-manus. Stöd för 17 språk.',
    startButton: 'Börja gratis',
    demoButton: 'Se demo',
    noCredit: 'Inget kreditkort krävs',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Stöd för 17 språk',
    pricing: 'Priser',
  },
  NORWEGIAN: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Generer en',
    heroTitle2: '30-dagers',
    heroTitle3: 'markedsplan på 30 sekunder',
    subtitle: 'AI lager strategier, kalendere, innlegg og Reels-manus. Støtte for 17 språk.',
    startButton: 'Start gratis',
    demoButton: 'Se demo',
    noCredit: 'Ingen kredittkort nødvendig',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Støtte for 17 språk',
    pricing: 'Priser',
  },
  DANISH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Generer en',
    heroTitle2: '30-dages',
    heroTitle3: 'marketingplan på 30 sekunder',
    subtitle: 'AI skaber strategier, kalendere, opslag og Reels-manuskripter. Support til 17 sprog.',
    startButton: 'Start gratis',
    demoButton: 'Se demo',
    noCredit: 'Intet kreditkort påkrævet',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Support til 17 sprog',
    pricing: 'Priser',
  },
  FINNISH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Luo',
    heroTitle2: '30 päivän',
    heroTitle3: 'markkinointisuunnitelma 30 sekunnissa',
    subtitle: 'Tekoäly luo strategioita, kalentereita, julkaisuja ja Reels-käsikirjoituksia. Tuki 17 kielelle.',
    startButton: 'Aloita ilmaiseksi',
    demoButton: 'Katso demo',
    noCredit: 'Luottokorttia ei tarvita',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Tuki 17 kielelle',
    pricing: 'Hinnat',
  },
  CZECH: {
    badge: 'AI Marketing Autopilot',
    heroTitle1: 'Vytvořte',
    heroTitle2: '30denní',
    heroTitle3: 'marketingový plán za 30 sekund',
    subtitle: 'AI vytváří strategie, kalendáře, příspěvky a scénáře Reels. Podpora 17 jazyků.',
    startButton: 'Začít zdarma',
    demoButton: 'Zobrazit demo',
    noCredit: 'Není vyžadována kreditní karta',
    gpt4: 'GPT-4 Turbo AI',
    languages17: 'Podpora 17 jazyků',
    pricing: 'Ceny',
  },
};

export default function HomePage() {
  const { t, language } = useLanguage();
  const trans = homeTranslations[language] || homeTranslations.ENGLISH;
  
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
                {trans.pricing}
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
              <span className="text-sm font-medium text-primary">{trans.badge}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
              {trans.heroTitle1} <span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{trans.heroTitle2}</span><br />
              {trans.heroTitle3}
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {trans.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth" className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-lg">
                <Zap className="w-5 h-5 mr-2" />
                {trans.startButton}
              </Link>
              <button className="text-lg px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20">
                {trans.demoButton}
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300">{trans.noCredit}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-gray-300">{trans.gpt4}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-gray-300">{trans.languages17}</span>
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
