#!/usr/bin/env python3
"""
Auto-generate translations for all 17 languages
Copies new translation keys from English to all other languages
"""

new_keys = """  'nav.ai_images': 'AI Images',
  'nav.ai_video': 'AI Video',
  'nav.social': 'Social',
  'common.download': 'Download',
  'common.connect': 'Connect',
  'common.disconnect': 'Disconnect',
  'common.generate': 'Generate',
  'common.preview': 'Preview',
  'social.title': 'Social Media Accounts',
  'social.subtitle': 'Connect your social media accounts to publish content',
  'social.connected_accounts': 'Connected Accounts',
  'social.connect_new': 'Connect New Platform',
  'social.connected': 'Connected',
  'social.click_to_connect': 'Click to connect',
  'social.disconnect_confirm': 'Are you sure you want to disconnect this account?',
  'social.disconnect_failed': 'Failed to disconnect account',
  'ai_image.title': '🎨 AI Image Generator',
  'ai_image.subtitle': 'Create stunning visuals with DALL-E 3',
  'ai_image.prompt_label': 'Prompt',
  'ai_image.prompt_placeholder': 'Describe the image you want to create...',
  'ai_image.style_label': 'Style',
  'ai_image.size_label': 'Size',
  'ai_image.generate_button': 'Generate Image',
  'ai_image.generating': 'Generating...',
  'ai_image.generated_images': 'Generated Images',
  'ai_image.no_images': 'No images generated yet',
  'ai_image.no_images_desc': 'Enter a prompt above to get started',
  'ai_image.styles.photorealistic': 'Photorealistic',
  'ai_image.styles.artistic': 'Artistic',
  'ai_image.styles.minimalist': 'Minimalist',
  'ai_image.styles.vibrant': 'Vibrant',
  'ai_image.styles.professional': 'Professional',
  'ai_video.title': '🎬 AI Video Generator',
  'ai_video.subtitle': 'Create Reels & TikTok videos with AI',
  'ai_video.script_label': 'Video Script',
  'ai_video.script_placeholder': 'Enter your video script...',
  'ai_video.duration_label': 'Duration',
  'ai_video.style_label': 'Style',
  'ai_video.generate_button': 'Generate Video',
  'ai_video.generating': 'Generating...',
  'ai_video.preview_label': 'Preview',
  'ai_video.preview_placeholder': 'Video will appear here',
  'ai_video.styles.realistic': 'Realistic',
  'ai_video.styles.animated': 'Animated',
  'ai_video.styles.cinematic': 'Cinematic',"""

print("Copy this block after 'common.edit': 'xxx', in EACH language section:")
print(new_keys)
print("\nFor non-English languages, keep English text (will be translated later if needed)")
