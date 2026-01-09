# 🎨 Sanyla Design System

> Inspired by modern mobile UI kits and NFT marketplace aesthetics

---

## 🌈 Color Palette

### Primary Colors
```css
--primary: 239 84% 67%        /* Vibrant Purple #E879F9 */
--primary-dark: 239 70% 55%   /* Dark Purple #C026D3 */
--primary-light: 239 90% 80%  /* Light Purple #F5D0FE */
```

### Accent Colors
```css
--accent-blue: 199 89% 48%    /* Electric Blue #0EA5E9 */
--accent-green: 142 76% 36%   /* Success Green #10B981 */
--accent-orange: 25 95% 53%   /* Warning Orange #FB923C */
--accent-red: 0 84% 60%       /* Error Red #EF4444 */
```

### Neutrals
```css
--background: 240 10% 3.9%    /* Dark Background #0A0A0B */
--surface: 240 5% 11%         /* Card Surface #1A1A1D */
--surface-hover: 240 5% 15%   /* Hover State #242428 */
--border: 240 4% 20%          /* Border #303037 */
```

### Text
```css
--text-primary: 0 0% 98%      /* White Text #FAFAFA */
--text-secondary: 240 5% 65%  /* Gray Text #9CA3AF */
--text-muted: 240 5% 45%      /* Muted Text #6B7280 */
```

---

## 📐 Spacing Scale

```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
--spacing-3xl: 4rem     /* 64px */
```

---

## 🔤 Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, system-ui, sans-serif
--font-display: 'Outfit', 'Inter', sans-serif
--font-mono: 'Fira Code', 'SF Mono', monospace
```

### Font Sizes
```css
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */
--text-5xl: 3rem        /* 48px */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-black: 900
```

---

## 🎭 Component Styles

### Buttons

**Primary Button**
```css
background: linear-gradient(135deg, #E879F9 0%, #C026D3 100%)
padding: 12px 24px
border-radius: 12px
font-weight: 600
box-shadow: 0 4px 12px rgba(232, 121, 249, 0.3)
transition: all 0.3s ease
```

**Secondary Button**
```css
background: rgba(232, 121, 249, 0.1)
border: 1px solid rgba(232, 121, 249, 0.3)
padding: 12px 24px
border-radius: 12px
font-weight: 600
```

**Icon Button**
```css
background: rgba(255, 255, 255, 0.05)
padding: 12px
border-radius: 10px
backdrop-filter: blur(10px)
```

### Cards

**Glass Card**
```css
background: rgba(26, 26, 29, 0.8)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 16px
padding: 24px
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
```

**Feature Card**
```css
background: linear-gradient(135deg, rgba(232, 121, 249, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)
border: 1px solid rgba(232, 121, 249, 0.2)
border-radius: 16px
padding: 24px
```

### Inputs

**Text Input**
```css
background: rgba(255, 255, 255, 0.05)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 12px
padding: 12px 16px
font-size: 14px
transition: all 0.2s ease

/* Focus State */
border-color: #E879F9
box-shadow: 0 0 0 3px rgba(232, 121, 249, 0.1)
```

**Select Dropdown**
```css
background: rgba(26, 26, 29, 0.95)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 12px
padding: 12px 16px
```

---

## ✨ Effects & Animations

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.05)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.1)
```

### Gradient Overlay
```css
background: linear-gradient(135deg, #E879F9 0%, #0EA5E9 100%)
```

### Hover Animations
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

/* Hover State */
transform: translateY(-2px)
box-shadow: 0 12px 24px rgba(232, 121, 249, 0.4)
```

### Loading Skeleton
```css
background: linear-gradient(90deg, 
  rgba(255, 255, 255, 0.05) 0%, 
  rgba(255, 255, 255, 0.1) 50%, 
  rgba(255, 255, 255, 0.05) 100%
)
animation: shimmer 2s infinite
```

---

## 📱 Mobile-First Layouts

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Grid System
```css
/* Mobile (default) */
grid-template-columns: 1fr

/* Tablet */
@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr)
}

/* Desktop */
@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr)
}
```

---

## 🎯 Icon System

**Primary Icons:**
- Lucide React (outlined, modern)
- Size: 20px (sm), 24px (md), 32px (lg)
- Stroke: 2px
- Color: Inherit from text color

**Usage:**
```tsx
import { Sparkles, Calendar, TrendingUp } from 'lucide-react'

<Sparkles className="w-5 h-5 text-primary" />
```

---

## 🌟 Special Components

### Stats Card
```tsx
<div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 
                border border-purple-500/20 rounded-2xl p-6">
  <div className="flex items-center gap-3 mb-2">
    <div className="p-2 bg-purple-500/20 rounded-lg">
      <Icon className="w-5 h-5 text-purple-400" />
    </div>
    <h3 className="text-gray-400 text-sm">Metric Name</h3>
  </div>
  <p className="text-3xl font-bold text-white">1,234</p>
  <p className="text-sm text-green-400 mt-1">↑ 12% from last week</p>
</div>
```

### AI Generation Card
```tsx
<div className="relative overflow-hidden bg-surface border border-border 
                rounded-2xl p-6 hover:border-primary/50 transition-all">
  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br 
                  from-purple-500/20 to-transparent rounded-full blur-3xl" />
  <div className="relative z-10">
    <h3 className="text-lg font-semibold mb-2">30-Day Strategy</h3>
    <p className="text-gray-400 text-sm mb-4">AI-powered marketing plan</p>
    <button className="w-full btn-primary">Generate Now</button>
  </div>
</div>
```

### Progress Bar
```tsx
<div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 
                  rounded-full transition-all duration-500"
       style={{ width: '75%' }} />
</div>
```

---

## 🎨 Implementation Guide

### 1. Update Tailwind Config
Add custom colors, fonts, and animations to `tailwind.config.ts`

### 2. Create Base Components
Build reusable components in `apps/web/src/components/ui/`

### 3. Apply Global Styles
Update `apps/web/src/app/globals.css` with design tokens

### 4. Implement Dark Theme
Use CSS variables for dynamic theming

### 5. Add Animations
Use Framer Motion for complex animations

---

## 📦 Component Library

- ✅ Button (Primary, Secondary, Ghost, Icon)
- ✅ Card (Glass, Feature, Stats)
- ✅ Input (Text, Select, Textarea)
- ✅ Badge (Status, Count)
- ✅ Avatar (User, AI Bot)
- ✅ Progress (Bar, Circle)
- ✅ Modal (Dialog, Sheet)
- ✅ Toast (Success, Error, Info)
- ✅ Skeleton (Loading states)
- ✅ Dropdown (Menu, Select)

---

**Next Steps:**
1. Update Tailwind config with new colors
2. Create modern component variants
3. Apply glassmorphism effects
4. Add smooth animations
5. Implement responsive layouts
