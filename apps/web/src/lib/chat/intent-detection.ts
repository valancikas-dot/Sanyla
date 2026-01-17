/**
 * Deterministic intent detection for chat messages
 * NO LLM - pure keyword-based routing
 */

export type ChatIntent = 
  | 'GENERATE_7_DAY_CAMPAIGN'
  | 'CHAT';

/**
 * Detect user intent from message text
 * Returns deterministic intent based on keywords
 */
export function detectIntent(message: string): ChatIntent {
  const normalized = message.toLowerCase().trim();
  
  // Campaign intent keywords (LT + EN)
  const campaignKeywords = [
    '7 dien',        // 7 dienų
    '7-dien',        // 7-dienų
    'septynių dien', // septynių dienų
    'savaitės',      // savaitės
    'savaites',      // savaites (no diacritic)
    'kampanij',      // kampanija, kampaniją
    '7 day',         // 7 day, 7-day
    '7-day',
    'seven day',
    'week',
    'campaign',
    'ready to post',
    'paruošk',       // paruošk turinį
    'sukurk.*kampanij', // sukurk kampaniją
    'sugeneruok.*kampanij', // sugeneruok kampaniją
    'planas',        // marketingo planas
    'strategij',     // strategija
  ];
  
  // Check if message contains campaign keywords
  const hasCampaignIntent = campaignKeywords.some(keyword => {
    if (keyword.includes('.*')) {
      // Regex pattern
      const regex = new RegExp(keyword, 'i');
      return regex.test(normalized);
    }
    return normalized.includes(keyword);
  });
  
  if (hasCampaignIntent) {
    return 'GENERATE_7_DAY_CAMPAIGN';
  }
  
  // Default: normal chat
  return 'CHAT';
}

/**
 * Get human-readable intent name
 */
export function getIntentName(intent: ChatIntent): string {
  switch (intent) {
    case 'GENERATE_7_DAY_CAMPAIGN':
      return '7-Day Campaign Generation';
    case 'CHAT':
      return 'Chat Conversation';
  }
}
