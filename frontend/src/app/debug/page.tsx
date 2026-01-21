/**
 * Debug Page - Check deployment issues
 */

'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [backendStatus, setBackendStatus] = useState('Testing...');
  const [error, setError] = useState('');
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    // Get environment variables
    const env = {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV,
    };
    setEnvVars(env);
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'https://cedra-pocket-wybm.vercel.app');
    
    testBackend();
  }, []);

  const testBackend = async () => {
    const testUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cedra-pocket-wybm.vercel.app';
    
    try {
      console.log('Testing backend at:', testUrl);
      
      const response = await fetch(`${testUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        setBackendStatus('✅ Connected');
        console.log('Backend data:', data);
      } else {
        const errorText = await response.text();
        setBackendStatus(`❌ Error: ${response.status}`);
        setError(`Status: ${response.status}, Response: ${errorText}`);
        console.error('Backend error:', errorText);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setBackendStatus(`❌ Failed: ${errorMsg}`);
      setError(errorMsg);
      console.error('Fetch error:', err);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace',
      backgroundColor: '#1a1a2e',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#4CAF50' }}>🔍 Debug Page</h1>
      
      <div style={{ 
        backgroundColor: '#16213e', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Environment Variables</h2>
        <pre style={{ 
          backgroundColor: '#0f0f23', 
          padding: '15px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <div style={{ 
        backgroundColor: '#16213e', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Backend Connection Test</h2>
        <p><strong>API URL:</strong> {apiUrl}</p>
        <p><strong>Status:</strong> {backendStatus}</p>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ff4444', 
            padding: '10px', 
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <strong>Error Details:</strong>
            <pre style={{ marginTop: '10px', fontSize: '12px' }}>
              {error}
            </pre>
          </div>
        )}
        
        <button 
          onClick={testBackend}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Test Again
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#16213e', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Browser Info</h2>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p><strong>URL:</strong> {window.location.href}</p>
        <p><strong>Origin:</strong> {window.location.origin}</p>
      </div>

      <div style={{ 
        backgroundColor: '#16213e', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Console Logs</h2>
        <p>Check browser console (F12) for detailed error messages</p>
        <button 
          onClick={() => console.log('Debug info:', { envVars, apiUrl, backendStatus, error })}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Log Debug Info
        </button>
      </div>
    </div>
  );
}