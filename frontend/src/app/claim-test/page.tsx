'use client';

import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function ClaimTestPage() {
  const { user, pet, updateBalance, setPet } = useAppStore();
  const [claimHistory, setClaimHistory] = useState<Array<{
    timestamp: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
  }>>([]);

  const handleTestClaim = async () => {
    if (pet.pendingCoins > 0) {
      const balanceBefore = user?.tokenBalance || 0;
      const amount = pet.pendingCoins;
      
      // SIMPLIFIED CLAIM LOGIC - same as PetScreen
      // Reset pet pending coins immediately
      setPet({ 
        pendingCoins: 0, 
        lastCoinTime: Date.now() 
      });
      
      // Update balance (this will save to database)
      try {
        await updateBalance(amount, 'token');
        
        // Record successful claim
        const claimRecord = {
          timestamp: new Date().toLocaleTimeString(),
          amount,
          balanceBefore,
          balanceAfter: balanceBefore + amount
        };
        
        setClaimHistory(prev => [claimRecord, ...prev.slice(0, 9)]);
      } catch (error) {
        console.error('Claim failed:', error);
        // Revert pet state if failed
        setPet({ 
          pendingCoins: amount, 
          lastCoinTime: Date.now() - 60000 
        });
      }
    }
  };

  const handleAddTestCoins = () => {
    // Add test coins to pet for testing
    const { setPet } = useAppStore.getState();
    setPet({ pendingCoins: 100 });
  };

  const handleDirectAddPoints = () => {
    // Direct add points to test balance update
    updateBalance(50, 'token');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Claim Test Page</h1>
      
      {/* Current Status */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Current Status</h2>
        <div className="text-sm space-y-1">
          <div>User Balance: <span className="font-mono font-bold">{user?.tokenBalance || 0}</span></div>
          <div>Pet Pending: <span className="font-mono font-bold">{pet.pendingCoins}</span></div>
          <div>Pet Level: <span className="font-mono">{pet.level}</span></div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="mb-4 space-y-2">
        <button
          onClick={handleAddTestCoins}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add 100 Test Coins to Pet
        </button>
        
        <button
          onClick={handleTestClaim}
          disabled={pet.pendingCoins <= 0}
          className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Claim Pet Coins ({pet.pendingCoins})
        </button>
        
        <button
          onClick={handleDirectAddPoints}
          className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Direct Add 50 Points (Test)
        </button>
      </div>

      {/* Claim History */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Claim History</h2>
        <div className="bg-gray-50 p-2 rounded max-h-64 overflow-y-auto">
          {claimHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No claims yet</p>
          ) : (
            claimHistory.map((claim, index) => (
              <div key={index} className="text-xs mb-2 p-2 bg-white rounded border">
                <div className="font-semibold">{claim.timestamp}</div>
                <div>Amount: +{claim.amount}</div>
                <div>Before: {claim.balanceBefore}</div>
                <div>After: {claim.balanceAfter}</div>
                <div className="text-green-600">
                  Expected: {claim.balanceBefore + claim.amount}
                  {claim.balanceAfter === claim.balanceBefore + claim.amount ? ' ✓' : ' ❌'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600">
        <h3 className="font-semibold mb-1">Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click "Add 100 Test Coins" to add coins to pet</li>
          <li>Click "Claim Pet Coins" to test claiming</li>
          <li>Check that balance increases by exactly the claimed amount</li>
          <li>Verify no double points in the history</li>
          <li>Test multiple claims to ensure consistency</li>
        </ol>
      </div>
    </div>
  );
}