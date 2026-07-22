import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

let tokenCache = { accessToken: null, expiresAt: null };

// Securely retrieve/cache the OAuth 2.0 Access Token
async function getCmpAccessToken() {
  const now = Date.now();
  if (tokenCache.accessToken && tokenCache.expiresAt > now + 30000) {
    return tokenCache.accessToken;
  }

  const credentials = Buffer.from(`${process.env.CMP_CLIENT_ID}:${process.env.CMP_CLIENT_SECRET}`).toString('base64');
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

  if (!response.ok) throw new Error('Authentication failed');
  const data = await response.json();
  
  tokenCache = { accessToken: data.access_token, expiresAt: now + (data.expires_in * 1000) };
  return data.access_token;
}

/**
 * Corrected endpoint: Directly requests metadata for a single raw file
 */
app.get('/api/dam/json-file/:rawFileId', async (req, res) => {
  try {
    const { rawFileId } = req.params;
    const token = await getCmpAccessToken();

    // 1. Fetch metadata specifically for this raw file ID
    const fileMetaResponse = await fetch(`https://api.cmp.optimizely.com/v3/raw-files/${rawFileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!fileMetaResponse.ok) {
      return res.status(fileMetaResponse.status).json({ 
        error: `Failed to retrieve raw file metadata from CMP (Status: ${fileMetaResponse.status})` 
      });
    }

    const fileMetadata = await fileMetaResponse.json();

    // Ensure the metadata has a valid file URL
    if (!fileMetadata.url) {
      return res.status(404).json({ error: 'The requested file does not contain a public download URL.' });
    }

    // 2. Fetch the actual raw JSON content from the pre-signed URL
    const fileResponse = await fetch(fileMetadata.url);
    if (!fileResponse.ok) {
      return res.status(500).json({ error: 'Failed to download the JSON payload from DAM.' });
    }

    const jsonData = await fileResponse.json();

    // 3. Return the parsed JSON back to your client-side JavaScript
    res.json(jsonData);

  } catch (error) {
    console.error('Error fetching JSON:', error);
    res.status(500).json({ error: 'Internal server error processing the file.' });
  }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
