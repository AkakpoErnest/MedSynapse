# Netlify Environment Variables Setup

## Required Environment Variables

To run MedSynapse properly on Netlify, you need to configure the following environment variables in your Netlify dashboard.

### Steps to Add Environment Variables in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **Add a variable**
4. Add each variable below:

## Environment Variables:

### Lighthouse API Key (Required for Encrypted Storage)

**Variable Name:** `VITE_LIGHTHOUSE_API_KEY`

**Value:** Your Lighthouse API key (get it from https://lighthouse.storage)

**Description:** Enables encrypted IPFS storage for health data uploads

**Example:**
```
VITE_LIGHTHOUSE_API_KEY=your_lighthouse_api_key_here
```

**How to get your Lighthouse API key:**
1. Visit https://lighthouse.storage
2. Create an account or sign in
3. Go to API Keys section
4. Generate a new API key
5. Copy the key and add it to Netlify environment variables

---

## Optional Environment Variables

### Envio API Key (For Advanced Analytics)

**Variable Name:** `VITE_ENVIO_API_KEY`

**Value:** Your Envio API key (if using production Envio instance)

**Description:** Enables production Envio indexing and analytics

### Envio Endpoint (For Production Envio)

**Variable Name:** `VITE_ENVIO_ENDPOINT`

**Value:** Your Envio production endpoint URL

**Description:** Production GraphQL endpoint for blockchain data

**Default (for local development):** `http://localhost:8080/v1/graphql`

---

## Important Notes:

1. **Lighthouse is required** for the encrypted storage feature to work
2. Without `VITE_LIGHTHOUSE_API_KEY`, users will see "Lighthouse not configured" warnings
3. All environment variables starting with `VITE_` are exposed to the client-side code
4. Never commit API keys to Git - always use environment variables

---

## Testing Locally:

Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
cp ../env.example .env
```

Then edit `.env` with your actual API keys:

```
VITE_LIGHTHOUSE_API_KEY=your_actual_api_key
```

---

## Verifying Setup:

After adding the environment variable in Netlify:

1. Trigger a new deploy in Netlify
2. Check the deploy logs to ensure the variable is loaded
3. Visit your site and check the browser console
4. You should see: "Lighthouse API Key configured: Yes"

If you still see "Lighthouse not configured", the environment variable may not be set correctly.

