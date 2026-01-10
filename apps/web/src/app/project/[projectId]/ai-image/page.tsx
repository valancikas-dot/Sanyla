'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';

type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  metadata?: any;
};

export default function AIImageGeneratorPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [size, setSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024');
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const styles = [
    { id: 'photorealistic', name: 'Photorealistic', icon: '📸' },
    { id: 'artistic', name: 'Artistic', icon: '🎨' },
    { id: 'minimalist', name: 'Minimalist', icon: '⚪' },
    { id: 'vibrant', name: 'Vibrant', icon: '🌈' },
    { id: 'professional', name: 'Professional', icon: '💼' },
  ];

  const sizes = [
    { id: '1024x1024', name: 'Square (1:1)', desc: 'Instagram, Facebook' },
    { id: '1792x1024', name: 'Landscape (16:9)', desc: 'YouTube, LinkedIn' },
    { id: '1024x1792', name: 'Portrait (9:16)', desc: 'Stories, Reels' },
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setGenerating(true);
    try {
      const response = await api.post('/media/generate/image', {
        prompt,
        projectId,
        style,
        size,
      });

      setGeneratedImages([response.data, ...generatedImages]);
      setPrompt(''); // Clear prompt after generation
    } catch (error: any) {
      console.error('Failed to generate image:', error);
      alert(error.response?.data?.message || 'Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🎨 AI Image Generator</h1>
        <p className="text-gray-400">Create stunning visuals for your posts with DALL-E 3</p>
      </div>

      {/* Generator Form */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
        <div className="mb-6">
          <label className="block text-white font-semibold mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create... e.g., 'A modern office workspace with laptop and coffee, minimalist style, soft lighting'"
            className="w-full bg-gray-900 text-white rounded-lg p-4 border border-gray-700 focus:border-purple-500 focus:outline-none min-h-[120px]"
            disabled={generating}
          />
        </div>

        {/* Style Selection */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Style</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                disabled={generating}
                className={`p-4 rounded-lg border-2 transition-all ${
                  style === s.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-sm text-white font-medium">{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">Size</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSize(s.id as any)}
                disabled={generating}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  size === s.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                }`}
              >
                <div className="text-white font-medium mb-1">{s.name}</div>
                <div className="text-sm text-gray-400">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={generating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating...
            </span>
          ) : (
            'Generate Image'
          )}
        </button>
      </div>

      {/* Generated Images Grid */}
      {generatedImages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Generated Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
              >
                <div className="relative aspect-square bg-gray-900">
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{image.prompt}</p>
                  <button
                    onClick={() =>
                      downloadImage(
                        image.url,
                        `sanyla-${image.id}.png`
                      )
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {generatedImages.length === 0 && !generating && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-gray-400 text-lg">No images generated yet</p>
          <p className="text-gray-500 text-sm">Enter a prompt above to get started</p>
        </div>
      )}
    </div>
  );
}
