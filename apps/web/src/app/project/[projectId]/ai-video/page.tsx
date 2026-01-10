'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AIVideoGeneratorPage() {
  const { t } = useLanguage();
  const params = useParams();
  const projectId = params.projectId as string;
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('realistic');
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const generateVideo = async () => {
    if (!script.trim()) {
      alert(`${t('common.please_enter')} ${t('ai_video.script_label').toLowerCase()}`);
      return;
    }

    setGenerating(true);
    try {
      const response = await api.post('/media/generate/video', {
        script,
        projectId,
        duration,
        style,
      });

      setVideoUrl(response.data.url);
    } catch (error: any) {
      console.error('Failed to generate video:', error);
      alert(error.response?.data?.message || t('common.failed_generate'));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('ai_video.title')}</h1>
        <p className="text-gray-400">{t('ai_video.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              {t('ai_video.script_label')}
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder={t('ai_video.script_placeholder')}
              className="w-full bg-gray-900 text-white rounded-lg p-4 border border-gray-700 focus:border-purple-500 focus:outline-none min-h-[200px]"
              disabled={generating}
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              {t('ai_video.duration_label')}: {duration}s
            </label>
            <input
              type="range"
              min="5"
              max="60"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
              disabled={generating}
            />
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              {t('ai_video.style_label')}
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-700"
              disabled={generating}
            >
              <option value="realistic">{t('ai_video.styles.realistic')}</option>
              <option value="animated">{t('ai_video.styles.animated')}</option>
              <option value="cinematic">{t('ai_video.styles.cinematic')}</option>
            </select>
          </div>

          <button
            onClick={generateVideo}
            disabled={generating || !script.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all"
          >
            {generating ? t('ai_video.generating') : t('ai_video.generate_button')}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">{t('ai_video.preview_label')}</h3>
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg"
            />
          ) : (
            <div className="aspect-[9/16] bg-gray-900 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">{t('ai_video.preview_placeholder')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
