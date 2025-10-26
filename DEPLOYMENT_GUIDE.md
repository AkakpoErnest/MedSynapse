# 🚀 MedSynapse Vercel Deployment Guide

## 📋 Prerequisites

- GitHub repository: `AkakpoErnest/MedSynapse`
- Vercel account (free tier works)
- Environment variables ready

## 🔧 Step-by-Step Deployment

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import from GitHub: `AkakpoErnest/MedSynapse`
4. Click **"Import"**

### 2. Configure Project Settings

**Project Name:** `medsynapse` (or your preferred name)

**Framework Preset:** `Vite`

**Root Directory:** `frontend`

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm ci`

### 3. Add Environment Variables

Go to **Settings > Environment Variables** and add:

#### Required Variables:
```
VITE_LIGHTHOUSE_API_KEY=894ec5dd.bd8480d5b8004515bc7f82d31e5b600f
VITE_ENVIO_API_KEY=your_envio_api_key
VITE_ENVIO_ENDPOINT=https://api.envio.dev/v1/graphql
VITE_MEDSYNAPSE_CONTRACT=0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44
VITE_PRIVATE_KEY=your_private_key
```

#### Optional Variables:
```
VITE_1MB_CONTRACT_ADDRESS=your_1mb_contract_address
VITE_NETWORK_ID=80002
VITE_NETWORK_NAME=Polygon Amoy Testnet
VITE_RPC_URL=https://rpc-amoy.polygon.technology
VITE_ENABLE_AI_DASHBOARD=true
VITE_ENABLE_REAL_DATASETS=true
VITE_ENABLE_1MB_INTEGRATION=false
```

### 4. Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at: `https://medsynapse.vercel.app`

## 🔍 Troubleshooting

### Build Errors

**Error:** `Module not found: 'graphql-request'`
**Solution:** Run `npm install` in frontend directory

**Error:** `TypeScript errors`
**Solution:** Check that all imports are correct

**Error:** `Environment variables not found`
**Solution:** Ensure all VITE_ variables are set in Vercel

### Runtime Errors

**Error:** `Cannot connect to Envio`
**Solution:** Check `VITE_ENVIO_ENDPOINT` and `VITE_ENVIO_API_KEY`

**Error:** `Lighthouse upload failed`
**Solution:** Verify `VITE_LIGHTHOUSE_API_KEY` is correct

**Error:** `Contract not found`
**Solution:** Check `VITE_MEDSYNAPSE_CONTRACT` address

## 📊 Performance Optimization

### Build Optimizations Applied:
- ✅ Code splitting by vendor libraries
- ✅ Terser minification
- ✅ CSS code splitting
- ✅ Asset inlining for small files
- ✅ Tree shaking enabled
- ✅ Source maps disabled for production

### Expected Performance:
- **First Load:** ~2-3 seconds
- **Subsequent Loads:** ~1 second
- **Bundle Size:** ~500KB gzipped
- **Lighthouse Score:** 90+ (Performance)

## 🔒 Security Features

### Headers Applied:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Content Security Policy:
- Scripts: `'self' 'unsafe-eval' 'unsafe-inline'`
- Styles: `'self' 'unsafe-inline'`
- Images: `'self' data: https:`
- Fonts: `'self' https:`
- Connections: `'self' https: http://localhost:* ws://localhost:*`

## 🌐 Custom Domain (Optional)

1. Go to **Settings > Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

## 📈 Monitoring

### Built-in Vercel Analytics:
- Page views
- Performance metrics
- Error tracking
- User sessions

### Recommended Integrations:
- **Sentry:** Error monitoring
- **Google Analytics:** User behavior
- **Hotjar:** User experience

## 🔄 Continuous Deployment

### Automatic Deployments:
- **Production:** Pushes to `main` branch
- **Preview:** Pull requests and other branches
- **Development:** Local development

### Manual Deployments:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

## 📞 Support

### Common Issues:
1. **Build fails:** Check environment variables
2. **App doesn't load:** Verify all required variables are set
3. **Slow performance:** Check bundle size and optimizations
4. **CORS errors:** Update CSP headers if needed

### Getting Help:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- MedSynapse Issues: GitHub Issues
- Community: Discord/Telegram

---

## 🎉 Success Checklist

- [ ] Repository connected to Vercel
- [ ] Project configured correctly
- [ ] All environment variables added
- [ ] Build completed successfully
- [ ] App loads without errors
- [ ] Wallet connection works
- [ ] Data upload functions
- [ ] AI dashboard accessible
- [ ] Performance is acceptable
- [ ] Custom domain configured (optional)

**Your MedSynapse platform is now live! 🚀**

