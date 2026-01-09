/**
 * Firebase Analytics Helper Functions
 * 
 * Use these functions to track user actions throughout the app.
 * All events will appear in Firebase Console → Analytics → Events
 */

import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

/**
 * Track when analytics is available (browser only)
 */
const canTrack = () => {
  return typeof window !== 'undefined' && analytics !== null;
};

/**
 * AUTH EVENTS
 */

export const trackSignUp = (method: 'email' | 'google' | 'facebook') => {
  if (!canTrack()) return;
  logEvent(analytics!, 'sign_up', { method });
};

export const trackLogin = (method: 'email' | 'google' | 'facebook') => {
  if (!canTrack()) return;
  logEvent(analytics!, 'login', { method });
};

export const trackLogout = () => {
  if (!canTrack()) return;
  logEvent(analytics!, 'logout');
};

/**
 * PROJECT EVENTS
 */

export const trackProjectCreated = (data: {
  projectId: string;
  industry: string;
  language: string;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'project_created', {
    project_id: data.projectId,
    industry: data.industry,
    language: data.language,
  });
};

export const trackProjectOpened = (projectId: string) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'project_opened', { project_id: projectId });
};

export const trackBrandKitUpdated = (data: {
  projectId: string;
  fields: string[]; // ['language', 'tone', 'targetAudience']
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'brand_kit_updated', {
    project_id: data.projectId,
    updated_fields: data.fields.join(','),
  });
};

/**
 * AI GENERATION EVENTS
 */

export const trackAIStrategyGenerated = (data: {
  projectId: string;
  language: string;
  duration: number; // milliseconds
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'ai_strategy_generated', {
    project_id: data.projectId,
    language: data.language,
    duration_ms: data.duration,
  });
};

export const trackAIPostsGenerated = (data: {
  projectId: string;
  count: number;
  language: string;
  duration: number;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'ai_posts_generated', {
    project_id: data.projectId,
    count: data.count,
    language: data.language,
    duration_ms: data.duration,
  });
};

export const trackAIReelsGenerated = (data: {
  projectId: string;
  count: number;
  language: string;
  duration: number;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'ai_reels_generated', {
    project_id: data.projectId,
    count: data.count,
    language: data.language,
    duration_ms: data.duration,
  });
};

export const trackAICalendarGenerated = (data: {
  projectId: string;
  language: string;
  duration: number;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'ai_calendar_generated', {
    project_id: data.projectId,
    language: data.language,
    duration_ms: data.duration,
  });
};

export const trackAIInsightsGenerated = (data: {
  projectId: string;
  language: string;
  duration: number;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'ai_insights_generated', {
    project_id: data.projectId,
    language: data.language,
    duration_ms: data.duration,
  });
};

/**
 * CONTENT EVENTS
 */

export const trackContentCopied = (data: {
  contentType: 'post' | 'reel' | 'strategy' | 'insight';
  contentId: string;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'content_copied', {
    content_type: data.contentType,
    content_id: data.contentId,
  });
};

export const trackContentDownloaded = (data: {
  contentType: 'post' | 'reel' | 'calendar';
  format: 'json' | 'csv' | 'pdf';
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'content_downloaded', {
    content_type: data.contentType,
    format: data.format,
  });
};

export const trackContentEdited = (data: {
  contentId: string;
  contentType: string;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'content_edited', {
    content_id: data.contentId,
    content_type: data.contentType,
  });
};

/**
 * SCHEDULING EVENTS
 */

export const trackContentScheduled = (data: {
  platform: string;
  contentType: string;
  scheduledFor: string; // ISO date
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'content_scheduled', {
    platform: data.platform,
    content_type: data.contentType,
    scheduled_for: data.scheduledFor,
  });
};

export const trackScheduleCancelled = (jobId: string) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'schedule_cancelled', { job_id: jobId });
};

/**
 * PAGE VIEW EVENTS
 */

export const trackPageView = (data: {
  pagePath: string;
  pageTitle: string;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'page_view', {
    page_path: data.pagePath,
    page_title: data.pageTitle,
  });
};

/**
 * ERROR EVENTS
 */

export const trackError = (data: {
  errorType: string;
  errorMessage: string;
  page: string;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'error_occurred', {
    error_type: data.errorType,
    error_message: data.errorMessage,
    page: data.page,
  });
};

/**
 * INTEGRATION EVENTS
 */

export const trackIntegrationConnected = (data: {
  platform: string;
  projectId: string;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'integration_connected', {
    platform: data.platform,
    project_id: data.projectId,
  });
};

export const trackIntegrationDisconnected = (data: {
  platform: string;
  projectId: string;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'integration_disconnected', {
    platform: data.platform,
    project_id: data.projectId,
  });
};

/**
 * CUSTOM CONVERSION EVENTS
 */

export const trackFeatureUsed = (featureName: string) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'feature_used', { feature_name: featureName });
};

export const trackTrialStarted = (userId: string) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'trial_started', { user_id: userId });
};

export const trackSubscriptionUpgrade = (data: {
  plan: string;
  price: number;
}) => {
  if (!canTrack()) return;
  logEvent(analytics!, 'subscription_upgrade', {
    plan: data.plan,
    price: data.price,
  });
};
