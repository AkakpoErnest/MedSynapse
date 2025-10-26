# Netlify Environment Variables Setup Instructions

## Quick Setup Steps:

1. Go to https://app.netlify.com
2. Select your **MedSynapse** site
3. Go to **Site settings** → **Build & deploy** → **Environment**
4. Click **Add a variable**

## Add These Variables:

### 1. Lighthouse API Key (Required)

- **Variable name:** `VITE_LIGHTHOUSE_API_KEY`
- **Value:** `894ec5dd.bd8480d5b8004515bc7f82d31e5b600f`

### 2. Envio Endpoint (Optional)

- **Variable name:** `VITE_ENVIO_ENDPOINT`
- **Value:** `http://localhost:8080/v1/graphql`

### 3. MedSynapse Contract Address (Optional)

- **Variable name:** `VITE_MEDSYNAPSE_CONTRACT`
- **Value:** `0x05133bC59e34413F683Cc336A26f215b3261a51F`

## After Adding Variables:

1. Click **Save**
2. Go to **Deploys** tab
3. Click **Trigger deploy** → **Deploy site**

The Lighthouse encrypted storage will now work in production!

