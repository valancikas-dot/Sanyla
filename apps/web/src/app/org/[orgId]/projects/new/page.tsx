'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LANGUAGES, LANGUAGE_NAMES } from '@marketing-autopilot/shared';

export default function NewProjectPage({ params }: { params: { orgId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    country: '',
    city: '',
    website: '',
    offer: '',
    prices: '',
    targetAudience: '',
    language: 'ENGLISH' as const,
    tone: 'professional',
    brandColors: ['#6F4E37'] as string[],
    competitors: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.createProject(params.orgId, formData);
      alert('Projektas sukurtas sėkmingai!');
      router.push(`/project/${res.data.id}/overview`);
    } catch (error: any) {
      alert(`Nepavyko sukurti projekto: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addColor = () => {
    setFormData({ ...formData, brandColors: [...formData.brandColors, '#000000'] });
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...formData.brandColors];
    newColors[index] = color;
    setFormData({ ...formData, brandColors: newColors });
  };

  const removeColor = (index: number) => {
    const newColors = formData.brandColors.filter((_, i) => i !== index);
    setFormData({ ...formData, brandColors: newColors });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sukurti naują projektą</h1>

        <Card>
          <CardHeader>
            <CardTitle>Projekto informacija</CardTitle>
            <CardDescription>
              Papasakokite apie savo verslą ar produktą, kad sugeneruotume personalizuotą marketingo turinį
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Projekto pavadinimas *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="pvz., Mano kavinė"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Industrija</label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="pvz., Maistas ir gėrimai"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Šalis</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="pvz., Lietuva"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Miestas</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="pvz., Vilnius"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Svetainė</label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Turinio kalba</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {LANGUAGE_NAMES[lang]}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">AI generuos turinį šia kalba</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Ką siūlote?</label>
                <Input
                  value={formData.offer}
                  onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                  placeholder="pvz., Aukščiausios kokybės specialioji kava ir pyragai"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Kainodara</label>
                <Input
                  value={formData.prices}
                  onChange={(e) => setFormData({ ...formData, prices: e.target.value })}
                  placeholder="pvz., €3-€8 už prekę"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tikslinė auditorija</label>
                <Input
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="pvz., Jauni profesionalai 25-40 m. amžiaus"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Brand tonas</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                >
                  <option value="professional">Profesionalus</option>
                  <option value="friendly">Draugiškas</option>
                  <option value="casual">Neformalus</option>
                  <option value="luxury">Prabangus</option>
                  <option value="playful">Žaismingas</option>
                  <option value="authoritative">Autoritetas</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Brand spalvos</label>
                <div className="space-y-2 mt-2">
                  {formData.brandColors.map((color, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-16 h-10 rounded border cursor-pointer"
                      />
                      <Input value={color} onChange={(e) => updateColor(index, e.target.value)} />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeColor(index)}
                      >
                        Šalinti
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addColor}>
                    + Pridėti spalvą
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Konkurentai (neprivaloma)</label>
                <Input
                  value={formData.competitors}
                  onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                  placeholder="pvz., Starbucks, vietinės kavinės"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Kuriama...' : 'Sukurti projektą'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/org/${params.orgId}/projects`)}
                >
                  Atšaukti
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
