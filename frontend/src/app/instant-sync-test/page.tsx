'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useInstantSync } from '../../hooks/useInstantSync';
import { InstantSyncButton } from '../../components/shared/InstantSyncButton';

export default function InstantSyncTestPage() {
  const { user, updateBalance } = useAppStore();
  const { syncStatus, syncPointsInstantly, syncProfileInstantly } = useInstantSync();
  const [testAmount, setTestAmount] = useState(100);
  const [logs, setLogs] = useState<string[]>([]);
  const [syncTimes, setSyncTimes] = useState<number[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  // Listen for instant sync events
  useEffect(() => {
    const handleInstantSyncSuccess = (event: CustomEvent) => {
      const syncTime = Date.now() - (event.detail.startTime || Date.now());
      setSyncTimes(prev => [syncTime, ...prev.slice(0, 9)]);
      addLog(`✅ Instant sync completed in ${syncTime}ms`);
    };

    const handleInstantSyncFailed = (event: CustomEvent) => {
      addLog(`❌ Instant sync failed: ${event.detail.error}`);
    };

    window.addEventListener('instantSyncSuccess', handleInstantSyncSuccess as EventListener);
    window.addEventListener('instantSyncFailed', handleInstantSyncFailed as EventListener);

    return () => {
      window.removeEventListener('instantSyncSuccess', handleInstantSyncSuccess as EventListener);
      window.removeEventListener('instantSyncFailed', handleInstantSyncFailed as EventListener);
    };
  }, []);

  const handleTestInstantSync = async () => {
    const startTime = Date.now();
    addLog(`⚡ Starting instant sync test: +${testAmount} points`);
    
    // Add points locally first
    await updateBalance(testAmount, 'token');
    addLog(`💰 Local balance updated: +${testAmount}`);
    
    // Then sync instantly
    const success = await syncPointsInstantly(testAmount);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (success) {
      addLog(`✅ Instant sync test completed in ${duration}ms`);
    } else {
      addLog(`❌ Instant sync test failed after ${duration}ms`);
    }
  };

  const handleTestProfileSync = async () => {
    addLog('👤 Testing instant profile sync...');
    const startTime = Date.now();
    
    const success = await syncProfileInstantly();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (success) {
      addLog(`✅ Profile sync completed in ${duration}ms`);
    } else {
      addLog(`❌ Profile sync failed after ${duration}ms`);
    }
  };

  const averageSyncTime = syncTimes.length > 0 
    ? Math.round(syncTimes.reduce((a, b) => a + b, 0) / syncTimes.length)
    : 0;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">⚡ Instant Sync Test</h1>
      
      {/* Status */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Instant Sync Status</h2>
        <div className="text-sm space-y-1">
          <div>Local Balance: <span className="font-mono font-bold">{user?.tokenBalance || 0}</span></div>
          <div>Is Syncing: <span className={syncStatus.isInstantSyncing ? 'text-yellow-600' : 'text-gray-600'}>{syncStatus.isInstantSyncing ? 'Yes' : 'No'}</span></div>
          <div>Pending Ops: <span className="font-mono">{syncStatus.pendingOperations}</span></div>
          <div>Last Sync: <span className="font-mono text-xs">{syncStatus.lastInstantSync?.toLocaleTimeString() || 'Never'}</span></div>
          <div>Avg Sync Time: <span className="font-mono font-bold text-green-600">{averageSyncTime}ms</span></div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(Number(e.target.value))}
            className="flex-1 px-2 py-1 border rounded"
            placeholder="Points to test"
          />
          <button
            onClick={handleTestInstantSync}
            disabled={syncStatus.isInstantSyncing}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Test Instant Sync
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleTestProfileSync}
            disabled={syncStatus.isInstantSyncing}
            className="flex-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            Test Profile Sync
          </button>
          <InstantSyncButton size="md" variant="secondary" className="flex-1" />
        </div>
      </div>

      {/* Sync Times */}
      {syncTimes.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded">
          <h3 className="font-semibold mb-2">Recent Sync Times</h3>
          <div className="flex flex-wrap gap-1">
            {syncTimes.map((time, index) => (
              <span 
                key={index} 
                className={`px-2 py-1 rounded text-xs font-mono ${
                  time < 1000 ? 'bg-green-200 text-green-800' :
                  time < 2000 ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}
              >
                {time}ms
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Test Logs</h2>
        <div className="bg-black text-green-400 p-2 rounded text-xs font-mono h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="text-sm text-gray-600">
        <h3 className="font-semibold mb-1">Performance Targets:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li className="text-green-600">Excellent: &lt; 1000ms</li>
          <li className="text-yellow-600">Good: 1000-2000ms</li>
          <li className="text-red-600">Needs improvement: &gt; 2000ms</li>
        </ul>
      </div>
    </div>
  );
}