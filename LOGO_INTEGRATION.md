# Logo Integration Guide

## How to Replace the Logo

### Option 1: Replace the SVG in Layout.tsx
In `/frontend/src/components/Layout.tsx`, replace the SVG icon (lines 33-35) with your logo:

```tsx
{/* Replace this with your actual logo */}
<img src="/your-logo.png" alt="MedSynapse Logo" className="w-7 h-7" />
```

### Option 2: Replace the SVG in Home.tsx
In `/frontend/src/pages/Home.tsx`, replace the SVG icon (lines 27-29) with your logo:

```tsx
{/* Replace this with your actual logo */}
<img src="/your-logo.png" alt="MedSynapse Logo" className="w-12 h-12" />
```

### Option 3: Use Your Logo File
1. Place your logo file in `/frontend/public/` (e.g., `logo.png`, `logo.svg`)
2. Update both components to use: `src="/logo.png"`

## Supported Formats
- PNG (recommended for photos)
- SVG (recommended for icons/vectors)
- JPG (for photos)

## Logo Sizes
- Navigation logo: 28x28px (w-7 h-7)
- Hero logo: 48x48px (w-12 h-12)

## Animation Features
- ✅ Hover scale and rotation effects
- ✅ Animated pulse rings
- ✅ Glow effects
- ✅ Smooth transitions
- ✅ Gradient backgrounds

