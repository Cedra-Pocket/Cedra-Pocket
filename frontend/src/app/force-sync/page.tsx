/**
 * Force Sync Page - Manually create user and sync data
 */

'use client';

import { useState, useEffect } from 'react';

export default function ForceSyncPage() {
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [petStatus, setPetStatus] = useState<any>(null);

  useEffect(() => {
    // Auto-detect user ID from various sources
    detectUserId();
  }, []);

  const detectUserId = () => {
    let detectedId = '';
    
    // Try Telegram WebApp first
    if (typeof window !== 'undefined') {
      if ((window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        detectedId = String((window as any).Telegram.WebApp.initDataUnsafe.user.id);
        setStatus('✅ User ID detected from Telegram WebApp');
      } else {
        // Try localStorage
        const storedUser = localStorage.getItem('tg-mini-app-storage');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed.state?.user?.telegramId) {
              detectedId = parsed.state.user.telegramId;
              setStatus('✅ User ID detected from localStorage');
            }
          } catch (e) {
            console.error('Failed to parse stored user:', e);
          }
        }
      }
    }
    
    if (detectedId) {
      setUserId(detectedId);
      checkUserExists(detectedId);
    } else {
      setStatus('⚠️ No user ID detected. Please enter manually.');
    }
  };

  const checkUserExists = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cedra-pocket-wybm.vercel.app';
      const response = await fetch(`${apiUrl}/game/pet/status/${id}`);
      
      if (response.ok) {
        const petData = await response.json();
        setUserExists(true);
        setPetStatus(petData);
        setStatus(prev => prev + '\n✅ User exists in backend database');
      } else if (response.status === 404 || response.status === 400) {
        setUserExists(false);
        setStatus(prev => prev + '\n❌ User does not exist in backend database');
      }
    } catch (error) {
      setStatus(prev => prev + '\n⚠️ Could not check user existence');
    }
  };

  const forceCreateUser = async () => {
    if (!userId) {
      setStatus('❌ Please enter User ID');
      return;
    }

    setLoading(true);
    setStatus('🔄 Creating user in backend database...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cedra-pocket-wybm.vercel.app';
      
      // Create user via auth endpoint with proper Telegram data format
      const authResponse = await fetch(`${apiUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData: `user={"id":${userId},"username":"user${userId}","first_name":"User","last_name":"","language_code":"en"}`,
          telegramId: userId,
        }),
      });

      if (authResponse.ok) {
        const authResult = await authResponse.json();
        console.log('User created:', authResult);
        setStatus('✅ User created successfully! Checking pet status...');
        setUserExists(true);
        
        // Wait a moment for database to update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check pet status
        const petResponse = await fetch(`${apiUrl}/game/pet/status/${userId}`);
        if (petResponse.ok) {
          const petData = await petResponse.json();
          setPetStatus(petData);
          setStatus(prev => prev + `\n✅ Pet initialized! Level: ${petData.level}, Pending: ${petData.pendingRewards}`);
          
          // Update localStorage with correct user ID
          updateLocalStorage(userId);
        } else {
          const errorText = await petResponse.text();
          setStatus(prev => prev + `\n❌ Pet status check failed: ${errorText}`);
        }
      } else {
        const errorText = await authResponse.text();
        setStatus(`❌ User creation failed: ${errorText}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalStorage = (id: string) => {
    try {
      const storedData = localStorage.getItem('tg-mini-app-storage');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (!parsed.state) parsed.state = {};
        if (!parsed.state.user) parsed.state.user = {};
        
        parsed.state.user.telegramId = id;
        parsed.state.dataSynced = true;
        parsed.state.lastSyncTime = Date.now();
        
        localStorage.setItem('tg-mini-app-storage', JSON.stringify(parsed));
        setStatus(prev => prev + '\n✅ Local storage updated with correct user ID');
      }
    } catch (error) {
      setStatus(prev => prev + '\n⚠️ Failed to update localStorage');
    }
  };

  const testClaim = async () => {
    if (!userId) return;
    
    setLoading(true);
    setStatus(prev => prev + '\n🔄 Testing pet reward claim...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cedra-pocket-wybm.vercel.app';
      
      // First, check pet status to see if there are rewards to claim
      const statusResponse = await fetch(`${apiUrl}/game/pet/status/${userId}`);
      if (statusResponse.ok) {
        const petData = await statusResponse.json();
        setStatus(prev => prev + `\n📊 Pet Status: Level ${petData.level}, Pending: ${petData.pendingRewards}`);
        
        if (petData.pendingRewards <= 0) {
          setStatus(prev => prev + '\n⚠️ No rewards to claim. Pet needs time to generate rewards.');
          return;
        }
      }
      
      // Now try to claim
      const response = await fetch(`${apiUrl}/game/pet/claim/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setStatus(prev => prev + `\n✅ Claim successful! Points earned: ${result.pointsEarned}`);
        setStatus(prev => prev + `\n💰 New total points: ${result.newTotalPoints}`);
        
        // Refresh pet status after claim
        await checkUserExists(userId);
      } else {
        const errorText = await response.text();
        setStatus(prev => prev + `\n❌ Claim failed: ${errorText}`);
        
        // Try to parse error for more details
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            setStatus(prev => prev + `\n🔍 Error details: ${errorJson.message}`);
          }
        } catch (e) {
          // Error text is not JSON, already logged above
        }
      }
    } catch (error) {
      setStatus(prev => prev + `\n❌ Claim error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = () => {
    if (userId) {
      checkUserExists(userId);
    }
  };

  const clearLocalData = () => {
    localStorage.removeItem('tg-mini-app-storage');
    setStatus('✅ Local storage cleared! Refresh the page to start fresh.');
  };

  const forceResetClaimTime = async () => {
    if (!userId) return;
    
    setLoading(true);
    setStatus(prev => prev + '\n🔄 Attempting to reset pet claim time...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://cedra-pocket-wybm.vercel.app';
      
      // This is a workaround - we'll feed the pet 0 times to trigger a backend update
      // which should reset the claim time properly
      const response = await fetch(`${apiUrl}/game/pet/feed/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedCount: 0, // Feed 0 times to just trigger an update
        }),
      });

      if (response.ok) {
        setStatus(prev => prev + '\n✅ Pet state refreshed');
        
        // Wait a moment then check status
        await new Promise(resolve => setTimeout(resolve, 1000));
        await checkUserExists(userId);
      } else {
        const errorText = await response.text();
        setStatus(prev => prev + `\n❌ Reset failed: ${errorText}`);
      }
    } catch (error) {
      setStatus(prev => prev + `\n❌ Reset error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
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
      <h1 style={{ color: '#4CAF50' }}>🔧 Force Sync & Debug</h1>
      
      <div style={{ 
        backgroundColor: '#16213e', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>User Information</h2>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter your Telegram User ID"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0f0f23',
            color: 'white',
            border: '1px solid #333',
            borderRadius: '4px',
            marginBottom: '15px'
          }}
        />
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Status: </strong>
          <span style={{ 
            color: userExists ? '#4CAF50' : '#f44336',
            fontWeight: 'bold'
          }}>
            {userExists ? '✅ User exists in backend' : '❌ User not found in backend'}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={forceCreateUser}
            disabled={loading || !userId}
            style={{
              backgroundColor: userExists ? '#FF9800' : '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {userExists ? 'Recreate User' : 'Create User'}
          </button>
          
          <button 
            onClick={testClaim}
            disabled={loading || !userId || !userExists}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: (loading || !userExists) ? 0.5 : 1
            }}
          >
            Test Claim
          </button>
          
          <button 
            onClick={refreshStatus}
            disabled={loading || !userId}
            style={{
              backgroundColor: '#9C27B0',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            Refresh Status
          </button>
          
          <button 
            onClick={forceResetClaimTime}
            disabled={loading || !userId || !userExists}
            style={{
              backgroundColor: '#FF5722',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: (loading || !userExists) ? 0.5 : 1
            }}
          >
            Reset Claim Time
          </button>
          
          <button 
            onClick={clearLocalData}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Local Data
          </button>
        </div>
      </div>

      {petStatus && (
        <div style={{ 
          backgroundColor: '#16213e', 
          padding: '20px', 
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <h2>Pet Status</h2>
          <div style={{ 
            backgroundColor: '#0f0f23', 
            padding: '15px', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <div><strong>Level:</strong> {petStatus.level}</div>
            <div><strong>Current XP:</strong> {petStatus.currentXp}</div>
            <div><strong>Pending Rewards:</strong> {petStatus.pendingRewards}</div>
            <div><strong>Last Claim:</strong> {new Date(petStatus.lastClaimTime).toLocaleString()}</div>
            <div><strong>Can Level Up:</strong> {petStatus.canLevelUp ? 'Yes' : 'No'}</div>
            <div><strong>Daily Feed Spent:</strong> {petStatus.dailyFeedSpent}/{petStatus.dailyFeedLimit}</div>
          </div>
        </div>
      )}

      {status && (
        <div style={{ 
          backgroundColor: '#16213e', 
          padding: '20px', 
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <h2>Status Log</h2>
          <pre style={{ 
            backgroundColor: '#0f0f23', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.4
          }}>
            {status}
          </pre>
        </div>
      )}

      <div style={{ 
        backgroundColor: '#16213e', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Instructions</h2>
        <ol style={{ lineHeight: 1.6 }}>
          <li><strong>Auto-Detection:</strong> The system will try to detect your Telegram User ID automatically</li>
          <li><strong>Manual Entry:</strong> If auto-detection fails, enter your Telegram User ID manually</li>
          <li><strong>Create User:</strong> Click "Create User" to ensure you exist in the backend database</li>
          <li><strong>Test Claim:</strong> Once user is created, test the pet reward claim functionality</li>
          <li><strong>Clear Data:</strong> If issues persist, clear local data and refresh the page</li>
        </ol>
        
        <div style={{ 
          backgroundColor: '#0f0f23', 
          padding: '15px', 
          borderRadius: '4px',
          marginTop: '15px'
        }}>
          <h3>How to find your Telegram User ID:</h3>
          <ul>
            <li>Use @userinfobot in Telegram</li>
            <li>Send any message to the bot and it will show your ID</li>
            <li>Or check browser console for auto-detected ID</li>
          </ul>
        </div>
      </div>
    </div>
  );
}