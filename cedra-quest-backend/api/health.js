export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Cedra Quest Backend Health Check',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}