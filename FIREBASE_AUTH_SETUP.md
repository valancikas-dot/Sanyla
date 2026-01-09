# Firebase Authentication Setup

## Kaip įjungti Google Sign-In per Firebase

### 1. Eikite į Firebase Console
- https://console.firebase.google.com/project/sanyla/authentication

### 2. Sign-in providers
- Kairėje pasirinkite **Authentication** → **Sign-in method**

### 3. Pridėkite Google Provider
1. Paspauskite **Add new provider**
2. Pasirinkite **Google**
3. Įjunkite **Enable** toggle
4. **Project support email**: Pasirinkite savo el. paštą
5. Paspauskite **Save**

### 4. (Papildomai) Pridėkite kitus providers
- **Email/Password** - Jei norite leisti registruotis su el. paštu
- **Facebook** - Facebook login
- **Apple** - Apple Sign In
- **Microsoft** - Microsoft account
- **Twitter** - Twitter login

## Naudojimas kode

Firebase Auth jau sukonfigūruotas `apps/web/src/lib/firebase.ts`:

```typescript
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Google Sign In
const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Signed in:', user.email);
  } catch (error) {
    console.error('Sign in error:', error);
  }
};
```

## Skirtumas: NextAuth vs Firebase Auth

### NextAuth (Dabartinė implementacija)
- ✅ Server-side authentication
- ✅ JWT sessions
- ✅ Database integration (Prisma)
- ✅ Multiple providers (Google, Credentials)
- ✅ Better for full-stack apps

### Firebase Auth
- ✅ Client-side authentication  
- ✅ Real-time user state
- ✅ Built-in UI components
- ✅ Mobile-friendly
- ✅ Better for frontend-only apps

## Rekomendacija

**Naudokite NextAuth** (jau sukonfigūruota):
1. Labiau tinka jūsų stack'ui (Next.js + Prisma)
2. Vartotojai saugomi jūsų DB
3. Lengviau kontroliuoti vartotojų duomenis
4. Jau veikia credentials login

Tik reikia pridėti Google OAuth credentials pagal `GOOGLE_OAUTH_SETUP.md` instrukciją.
