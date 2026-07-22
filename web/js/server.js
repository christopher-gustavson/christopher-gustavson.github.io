import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
let tokenCache = { accessToken: null, expiresAt: null };

// Step A: Get OAuth token
async function getCmpAccessToken() {
  const now = Date.now();
  if (tokenCache.accessToken && tokenCache.expiresAt > now + 30000) {
    return tokenCache.accessToken; // Return cached token
  }

  const credentials = Buffer.from(
    `${process.env.CMP_CLIENT_ID}:${process.env.CMP_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://accounts.cmp.optimizely.com/o/oauth2/v1/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'openid profile offline_access'
    })
  });

  const data = await response.json();
  tokenCache = { accessToken: data.access_token, expiresAt: now + data.expires_in * 1000 };
  return data.access_token;
}

// Step B: Proxy endpoint
app.get('/api/dam/json-file/:assetId', async (req, res) => {
  const token = await getCmpAccessToken();
  const metaResponse = await fetch('https://api.cmp.optimizely.com/v3/assets?type=raw_file', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const assets = await metaResponse.json();
  const targetAsset = assets.find(a => a.id === req.params.assetId);

  const fileResponse = await fetch(targetAsset.url);
  const jsonData = await fileResponse.json();
  res.json(jsonData);
});

app.listen(3000);