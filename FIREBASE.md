# 🔥 Firebase Integration Guide

## ✅ Firebase Project Created

**Project Name:** Sanyla  
**Project ID:** `sanyla`  
**Console:** https://console.firebase.google.com/project/sanyla

---

## 📦 What's Integrated

### 1️⃣ **Firebase Analytics** 📊
- User behavior tracking
- Page views
- Custom events
- Real-time analytics dashboard

### 2️⃣ **Firestore Database** (Optional - currently using PostgreSQL)
- NoSQL document database
- Real-time sync
- Can be used for additional features:
  - User preferences
  - Real-time collaboration
  - Chat/comments
  - Activity feeds

### 3️⃣ **Firebase Authentication** (Optional - currently using JWT)
- Social login (Google, Facebook, Twitter)
- Email/password
- Phone authentication
- Can complement existing JWT auth

### 4️⃣ **Firebase Storage** (Future)
- Store user-uploaded images/videos
- CDN delivery
- Secure file access

---

## 🔧 Current Setup

### Environment Variables (Already Added)

```bash
# .env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyAkkLZrTL7iAc5-fbqSp7yjUG663qdrsTg"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="sanyla.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="sanyla"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="sanyla.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="960175108718"
NEXT_PUBLIC_FIREBASE_APP_ID="1:960175108718:web:777fd6cfc7afc693842c7f"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-4BXJ3MFSF3"
```

### Firebase SDK Installed

```bash
✅ firebase@12.7.0 installed in apps/web
```

### Firebase Client Initialized

```typescript
// apps/web/src/lib/firebase.ts

import { app, auth, db, analytics } from '@/lib/firebase';

// app - Firebase App instance
// auth - Firebase Authentication
// db - Firestore Database
// analytics - Firebase Analytics
```

---

## 📊 How to Use Analytics

### Track Page Views (Automatic)

```typescript
// apps/web/src/app/layout.tsx or any page

'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function Page() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }
  }, []);
  
  return <div>Your page</div>;
}
```

### Track Custom Events

```typescript
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

// Track AI generation
const handleGenerate = async () => {
  const result = await api.generateStrategy(projectId);
  
  if (analytics) {
    logEvent(analytics, 'ai_content_generated', {
      content_type: 'strategy',
      project_id: projectId,
      language: project.language,
    });
  }
};

// Track content scheduling
const handleSchedule = async () => {
  await api.schedulePost(data);
  
  if (analytics) {
    logEvent(analytics, 'content_scheduled', {
      platform: data.platform,
      content_type: data.contentType,
    });
  }
};
```

### Recommended Events to Track

```typescript
// User actions
logEvent(analytics, 'sign_up', { method: 'email' });
logEvent(analytics, 'login', { method: 'email' });

// Project actions
logEvent(analytics, 'project_created', { industry, language });
logEvent(analytics, 'brand_kit_updated', { project_id });

// AI generation
logEvent(analytics, 'ai_strategy_generated', { project_id, language });
logEvent(analytics, 'ai_posts_generated', { count: 20, language });
logEvent(analytics, 'ai_reels_generated', { count: 8, language });

// Content management
logEvent(analytics, 'content_copied', { content_type });
logEvent(analytics, 'content_downloaded', { content_type });

// Scheduling
logEvent(analytics, 'content_scheduled', { platform });
logEvent(analytics, 'schedule_cancelled', { job_id });
```

---

## 🗄️ Optional: Use Firestore

If you want to store additional data in Firestore:

### Save User Preferences

```typescript
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Save preferences
await setDoc(doc(db, 'userPreferences', userId), {
  theme: 'dark',
  language: 'lt',
  notifications: true,
  updatedAt: new Date(),
});

// Get preferences
const docSnap = await getDoc(doc(db, 'userPreferences', userId));
if (docSnap.exists()) {
  const prefs = docSnap.data();
}
```

### Real-time Activity Feed

