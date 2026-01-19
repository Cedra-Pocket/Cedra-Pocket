// Simple serverless function for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path from URL
  const path = req.url || '/';

  // Health check endpoint
  if (path === '/health' || path === '/' || path === '/api') {
    res.status(200).json({
      status: 'ok',
      message: 'Cedra Quest Backend is running on Vercel',
      timestamp: new Date().toISOString(),
      path: path,
      method: req.method,
    });
    return;
  }

  // For all other routes, return API info
  res.status(200).json({
    message: 'Cedra Quest Backend API',
    path: path,
    method: req.method,
    available_endpoints: [
      'GET /',
      'GET /health',
      'GET /api'
    ]
  });
}