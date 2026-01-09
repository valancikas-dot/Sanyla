import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Zap, Calendar, TrendingUp, Globe, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="Sanyla" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-gradient">Sanyla</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth" className="btn-ghost">
                Prisijungti
              </Link>
              <Link href="/auth" className="btn-primary">
                Pradėti Nemokamai
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
              <span className="text-sm font-medium text-primary">AI Marketingo Autopilotas</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Generuok <span className="text-gradient">30 dienų</span><br />
              marketingo planą per <span className="text-gradient">30 sekundžių</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI pagalba sukurk strategijas, kalendorius, postus ir Reels scenarijus. 
              Palaikome <span className="text-primary font-semibold">17 kalbų</span> — 
              nuo lietuvių iki ispanų.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/auth" className="btn-primary text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                Pradėti Nemokamai
              </Link>
              <button className="btn-ghost text-lg px-8 py-4">
                Žiūrėti Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                <span>Jokių kreditinių kortelių</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
                <span>GPT-4 Turbo AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>17 kalbų palaikymas</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-accent opacity-20 blur-3xl" />
            <div className="relative glass-card p-4">
              <div className="aspect-video bg-surface rounded-xl border border-white/10 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Sparkles className="w-16 h-16 text-primary mx-auto" />
                  <p className="text-muted-foreground">Platformos peržiūra</p>
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
            <h2 className="text-4xl font-bold mb-4">Viskas, ko reikia <span className="text-gradient">marketingui</span></h2>
            <p className="text-xl text-muted-foreground">5 AI generatoriai. Viena platforma. Begalinės galimybės.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-feature group">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">30 dienų strategija</h3>
              <p className="text-muted-foreground">
                AI sugeneruoja pilną mėnesio planą su tikslais, taktikomis ir metrikomis.
              </p>
            </div>

            <div className="card-feature group">
              <div className="w-12 h-12 bg-accent-blue/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-accent-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Turinio kalendorius</h3>
              <p className="text-muted-foreground">
                4 savaičių kalendorius su post temomis ir platformų rekomendacijomis.
              </p>
            </div>

            <div className="card-feature group">
              <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-accent-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">20 socialinių postų</h3>
              <p className="text-muted-foreground">
                Paruošti tekstai su hashtag'ais, emojais ir CTA. Copy-paste ir publikuok.
              </p>
            </div>

            <div className="card-feature group">
              <div className="w-12 h-12 bg-accent-orange/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">8 Reels scenarijai</h3>
              <p className="text-muted-foreground">
                Virusiniai scenarijai su hook'ais, scenomis ir voiceover tekstais.
              </p>
            </div>

            <div className="card-feature group">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Savaitiniai insights</h3>
              <p className="text-muted-foreground">
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
      <section className="py-20 px-6 bg-surface/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="text-5xl font-black text-gradient">30s</div>
              <div className="text-muted-foreground">Strategija sugeneruojama</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-black text-gradient">17</div>
              <div className="text-muted-foreground">Palaikomų kalbų</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-black text-gradient">5</div>
              <div className="text-muted-foreground">AI generatoriai</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="card-glass text-center space-y-8 p-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Pasiruošęs <span className="text-gradient">automatizuoti</span><br />
              savo marketingą?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Prisijunk nemokamai ir sugeneruok savo pirmą 30 dienų strategiją per 30 sekundžių.
            </p>
            <Link href="/auth" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Pradėti Dabar
            </Link>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
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
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="Sanyla" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gradient">Sanyla</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 Sanyla. AI Marketing Autopilot.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