```typescript
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

// Add activity
await addDoc(collection(db, 'activities'), {
  userId,
  projectId,
  action: 'ai_generation',
  type: 'strategy',
  timestamp: new Date(),
});

// Listen to activities in real-time
const q = query(
  collection(db, 'activities'),
  orderBy('timestamp', 'desc')
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  const activities = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setActivities(activities);
});
```

---

## 🔐 Optional: Social Login with Firebase Auth

### Enable Google Sign-In

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add authorized domains

### Implement in Code

```typescript
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Send Firebase token to your backend
    const idToken = await user.getIdToken();
    
    // Verify token on backend and create session
    const res = await api.post('/auth/firebase-login', { idToken });
    localStorage.setItem('token', res.data.token);
    
  } catch (error) {
    console.error('Google login failed', error);
  }
};
```

### Backend Token Verification (NestJS)

```bash
cd apps/api
pnpm add firebase-admin
```

```typescript
// apps/api/src/auth/firebase-auth.guard.ts

import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export async function verifyFirebaseToken(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken; // Contains uid, email, etc.
  } catch (error) {
    throw new UnauthorizedException('Invalid Firebase token');
  }
}
```

---

## 📈 Firebase Console Features

### Analytics Dashboard
https://console.firebase.google.com/project/sanyla/analytics

**View:**
- Active users (real-time)
- User engagement
- Retention
- Popular pages
- Custom events
- Conversion funnels

### Firestore Database
https://console.firebase.google.com/project/sanyla/firestore

**Features:**
- Browse collections
- Query data
- Export/import
- Security rules

### Storage
https://console.firebase.google.com/project/sanyla/storage

**Upload:**
- User avatars
- Brand logos
- Generated images
- Video thumbnails

---

## 🔒 Security Rules

### Firestore Rules (Basic)

```javascript
// Firebase Console → Firestore → Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User preferences
    match /userPreferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public analytics
    match /analytics/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Only via server
    }
  }
}
```

### Storage Rules (Basic)

```javascript
// Firebase Console → Storage → Rules

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 💡 Recommended Usage

### MVP Phase (Current)
✅ **Analytics** - Track user behavior  
✅ **Crashlytics** - Monitor errors (optional)  
⏳ **Authentication** - Keep JWT for now  
⏳ **Firestore** - Use PostgreSQL for main data  
⏳ **Storage** - Use local files or S3 later  

### Post-MVP Phase
- Add Google/Facebook login via Firebase Auth
- Store user preferences in Firestore
- Upload images to Firebase Storage
- Real-time features (comments, collaboration)

---

## 🚀 Quick Test

### Test Analytics

```typescript
// apps/web/src/app/page.tsx

'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function Home() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'test_event', {
        message: 'Firebase is working!',
        timestamp: new Date().toISOString(),
      });
    }
  }, []);
  
  return <div>Check Firebase Console for test_event!</div>;
}
```

Run app:
```bash
pnpm dev
```

Open http://localhost:3000 → Check Firebase Console → Analytics → Events → `test_event` should appear within 1-2 minutes.

---

## 📚 Documentation Links

- **Firebase Console:** https://console.firebase.google.com/project/sanyla
- **Analytics:** https://firebase.google.com/docs/analytics
- **Firestore:** https://firebase.google.com/docs/firestore
- **Auth:** https://firebase.google.com/docs/auth
- **Storage:** https://firebase.google.com/docs/storage

---

## ⚠️ Important Notes

1. **API Keys are public** - Firebase API keys in frontend are safe (protected by Firebase security rules)
2. **Free tier limits:**
   - Firestore: 1 GB storage, 50K reads/day, 20K writes/day
   - Storage: 5 GB, 1 GB/day downloads
   - Analytics: Unlimited
3. **PostgreSQL remains primary database** - Firebase is for additional features
4. **JWT auth remains primary** - Firebase auth is optional enhancement

---

## ✅ Status

**Firebase Integration:** ✅ Ready  
**Analytics Setup:** ✅ Configured  
**Environment Variables:** ✅ Added  
**Client Initialized:** ✅ Created  
**Ready to Use:** ✅ YES  

Next: Add analytics tracking to key user actions! 📊
